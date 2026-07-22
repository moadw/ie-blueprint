/**
 * Deferred loader for the `/settings/stats` page.
 *
 * Mirrors the streaming strategy of `district-home.server.ts`: await only the
 * cheap, up-front data (the "me" user resolution — needed for `createdAt` and to
 * decide the soft/empty state), then fire every slow read (the three per-teacher
 * Amplitude segmentation calls + the Blueprint curriculum fan-out) UN-awaited and
 * return them as per-region promises the route streams in behind skeletons.
 *
 * Regions are grouped by DATA SOURCE so each lights up its dependent UI as soon
 * as that source answers:
 *   - `minutes`    → Total Practice Time card.
 *   - `activity`   → the day-derived UI (streak cards, weekly chain, routine).
 *   - `completion` → Course Completion card + Journey Progress bar.
 *
 * Every per-region promise ALWAYS resolves (never rejects): a rejected promise
 * reaching an `<Await>` without an `errorElement` would white-screen the route
 * via the root ErrorBoundary (CLAUDE.md "Resilient loaders"). The underlying
 * getters already coalesce a soft error to 0 / [], and `deferStat` additionally
 * guards the post-fetch shaping (the completion join).
 */
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { dailyWindow, isAmplitudeConfigured } from "~/lib/amplitude.server";
import {
  getActiveDates,
  getMinutesPracticed,
  getPracticesCompleted,
} from "~/lib/stats.server";
import { UsersFindOneDocument } from "~/queries/users";
import { GroupFindManyDocument } from "~/queries/groups";
import { ClassesByCurriculumFindOneDocument } from "~/queries/classes";

// ---------------------------------------------------------------------------
// Structural types
// ---------------------------------------------------------------------------

/** Course-completion numbers: the Amplitude numerator + the Blueprint denominator. */
export interface StatsCompletion {
  /** Distinct classes the teacher completed (Amplitude, global & forward-only). */
  practicesCompleted: number;
  /** Σ over the teacher's DISTINCT curricula of their non-deleted class count. */
  totalPractices: number;
}

/** The three regions the route streams in behind skeletons. */
export interface StatsDeferred {
  minutes: Promise<number>;
  activity: Promise<string[]>;
  completion: Promise<StatsCompletion>;
}

export interface StatsPageData {
  /** The Date scalar narrowed to a serializable `string | null` (window clamp). */
  createdAt: string | null;
  /** `false` when the Dashboard REST API is unconfigured → soft/empty state. */
  configured: boolean;
  /** Non-null only on a real user-fetch failure → dashed-red error card. */
  error: string | null;
  /** `null` in the soft state (no user, or Amplitude unconfigured). */
  deferred: StatsDeferred | null;
}

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

/**
 * Wrap a per-region async build so it ALWAYS resolves (never rejects). The
 * getters below already soft-fail to 0 / [], but the completion join does
 * post-fetch shaping that could throw — on any throw we resolve to `empty`.
 * (Local copy of the `deferCard` pattern; do NOT couple to district-home.)
 */
async function deferStat<T>(build: () => Promise<T>, empty: T): Promise<T> {
  try {
    return await build();
  } catch {
    return empty;
  }
}

/**
 * `totalPractices` (Course Completion denominator) = Σ over the teacher's
 * DISTINCT curricula of `ClassesByCurriculumFindOne(curr).length` filtered
 * `!deleted`. ("Current curriculum" lives only in client localStorage — not
 * resolvable in a loader — so we sum across ALL the teacher's curricula.) Every
 * call is `safe()`-wrapped; a partial failure degrades to the PARTIAL sum rather
 * than throwing. Mirrors the sibling-count fan-out in
 * `classrooms_.$groupId.$curriculumId.tsx`.
 */
async function computeTotalPractices(
  userId: string,
  headers: Record<string, string>,
): Promise<number> {
  const groupsResult = await safe(
    gqlClient.request(
      GroupFindManyDocument,
      { filter: { manager: userId } },
      headers,
    ),
  );
  const curriculumIds = groupsResult.ok
    ? [
        ...new Set(
          (groupsResult.data.GroupFindMany ?? [])
            .flatMap((g) => g?.curriculums ?? [])
            .filter((id): id is string => Boolean(id)),
        ),
      ]
    : [];

  const counts = await Promise.all(
    curriculumIds.map(async (curriculum) => {
      const r = await safe(
        gqlClient.request(
          ClassesByCurriculumFindOneDocument,
          { curriculum },
          headers,
        ),
      );
      return r.ok
        ? (r.data.ClassesByCurriculumFindOne ?? []).filter(
            (c) => c != null && !c.deleted,
          ).length
        : 0;
    }),
  );
  return counts.reduce((a, b) => a + b, 0);
}

// ---------------------------------------------------------------------------
// Loader entry point (the route calls this)
// ---------------------------------------------------------------------------

/**
 * Resolve the "me" user (the token resolves the current user when `_id` is
 * omitted — same path as settings.profile), decide the soft state synchronously
 * (no resolvable user, or Amplitude unconfigured — no point deferring reads that
 * can't run), then return each region as an UN-awaited promise so the route
 * streams them in behind skeletons. No mock data: a soft error / no activity
 * resolves to an honest zero/empty shape.
 */
export async function getStatsPage(request: Request): Promise<StatsPageData> {
  const token = await requireSessionToken(request);
  const headers = { "access-token": token };

  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, headers),
  );
  const user = userResult.ok ? (userResult.data.UsersFindOne ?? null) : null;
  const createdAt = (user?.createdAt ?? null) as string | null;
  const configured = isAmplitudeConfigured();

  // Soft state — nothing to stream. A user-fetch failure drives the dashed-red
  // card (`error` non-null); a clean miss or an unconfigured Amplitude shows the
  // neutral "not available yet" card (`configured:false`).
  if (!user?._id || !configured) {
    return {
      createdAt,
      configured,
      error: userResult.ok ? null : userResult.error,
      deferred: null,
    };
  }

  const userId = user._id;
  const window = dailyWindow(365);

  // Fire everything UN-awaited so the route can render skeletons immediately.
  const minutes = deferStat(() => getMinutesPracticed(userId, window), 0);
  const activity = deferStat<string[]>(
    () => getActiveDates(userId, window),
    [],
  );
  const completion = deferStat<StatsCompletion>(
    async () => {
      const [practicesCompleted, totalPractices] = await Promise.all([
        getPracticesCompleted(userId, window),
        computeTotalPractices(userId, headers),
      ]);
      return { practicesCompleted, totalPractices };
    },
    { practicesCompleted: 0, totalPractices: 0 },
  );

  return {
    createdAt,
    configured: true,
    error: null,
    deferred: { minutes, activity, completion },
  };
}
