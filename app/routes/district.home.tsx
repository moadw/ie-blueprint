import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, useLoaderData, useRouteLoaderData } from "react-router";
import type { loader as districtLoader } from "./district";
import { getDistrictHome } from "~/lib/district-home.server";
import { DistrictHero } from "~/routes/district/_components/district-hero";
import { EngagementInsightsPanel } from "~/routes/district/_components/engagement-insights-panel";
import { EngagementPanelSkeleton } from "~/routes/district/_components/engagement-panel-skeleton";
import { RecommendedActions } from "~/routes/district/_components/recommended-actions";
import { SchoolsOverviewCard } from "~/routes/district/_components/schools-overview-card";
import { PracticeSessionsCard } from "~/routes/district/_components/practice-sessions-card";
import { AdoptionFunnelCard } from "~/routes/district.analytics/_components/adoption-funnel-card";
import {
  ChartSkeleton,
  ChartError,
} from "~/routes/district.analytics/_components/chart-skeleton";

// ---------------------------------------------------------------------------
// Loader — delegates entirely to the dedicated home server module. It awaits
// only the cheap district resolution + licensed-schools count, then returns the
// four home regions as UN-awaited promises the route streams in behind
// skeletons. Every deferred promise resolves (never rejects), so the loader
// never white-screens the route (CLAUDE.md "Resilient loaders").
// ---------------------------------------------------------------------------

export async function loader({ request }: LoaderFunctionArgs) {
  return await getDistrictHome(request);
}

export default function DistrictHomeRoute() {
  // Hero data still comes from the parent `routes/district` loader (not Amplitude).
  const districtData = useRouteLoaderData<typeof districtLoader>(
    "routes/district",
  );
  const heroDistrict = districtData?.district ?? null;

  const { district, loadError, deferred } = useLoaderData<typeof loader>();

  // Soft-error branch: district resolution failed. Keep the shell + Hero mounted
  // and render an inline error card in place of the streamed cluster/panels
  // (red dashed border, "Couldn't load…") instead of throwing to the root
  // ErrorBoundary. Returning early also narrows `deferred` to non-null below.
  if (!district || !deferred) {
    return (
      <div className="h-full overflow-auto">
        <div className="flex flex-col gap-4 p-5">
          <div className="min-h-[220px]">
            <DistrictHero district={heroDistrict} />
          </div>
          <div className="flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-600">
              {loadError ?? "Couldn't load district home."}
            </p>
          </div>
          <RecommendedActions />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col gap-4 p-5 lg:grid lg:grid-cols-[1fr_380px] lg:grid-rows-[320px_1fr] lg:h-full lg:min-h-[700px]">
        {/* Hero (top-left) */}
        <div className="min-h-[220px] lg:min-h-0">
          <DistrictHero district={heroDistrict} />
        </div>

        {/* Annual Engagement Arc panel (top-right) — streams in behind a dark
            skeleton. `deferCard` resolves application throws to an empty shape;
            `errorElement` degrades an SSR stream-timeout abort to the dark
            skeleton instead of white-screening the route. */}
        <div className="min-h-[320px] lg:min-h-0">
          <Suspense fallback={<EngagementPanelSkeleton />}>
            <Await
              resolve={deferred.engagement}
              errorElement={<EngagementPanelSkeleton />}
            >
              {(engagement) => <EngagementInsightsPanel {...engagement} />}
            </Await>
          </Suspense>
        </div>

        {/* Analytics cluster (bottom-left): User Adoption funnel (2fr) + a
            stacked School Registration / Practice Sessions column (1fr). */}
        <div className="grid grid-cols-1 gap-4 lg:min-h-0 lg:grid-cols-[2fr_1fr]">
          <Suspense fallback={<ChartSkeleton className="min-h-[320px]" />}>
            <Await
              resolve={deferred.adoptionFunnel}
              errorElement={<ChartError className="min-h-[320px]" />}
            >
              {(adoptionFunnel) => (
                <AdoptionFunnelCard adoptionFunnel={adoptionFunnel} />
              )}
            </Await>
          </Suspense>

          <div className="flex flex-col gap-4">
            <Suspense fallback={<ChartSkeleton className="min-h-[150px]" />}>
              <Await
                resolve={deferred.schoolRegistration}
                errorElement={<ChartError className="min-h-[150px]" />}
              >
                {(schoolRegistration) => (
                  <SchoolsOverviewCard {...schoolRegistration} />
                )}
              </Await>
            </Suspense>
            <Suspense fallback={<ChartSkeleton className="min-h-[150px]" />}>
              <Await
                resolve={deferred.practiceSessions}
                errorElement={<ChartError className="min-h-[150px]" />}
              >
                {(practiceSessions) => (
                  <PracticeSessionsCard {...practiceSessions} />
                )}
              </Await>
            </Suspense>
          </div>
        </div>

        {/* Recommended actions (bottom-right) */}
        <div className="lg:min-h-0">
          <RecommendedActions />
        </div>
      </div>
    </div>
  );
}
