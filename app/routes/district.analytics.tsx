import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { AnalyticsHeader } from "~/routes/district.analytics/_components/analytics-header";
import { AnalyticsCardPlaceholder } from "~/routes/district.analytics/_components/analytics-card-placeholder";
import { AdoptionFunnelCard } from "~/routes/district.analytics/_components/adoption-funnel-card";
import { MindfulMinutesCard } from "~/routes/district.analytics/_components/mindful-minutes-card";
import { getDistrictAnalytics, type AnalyticsParams } from "~/lib/district-analytics.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const granularity = url.searchParams.get("granularity");
  const compareStart = url.searchParams.get("compareStart");
  const compareEnd = url.searchParams.get("compareEnd");

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 180);

  const formatDate = (d: Date) => d.toISOString().split("T")[0] ?? "";

  const validatedGranularity =
    granularity === "daily" || granularity === "weekly" || granularity === "monthly"
      ? granularity
      : "daily";

  const params: AnalyticsParams = {
    startDate: start ?? formatDate(defaultStart),
    endDate: end ?? formatDate(today),
    granularity: validatedGranularity,
  };

  if (compareStart) {
    params.compareStart = compareStart;
  }
  if (compareEnd) {
    params.compareEnd = compareEnd;
  }

  const analyticsResult = await getDistrictAnalytics(request, params);
  return { ...analyticsResult, params };
}

export default function DistrictAnalyticsRoute() {
  const { district, data, loadError, params } = useLoaderData<typeof loader>();

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <AnalyticsHeader
          startDate={params.startDate}
          endDate={params.endDate}
          granularity={params.granularity}
          {...(params.compareStart ? { compareStart: params.compareStart } : {})}
          {...(params.compareEnd ? { compareEnd: params.compareEnd } : {})}
        />

        {loadError ? (
          <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-4 px-4">
            <p className="text-xs text-red-600">{loadError}</p>
          </div>
        ) : null}

        {!district || !data ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 py-12 text-center">
            <p className="text-sm text-muted-foreground">Could not load analytics data.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
              <AdoptionFunnelCard adoptionFunnel={data.adoptionFunnel} />
              <MindfulMinutesCard mindfulMinutes={data.mindfulMinutes} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AnalyticsCardPlaceholder title="Retention" className="min-h-[280px]" />
              <AnalyticsCardPlaceholder title="Sessions" className="min-h-[280px]" />
              <AnalyticsCardPlaceholder title="Active Educators" className="min-h-[280px]" />
              <AnalyticsCardPlaceholder title="Insights" className="min-h-[280px]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
