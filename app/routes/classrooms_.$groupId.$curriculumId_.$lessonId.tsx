import { useCallback, useRef, useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { toast } from "sonner";
import { env } from "~/lib/env";
import { trackPracticeCompleted } from "~/lib/analytics";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { ClassesFindOneDocument } from "~/queries/classes";
import { TapFindManyDocument, TapTypeFindManyDocument } from "~/queries/taps";
import { PinFindManyDocument } from "~/queries/pins";
import { CurriculumsFindOneDocument } from "~/queries/curriculums";
import { GroupProgressFindOneDocument } from "~/queries/groups";
import { GroupFinishedClassDocument } from "~/mutations/groups";
import { JournalsCreateOneDocument } from "~/mutations/journals";
import { SortFindManytapInput } from "~/gql/graphql";
import { JournalScreen } from "~/components/lesson/journal-screen";
import { MilestoneScreen } from "~/components/lesson/milestone-screen";
import { PlayerStage } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/player-stage";
import {
  buildPracticeSteps,
  buildTapTypeResolver,
  journalPromptForTap,
  mediaUrlForTap,
  milestonePropsForPin,
  resolveTapType,
} from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/practice-steps";
import { resolveJournalQuestionLabels } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/resolve-journal-questions";

/**
 * Detail / practice-player loader.
 *
 * NOTE: the `:lessonId` route param carries a **class** `_id`, not a lesson id.
 * The segment name is intentionally NOT renamed (see plan "What We're NOT
 * Doing") — renaming touches the param key, the `_components/` folder name, and
 * every import. Treat `lessonId` as `classId` throughout this file.
 *
 * Mirrors the curriculum route's loader pattern: resolve the session, guard the
 * params + `env.PLATFORM`, then run the domain fetches under `safe()` so a
 * backend 500 renders a soft inline card instead of white-screening the route.
 *
 * Five parallel `safe()` fetches: the class itself, its taps (ordered), its
 * optional pin, the tap-type catalog (to resolve `tap.type` slug-vs-id), and
 * the parent curriculum (its title is the player's `seriesName`).
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const { groupId, curriculumId, lessonId } = params;
  if (!groupId || !curriculumId || !lessonId) {
    throw new Response("Not Found", { status: 404 });
  }

  const headers = { "access-token": token };

  if (!env.PLATFORM) {
    return {
      groupId,
      curriculumId,
      lessonId,
      classItem: null,
      taps: [],
      pin: null,
      tapTypes: [],
      curriculumTitle: null,
      questionLabels: {} as Record<string, string>,
      classError:
        "Platform is not configured. Please contact your administrator.",
      tapsError: null,
    };
  }

  const [
    classResult,
    tapsResult,
    pinResult,
    tapTypesResult,
    curriculumResult,
    progressResult,
  ] = await Promise.all([
      safe(
        // Teacher-safe single-class fetch (the admin `ClassesAdminFindOne` is
        // role-gated). `ClassesFindOne` takes `_id` directly (not a filter).
        gqlClient.request(
          ClassesFindOneDocument,
          { _id: lessonId },
          headers,
        ),
      ),
      safe(
        gqlClient.request(
          TapFindManyDocument,
          {
            filter: { class: lessonId, platform: env.PLATFORM },
            limit: 100,
            sort: SortFindManytapInput.ORDER_ASC,
          },
          headers,
        ),
      ),
      safe(
        gqlClient.request(
          PinFindManyDocument,
          { filter: { class: lessonId, platform: env.PLATFORM }, limit: 1 },
          headers,
        ),
      ),
      safe(
        // Scope tap-types to this platform: the catalog is shared across products
        // (it returns duplicate identifiers like two `video`s otherwise), and IE
        // only owns a small subset. Classification degrades gracefully even if a
        // type is excluded — `resolveTapType` falls back to the raw `tap.type`
        // slug when the resolver misses.
        gqlClient.request(
          TapTypeFindManyDocument,
          { filter: { platform: env.PLATFORM }, limit: 100 },
          headers,
        ),
      ),
      safe(
        gqlClient.request(
          CurriculumsFindOneDocument,
          { filter: { _id: curriculumId, platform: env.PLATFORM } },
          headers,
        ),
      ),
      safe(
        // Group-progress `_id` is needed by the completion mutation
        // (`GroupFinishedClass`) at the final media step. Non-critical player
        // chrome — a failure must NOT block playback and renders no error card;
        // the mutation simply no-ops when the id is missing.
        gqlClient.request(
          GroupProgressFindOneDocument,
          { filter: { group: groupId, curriculum: curriculumId } },
          headers,
        ),
      ),
    ]);

  const classItem = classResult.ok ? classResult.data.ClassesFindOne : null;

  // Soft delete = { deleted: true }; filter client-side then order by `order`
  // (matches the admin `tap-blocks.tsx` precedent).
  const taps = tapsResult.ok
    ? (tapsResult.data.TapFindMany ?? [])
        .filter((t) => !t.deleted)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  // 0–1 pin per class; the pin's soft-delete flag is `deletedAt` (not `deleted`).
  const pin = pinResult.ok
    ? ((pinResult.data.PinFindMany ?? []).find((p) => !p.deletedAt) ?? null)
    : null;

  // Tap-type catalog → best-effort `tap.type` slug-vs-id resolution. A failed
  // fetch degrades to raw `tap.type` (no error card — the slug branch still
  // works when `tap.type` is already a slug).
  const tapTypes = tapTypesResult.ok
    ? (tapTypesResult.data.TapTypeFindMany ?? [])
    : [];

  // Curriculum title drives the player's `seriesName`. Non-critical chrome —
  // a failed fetch falls back to the class title, no error card.
  const curriculumTitle = curriculumResult.ok
    ? (curriculumResult.data.CurriculumsFindOne?.title ?? null)
    : null;

  // Group-progress `_id` for the completion mutation. Non-critical chrome: on a
  // failed fetch (or a null record) it stays `null` and the completion call is
  // skipped — playback is never blocked and no error card is rendered.
  const groupProgressId = progressResult.ok
    ? (progressResult.data.GroupProgressFindOne?._id ?? null)
    : null;

  // Journal taps store their prompt as a `questions` entity id in
  // `extraQuestions[0].question` (NOT text); resolve those ids to label text so
  // the journal screen shows the real prompt instead of a UUID.
  const tapTypeResolver = buildTapTypeResolver(tapTypes);
  const questionLabels = await resolveJournalQuestionLabels(
    taps,
    tapTypeResolver,
    headers,
  );

  return {
    groupId,
    curriculumId,
    lessonId,
    classItem,
    taps,
    pin,
    tapTypes,
    curriculumTitle,
    groupProgressId,
    questionLabels,
    classError: classResult.error,
    tapsError: tapsResult.error,
  };
}

export default function LessonPlayerRoute() {
  const {
    groupId,
    curriculumId,
    lessonId,
    classItem,
    taps,
    pin,
    tapTypes,
    curriculumTitle,
    groupProgressId,
    questionLabels,
    classError,
    tapsError,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [stepIndex, setStepIndex] = useState(0);
  // Disables the journal buttons + shows a spinner while the entry is saving.
  const [savingJournal, setSavingJournal] = useState(false);

  // Fire `GroupFinishedClass` at most once per practice completion — a ref (not
  // state) so re-renders / replays of the final media step don't re-fire it.
  const finishedRef = useRef(false);

  const exitToCurriculum = useCallback(() => {
    navigate(`/classrooms/${groupId}/${curriculumId}`);
  }, [navigate, groupId, curriculumId]);

  // Soft inline error card — never white-screen on a backend 500.
  if (classError || tapsError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
        <ErrorCard label="practice" message={classError ?? tapsError ?? ""} />
      </div>
    );
  }

  const resolver = buildTapTypeResolver(tapTypes);
  const steps = buildPracticeSteps(taps, pin, resolver);
  const current = steps[stepIndex];

  // Index of the FIRST media (player) step. Completion fires when this first
  // media tap ends — the practice counts as done after the main video/audio,
  // even if more taps (journal/achievement) follow. `-1` when there are no
  // media steps, in which case the media-less fallback in `advance` records
  // completion as the runner exits instead.
  const firstMediaStepIndex = steps.findIndex((step) => step.kind === "player");

  // No taps (and therefore nothing to play before any achievement) → empty state.
  if (taps.length === 0 || steps.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 px-6 text-center text-white">
        <p className="font-serif text-xl text-white/70">
          This practice doesn&apos;t have any content yet.
        </p>
      </div>
    );
  }

  // Advancing past the last step exits to the curriculum. Guard `current`
  // (`noUncheckedIndexedAccess`) so a transient out-of-range index after the
  // final advance renders nothing rather than crashing.
  const advance = () => {
    setStepIndex((i) => {
      const next = i + 1;
      if (next >= steps.length) {
        // Media-less practices (journal/achievement only) never reach
        // `handleMediaEnded`, so record completion once as the runner exits.
        // `recordCompletion`'s `finishedRef` keeps this idempotent.
        if (firstMediaStepIndex === -1) void recordCompletion();
        exitToCurriculum();
        return i;
      }
      return next;
    });
  };

  // Record the practice as finished when the final media step ends, then
  // revalidate so the series page's `GroupProgressFindOne` re-fetches and the
  // bar/badges update. `:lessonId` IS the class `_id` (see loader note), passed
  // directly as the mutation's `class` arg. No-ops when `groupProgressId` is
  // absent (degraded loader fetch) and fires at most once (the ref guard).
  const recordCompletion = async () => {
    if (finishedRef.current || !groupProgressId) return;
    finishedRef.current = true;
    // Analytics: "completed a practice" signal (a practice is a class, so the
    // class `_id` = `lessonId` is the contentId). Powers the district "Active
    // User" metric (logs in AND completes ≥1 practice). Client-only, best-effort.
    trackPracticeCompleted({ contentId: lessonId });
    try {
      // `gqlClient` middleware injects `access-token` client-side — no header.
      const result = await gqlClient.request(GroupFinishedClassDocument, {
        _id: groupProgressId,
        class: lessonId,
      });
      if (result.GroupFinishedClass !== true) {
        finishedRef.current = false;
        toast.error("Couldn't record practice completion. Please try again.");
        return;
      }
      revalidator.revalidate();
    } catch (err) {
      finishedRef.current = false;
      const message =
        err instanceof Error
          ? err.message
          : "Couldn't record practice completion. Please try again.";
      toast.error(message);
    }
  };

  // Wrap the media player's end event: when the step that ends is the FIRST
  // media step, record completion (fire-and-forget) in addition to advancing.
  const handleMediaEnded = () => {
    if (stepIndex === firstMediaStepIndex) {
      void recordCompletion();
    }
    advance();
  };

  // Persist the journal entry via `JournalsCreateOne`, then advance. Mirrors
  // `recordCompletion`: client-side `gqlClient` injects `access-token` (no
  // header). On failure we toast and stay so the user can retry; "Skip" never
  // calls this. `question` is a free String — pass the prompt text, falling
  // back to a title so the required arg is never empty.
  const handleJournalSubmit = async (content: string) => {
    const tap = current?.kind === "journal" ? current.tap : null;
    const tapId = tap?._id;
    if (!tap || !tapId) {
      advance();
      return;
    }
    setSavingJournal(true);
    try {
      await gqlClient.request(JournalsCreateOneDocument, {
        body: content,
        question:
          journalPromptForTap(tap, questionLabels) ||
          tap.title ||
          classItem?.title ||
          "Reflection",
        tap: tapId,
        class: lessonId,
        group: groupId,
      });
      advance();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Couldn't save your journal entry. Please try again.";
      toast.error(message);
    } finally {
      setSavingJournal(false);
    }
  };

  // Class-level chrome stays constant across a class's taps; only the media
  // changes per tap. `seriesName` = curriculum title, falling back to the class
  // title. There is no grade data source, so `gradeLabel` is empty (the badge
  // drops the trailing bullet when it is).
  const dayLabel = `Day ${classItem?.order ?? 1}`;
  const seriesName = curriculumTitle ?? classItem?.title ?? "";

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      {current?.kind === "player" ? (
        <PlayerStage
          key={stepIndex}
          media={current.media}
          title={current.tap.title ?? classItem?.title ?? ""}
          description={current.tap.description ?? classItem?.description ?? ""}
          dayLabel={dayLabel}
          gradeLabel=""
          seriesName={seriesName}
          mediaUrl={mediaUrlForTap(current.tap)}
          {...(current.tap._id ? { contentId: current.tap._id } : {})}
          {...(() => {
            const t = resolveTapType(current.tap, resolver);
            return t ? { tapType: t } : {};
          })()}
          onExit={exitToCurriculum}
          onEnded={handleMediaEnded}
        />
      ) : null}

      {current?.kind === "journal" ? (
        <JournalScreen
          prompt={journalPromptForTap(current.tap, questionLabels)}
          submitting={savingJournal}
          onSubmit={handleJournalSubmit}
          onSkip={advance}
        />
      ) : null}

      {current?.kind === "achievement" ? (
        <MilestoneScreen
          {...milestonePropsForPin(current.pin, classItem?.title)}
          onContinue={advance}
        />
      ) : null}
    </div>
  );
}

function ErrorCard({ label, message }: { label: string; message: string }) {
  return (
    <div className="max-w-md rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
      <p className="mb-1 text-sm font-medium text-red-700">
        Couldn&apos;t load {label}
      </p>
      <p className="text-xs text-red-600">{message}</p>
    </div>
  );
}
