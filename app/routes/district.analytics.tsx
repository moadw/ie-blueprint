import { useLoaderData, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { AnalyticsHeader } from "~/routes/district.analytics/_components/analytics-header";
import { AdoptionFunnelCard } from "~/routes/district.analytics/_components/adoption-funnel-card";
import { MindfulMinutesCard } from "~/routes/district.analytics/_components/mindful-minutes-card";
import { RetentionCard } from "~/routes/district.analytics/_components/retention-card";
import { SessionsCard } from "~/routes/district.analytics/_components/sessions-card";
import { ActiveEducatorsCard } from "~/routes/district.analytics/_components/active-educators-card";
import { InsightCard } from "~/routes/district.analytics/_components/insight-card";
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
  };

  const analyticsResult = await getDistrictAnalytics(request, params);
  return { ...analyticsResult, params };
}

export default function DistrictAnalyticsRoute() {
  const { district, data, loadError, params } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

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
          <div
            className={`space-y-6 transition-opacity duration-200 ${
              isLoading ? "opacity-60" : "opacity-100"
            }`}
          >
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
              <AdoptionFunnelCard adoptionFunnel={data.adoptionFunnel} />
              <MindfulMinutesCard mindfulMinutes={data.mindfulMinutes} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <RetentionCard retention={data.retention} />
              <SessionsCard sessions={data.sessions} />
              <ActiveEducatorsCard activeEducators={data.activeEducators} />
              <InsightCard insights={data.insights} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
