import { useMemo } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { getTeacherStats } from "~/lib/stats.server";
import { useHydrated } from "~/hooks/use-hydrated";
import { UsersFindOneDocument } from "~/queries/users";
import { GroupFindManyDocument } from "~/queries/groups";
import { ClassesByCurriculumFindOneDocument } from "~/queries/classes";
import { SectionHeader } from "~/routes/settings/_components/section-header";
import { StatCard } from "~/routes/settings/_components/stats/stat-card";
import { WeeklyChain } from "~/routes/settings/_components/stats/weekly-chain";
import { JourneyProgress } from "~/routes/settings/_components/stats/journey-progress";
import { RoutineCard } from "~/routes/settings/_components/stats/routine-card";
import {
  deriveDayMetrics,
  resolveWindowStart,
  PLACEHOLDER_DAY_METRICS,
} from "~/routes/settings/_lib/stats-derive";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const headers = { "access-token": token };

  // "me" — the token resolves the current user when `_id` is omitted (same path
  // as settings.profile). `safe()` keeps a backend 500 from white-screening the
  // page; a miss/error degrades to the soft state below (never fixtures).
  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, headers),
  );
  const user = userResult.ok ? (userResult.data.UsersFindOne ?? null) : null;

  // No resolvable user → soft/empty state. `error` (non-null only on a real
  // fetch failure) drives the dashed-red card; a clean miss shows the neutral
  // "not available yet" card via `configured:false`.
  if (!user?._id) {
    return {
      minutesPracticed: 0,
      practicesCompleted: 0,
      totalPractices: 0,
      activeDates: [] as string[],
      createdAt: null as string | null,
      configured: false,
      error: userResult.ok ? null : userResult.error,
    };
  }

  // Per-teacher Amplitude read-back (step-2). Soft-fails internally to an
  // all-zero/empty shape with `configured:false`; never throws.
  const stats = await getTeacherStats(user._id, token);

  // `totalPractices` (Blueprint denominator) = Σ over the teacher's DISTINCT
  // curricula of `ClassesByCurriculumFindOne(curr).length` filtered `!deleted`.
  // ("Current curriculum" lives only in client localStorage — not resolvable in
  // a loader — so we sum across ALL the teacher's curricula.) Every call is
  // `safe()`-wrapped; a partial failure degrades to the PARTIAL sum rather than
  // crashing the route. Mirrors the sibling-count fan-out in
  // `classrooms_.$groupId.$curriculumId.tsx`.
  const groupsResult = await safe(
    gqlClient.request(
      GroupFindManyDocument,
      { filter: { manager: user._id } },
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
  const totalPractices = counts.reduce((a, b) => a + b, 0);

  return {
    minutesPracticed: stats.minutesPracticed,
    practicesCompleted: stats.practicesCompleted,
    totalPractices,
    activeDates: stats.activeDates,
    // `createdAt` is the Date scalar (typed `any`); narrow to a serializable
    // `string | null` so the client `windowStart` clamp gets a stable type.
    createdAt: (user.createdAt ?? null) as string | null,
    configured: stats.configured,
    error: userResult.ok ? null : userResult.error,
  };
}

export default function SettingsStatsRoute() {
  const {
    minutesPracticed,
    practicesCompleted,
    totalPractices,
    activeDates,
    createdAt,
    configured,
    error,
  } = useLoaderData<typeof loader>();

  const hydrated = useHydrated();

  // tz-sensitive day metrics — computed ONLY after hydration with the browser's
  // local `new Date()` so "today"/"this week" match the viewer's timezone (not
  // the SSR/UTC server). First paint renders a stable placeholder to avoid a
  // React hydration mismatch; the loader scalars below render on SSR normally.
  const day = useMemo(() => {
    if (!hydrated) return PLACEHOLDER_DAY_METRICS;
    const today = new Date();
    return deriveDayMetrics(activeDates, today, resolveWindowStart(createdAt, today));
  }, [hydrated, activeDates, createdAt]);

  // Course Completion clamp: the numerator (`practicesCompleted`, global &
  // forward-only) can exceed the denominator (`totalPractices`, current curricula
  // only), and `totalPractices` can be 0. Guard both so the JourneyProgress bar
  // never overflows the track / renders `NaN%`. The StatCard still shows the
  // TRUE `practicesCompleted / totalPractices` count; only the bar math is clamped.
  const hasTotal = totalPractices > 0;
  const clampedCompleted = Math.min(practicesCompleted, totalPractices);

  const showSoftState = Boolean(error) || !configured;

  return (
    <div className="max-w-2xl space-y-5">
      <SectionHeader
        title="My Stats"
        subtitle="Track your mindfulness journey and celebrate your progress."
      />

      {showSoftState ? (
        error ? (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-4 px-4">
            <p className="text-xs text-red-600">Couldn&apos;t load your stats.</p>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Stats aren&apos;t available yet. Complete a practice to start
              tracking your progress.
            </p>
          </div>
        )
      ) : (
        <>
          {/* Top Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard value={minutesPracticed} label="Total Practice Time" />
            <StatCard value={day.dayStreak} label="Current Day Streak" />
            <StatCard value={day.longestStreak} label="Longest Streak" />
            <StatCard
              value={hasTotal ? practicesCompleted : "—"}
              {...(hasTotal ? { suffix: `/${totalPractices}` } : {})}
              label="Course Completion"
            />
          </div>

          {/* Weekly Chain */}
          <WeeklyChain
            completedDays={day.completedDays}
            currentDayIndex={day.currentDayIndex}
          />

          {/* Journey Progress — hidden when there's no denominator (avoids NaN%) */}
          {hasTotal ? (
            <JourneyProgress
              currentPractice={clampedCompleted}
              totalPractices={totalPractices}
            />
          ) : null}

          {/* Routine Card */}
          <RoutineCard averageDaysPerWeek={day.averageDaysPerWeek} />
        </>
      )}
    </div>
  );
}
