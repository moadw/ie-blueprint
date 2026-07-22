import { Suspense, useMemo } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, useLoaderData } from "react-router";

import { getStatsPage } from "~/lib/stats-page.server";
import type { StatsCompletion } from "~/lib/stats-page.server";
import { useHydrated } from "~/hooks/use-hydrated";
import { SectionHeader } from "~/routes/settings/_components/section-header";
import { StatCard } from "~/routes/settings/_components/stats/stat-card";
import { WeeklyChain } from "~/routes/settings/_components/stats/weekly-chain";
import { JourneyProgress } from "~/routes/settings/_components/stats/journey-progress";
import { RoutineCard } from "~/routes/settings/_components/stats/routine-card";
import {
  JourneyProgressSkeleton,
  RoutineCardSkeleton,
  StatCardSkeleton,
  StatRegionError,
  WeeklyChainSkeleton,
} from "~/routes/settings/_components/stats/stat-skeletons";
import {
  deriveDayMetrics,
  resolveWindowStart,
  PLACEHOLDER_DAY_METRICS,
  type DayMetrics,
} from "~/routes/settings/_lib/stats-derive";

// ---------------------------------------------------------------------------
// Loader — delegates to the dedicated stats-page server module. It awaits only
// the cheap "me" resolution, then returns the three regions as UN-awaited
// promises the route streams in behind skeletons (CLAUDE.md "Resilient
// loaders"; same strategy as /district/home).
// ---------------------------------------------------------------------------

export async function loader({ request }: LoaderFunctionArgs) {
  return await getStatsPage(request);
}

/**
 * tz-sensitive day metrics — computed ONLY after hydration with the browser's
 * local `new Date()` so "today"/"this week" match the viewer's timezone (not the
 * SSR/UTC server). First paint renders a stable placeholder to avoid a React
 * hydration mismatch. Shared by every `activity`-derived region.
 */
function useDayMetrics(
  activeDates: string[],
  createdAt: string | null,
): DayMetrics {
  const hydrated = useHydrated();
  return useMemo(() => {
    if (!hydrated) return PLACEHOLDER_DAY_METRICS;
    const today = new Date();
    return deriveDayMetrics(
      activeDates,
      today,
      resolveWindowStart(createdAt, today),
    );
  }, [hydrated, activeDates, createdAt]);
}

// --- `activity`-derived regions (streams behind their own skeletons) ---------

/** The two day-streak tiles (grid cells 2 & 3). */
function StreakCards({
  activeDates,
  createdAt,
}: {
  activeDates: string[];
  createdAt: string | null;
}) {
  const day = useDayMetrics(activeDates, createdAt);
  return (
    <>
      <StatCard value={day.dayStreak} label="Current Day Streak" />
      <StatCard value={day.longestStreak} label="Longest Streak" />
    </>
  );
}

function WeeklyChainRegion({
  activeDates,
  createdAt,
}: {
  activeDates: string[];
  createdAt: string | null;
}) {
  const day = useDayMetrics(activeDates, createdAt);
  return (
    <WeeklyChain
      completedDays={day.completedDays}
      currentDayIndex={day.currentDayIndex}
    />
  );
}

function RoutineCardRegion({
  activeDates,
  createdAt,
}: {
  activeDates: string[];
  createdAt: string | null;
}) {
  const day = useDayMetrics(activeDates, createdAt);
  return <RoutineCard averageDaysPerWeek={day.averageDaysPerWeek} />;
}

// --- `completion`-derived regions --------------------------------------------

/**
 * Course Completion clamp: the numerator (`practicesCompleted`, global &
 * forward-only) can exceed the denominator (`totalPractices`, current curricula
 * only), and `totalPractices` can be 0. The card still shows the TRUE
 * `practicesCompleted / totalPractices` count; only the bar math is clamped
 * (JourneyProgress) so it never overflows / renders `NaN%`.
 */
function CourseCompletionCard({ practicesCompleted, totalPractices }: StatsCompletion) {
  const hasTotal = totalPractices > 0;
  return (
    <StatCard
      value={hasTotal ? practicesCompleted : "—"}
      {...(hasTotal ? { suffix: `/${totalPractices}` } : {})}
      label="Course Completion"
    />
  );
}

/** Journey Progress bar — hidden when there's no denominator (avoids NaN%). */
function JourneyProgressRegion({ practicesCompleted, totalPractices }: StatsCompletion) {
  if (totalPractices <= 0) return null;
  return (
    <JourneyProgress
      currentPractice={Math.min(practicesCompleted, totalPractices)}
      totalPractices={totalPractices}
    />
  );
}

export default function SettingsStatsRoute() {
  const { createdAt, configured, error, deferred } =
    useLoaderData<typeof loader>();

  // Soft state (known synchronously — no skeleton): a user-fetch failure shows
  // the dashed-red card; a clean miss / unconfigured Amplitude shows the neutral
  // "not available yet" card.
  if (error || !configured || !deferred) {
    return (
      <div className="max-w-2xl space-y-5">
        <SectionHeader
          title="My Stats"
          subtitle="Track your mindfulness journey and celebrate your progress."
        />
        {error ? (
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
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <SectionHeader
        title="My Stats"
        subtitle="Track your mindfulness journey and celebrate your progress."
      />

      {/* Top Stats Grid — each source streams into its cell(s) independently. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Suspense fallback={<StatCardSkeleton />}>
          <Await
            resolve={deferred.minutes}
            errorElement={<StatRegionError className="min-h-[100px]" />}
          >
            {(minutes) => (
              <StatCard value={minutes} label="Total Practice Time" />
            )}
          </Await>
        </Suspense>

        <Suspense
          fallback={
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          }
        >
          <Await
            resolve={deferred.activity}
            errorElement={
              <>
                <StatRegionError className="min-h-[100px]" />
                <StatRegionError className="min-h-[100px]" />
              </>
            }
          >
            {(activeDates) => (
              <StreakCards activeDates={activeDates} createdAt={createdAt} />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <Await
            resolve={deferred.completion}
            errorElement={<StatRegionError className="min-h-[100px]" />}
          >
            {(completion) => <CourseCompletionCard {...completion} />}
          </Await>
        </Suspense>
      </div>

      {/* Weekly Chain */}
      <Suspense fallback={<WeeklyChainSkeleton />}>
        <Await
          resolve={deferred.activity}
          errorElement={<StatRegionError className="min-h-[200px]" />}
        >
          {(activeDates) => (
            <WeeklyChainRegion activeDates={activeDates} createdAt={createdAt} />
          )}
        </Await>
      </Suspense>

      {/* Journey Progress — collapses to nothing when there's no denominator. */}
      <Suspense fallback={<JourneyProgressSkeleton />}>
        <Await
          resolve={deferred.completion}
          errorElement={<StatRegionError className="min-h-[120px]" />}
        >
          {(completion) => <JourneyProgressRegion {...completion} />}
        </Await>
      </Suspense>

      {/* Routine Card */}
      <Suspense fallback={<RoutineCardSkeleton />}>
        <Await
          resolve={deferred.activity}
          errorElement={<StatRegionError className="min-h-[160px]" />}
        >
          {(activeDates) => (
            <RoutineCardRegion activeDates={activeDates} createdAt={createdAt} />
          )}
        </Await>
      </Suspense>
    </div>
  );
}
