import type { ReactNode } from "react";
import { useRouteLoaderData } from "react-router";
import type { loader as districtLoader } from "./district";
import { DistrictHero } from "~/routes/district/_components/district-hero";
import {
  DistrictStatCard,
  type DistrictStatStatus,
} from "~/routes/district/_components/district-stat-card";
import {
  BarChartMini,
  ComparisonBar,
} from "~/routes/district/_components/mini-charts";
import { EngagementInsightsPanel } from "~/routes/district/_components/engagement-insights-panel";
import { RecommendedActions } from "~/routes/district/_components/recommended-actions";

interface StatCard {
  title: string;
  value: string;
  suffix?: string;
  status: DistrictStatStatus;
  chart: ReactNode;
}

const STAT_CARDS: StatCard[] = [
  {
    title: "Daily Active Sessions Index",
    value: "82",
    suffix: "/100",
    status: "Normal",
    chart: (
      <BarChartMini
        data={[40, 65, 55, 80, 72, 90, 82]}
        color="var(--color-primary)"
      />
    ),
  },
  {
    title: "School Participation Index",
    value: "0.96",
    status: "Normal",
    chart: (
      <BarChartMini
        data={[70, 85, 60, 95, 88, 75, 96]}
        color="var(--color-primary)"
      />
    ),
  },
  {
    title: "Avg Session Duration",
    value: "1.2",
    suffix: "min",
    status: "Moderate",
    chart: <ComparisonBar average={3.5} yours={1.2} color="var(--color-primary)" />,
  },
  {
    title: "Total Minutes Listened",
    value: "715",
    suffix: "hrs",
    status: "Moderate",
    chart: <ComparisonBar average={1200} yours={715} color="#f97316" />,
  },
];

export default function DistrictHomeRoute() {
  const data = useRouteLoaderData<typeof districtLoader>("routes/district");
  const district = data?.district ?? null;

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col gap-4 p-5 lg:grid lg:grid-cols-[1fr_380px] lg:grid-rows-[minmax(280px,2.3fr)_minmax(0,2.7fr)] lg:h-full lg:min-h-[700px]">
        {/* Hero */}
        <div className="min-h-[220px] lg:min-h-0">
          <DistrictHero district={district} />
        </div>

        {/* Engagement insights panel */}
        <div className="min-h-[320px] lg:min-h-0">
          <EngagementInsightsPanel />
        </div>

        {/* Stat-card grid */}
        <div className="grid grid-cols-2 gap-3">
          {STAT_CARDS.map((card) => (
            <DistrictStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              {...(card.suffix !== undefined ? { suffix: card.suffix } : {})}
              status={card.status}
              chart={card.chart}
            />
          ))}
        </div>

        {/* Recommended actions */}
        <div>
          <RecommendedActions />
        </div>
      </div>
    </div>
  );
}
