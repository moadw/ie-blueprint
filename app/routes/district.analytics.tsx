import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { AnalyticsHeader } from "~/routes/district.analytics/_components/analytics-header";
import { AdoptionFunnelCard } from "~/routes/district.analytics/_components/adoption-funnel-card";
import { MindfulMinutesCard } from "~/routes/district.analytics/_components/mindful-minutes-card";
import { RetentionCard } from "~/routes/district.analytics/_components/retention-card";
import { SessionsCard } from "~/routes/district.analytics/_components/sessions-card";
import { ActiveEducatorsCard } from "~/routes/district.analytics/_components/active-educators-card";
import { InsightCard } from "~/routes/district.analytics/_components/insight-card";
import { ChartSkeleton, ChartError } from "~/routes/district.analytics/_components/chart-skeleton";
import { getDistrictAnalytics, type AnalyticsParams } from "~/lib/district-analytics.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const granularity = url.searchParams.get("granularity");
  const compareStart = url.searchParams.get("compareStart");
  const compareEnd = url.searchParams.get("compareEnd");
  const school = url.searchParams.get("school");

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 180);

  const formatDate = (d: Date) => d.toISOString().split("T")[0] ?? "";

  const validatedGranularity =
    granularity === "daily" || granularity === "weekly" || granularity === "monthly"
      ? granularity
      : "weekly";

  const startDate = start ?? formatDate(defaultStart);
  const endDate = end ?? formatDate(today);

  // Default comparison period: immediately before the primary range, same length.
  const primaryStart = new Date(`${startDate}T00:00:00`);
  const primaryEnd = new Date(`${endDate}T00:00:00`);
  const lengthDays =
    Math.floor((primaryEnd.getTime() - primaryStart.getTime()) / 86_400_000) + 1;

  const defaultCompareEnd = new Date(primaryStart);
  defaultCompareEnd.setDate(primaryStart.getDate() - 1);
  const defaultCompareStart = new Date(defaultCompareEnd);
  defaultCompareStart.setDate(defaultCompareEnd.getDate() - (lengthDays - 1));

  const params: AnalyticsParams = {
    startDate,
    endDate,
    granularity: validatedGranularity,
    compareStart: compareStart ?? formatDate(defaultCompareStart),
    compareEnd: compareEnd ?? formatDate(defaultCompareEnd),
    // Omit `schoolId` entirely when absent (exactOptionalPropertyTypes).
    ...(school ? { schoolId: school } : {}),
  };

  const analyticsResult = await getDistrictAnalytics(request, params);
  return { ...analyticsResult, params };
}

export default function DistrictAnalyticsRoute() {
  // `district` is intentionally unused here — see the `!deferred` guard below.
  const { schools, schoolId, deferred, loadError, params } =
    useLoaderData<typeof loader>();

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <AnalyticsHeader
          startDate={params.startDate}
          endDate={params.endDate}
          granularity={params.granularity}
          schools={schools}
          {...(params.compareStart ? { compareStart: params.compareStart } : {})}
          {...(params.compareEnd ? { compareEnd: params.compareEnd } : {})}
          {...(schoolId ? { schoolId } : {})}
        />

        {loadError ? (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-4 px-4">
            <p className="text-xs text-red-600">{loadError}</p>
          </div>
        ) : null}

        {/* `district` is legitimately `null` for a school-admin (no district
            concept for that role) — `deferred` alone tells us whether the
            loader actually resolved a scope (district OR the caller's own
            schools) vs hit an error. */}
        {!deferred ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 py-12 text-center">
            <p className="text-sm text-muted-foreground">Could not load analytics data.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Each card streams in behind a skeleton as its (school-filtered)
                Amplitude data resolves. `deferCard` resolves application throws to
                empty shapes, but an SSR stream-timeout abort rejects a still-pending
                promise client-side — `errorElement` degrades that one card to a soft
                error instead of white-screening the whole route. */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
              <Suspense fallback={<ChartSkeleton className="min-h-[360px]" />}>
                <Await
                  resolve={deferred.adoptionFunnel}
                  errorElement={<ChartError className="min-h-[360px]" />}
                >
                  {(adoptionFunnel) => (
                    <AdoptionFunnelCard adoptionFunnel={adoptionFunnel} />
                  )}
                </Await>
              </Suspense>
              <Suspense fallback={<ChartSkeleton className="min-h-[360px]" />}>
                <Await
                  resolve={deferred.mindfulMinutes}
                  errorElement={<ChartError className="min-h-[360px]" />}
                >
                  {(mindfulMinutes) => (
                    <MindfulMinutesCard mindfulMinutes={mindfulMinutes} />
                  )}
                </Await>
              </Suspense>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Suspense fallback={<ChartSkeleton className="min-h-[260px]" />}>
                <Await
                  resolve={deferred.retention}
                  errorElement={<ChartError className="min-h-[260px]" />}
                >
                  {(retention) => <RetentionCard retention={retention} />}
                </Await>
              </Suspense>
              <Suspense fallback={<ChartSkeleton className="min-h-[260px]" />}>
                <Await
                  resolve={deferred.sessions}
                  errorElement={<ChartError className="min-h-[260px]" />}
                >
                  {(sessions) => <SessionsCard sessions={sessions} />}
                </Await>
              </Suspense>
              <Suspense fallback={<ChartSkeleton className="min-h-[260px]" />}>
                <Await
                  resolve={deferred.activeEducators}
                  errorElement={<ChartError className="min-h-[260px]" />}
                >
                  {(activeEducators) => (
                    <ActiveEducatorsCard activeEducators={activeEducators} />
                  )}
                </Await>
              </Suspense>
              <Suspense fallback={<ChartSkeleton className="min-h-[260px]" />}>
                <Await
                  resolve={deferred.insights}
                  errorElement={<ChartError className="min-h-[260px]" />}
                >
                  {(insights) => <InsightCard insights={insights} />}
                </Await>
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
