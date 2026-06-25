import type { ReactNode } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteLoaderData } from "react-router";
import type { loader as districtLoader } from "./district";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import {
  dailyWindow,
  getAvgSessionDuration,
  getCompletedUsersTotal,
  getDailyActiveSessionsIndex,
  getSchoolParticipationIndex,
  getTotalMinutesListened,
  type MetricParams,
  type MetricResult,
} from "~/lib/amplitude.server";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { UsersByOrganizationTotalDocument } from "~/queries/users";
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

// ---------------------------------------------------------------------------
// Loader — resolves the district org, then calls the four KPI metric
// functions. Avg Session Duration is real (step-3); the other three are stubs
// returning null until steps 4/5/6 implement them (cards fall back gracefully).
// Every Amplitude/data call is safe()-wrapped inside the metric functions, so
// this loader never throws (CLAUDE.md "Resilient loaders").
// ---------------------------------------------------------------------------

interface HomeMetrics {
  avgSessionDuration: MetricResult | null;
  dailyActiveSessionsIndex: MetricResult | null;
  schoolParticipationIndex: MetricResult | null;
  totalMinutesListened: MetricResult | null;
}

// Engagement panel (right gauge). `activeUserRate` = % of org users who logged
// in AND completed ≥1 practice over the window (client's "Active User"
// definition); `totalUsers` = live org user count (the gauge's center number).
// Both `null` when the source is unavailable so the panel shows a soft state.
interface HomeEngagement {
  activeUserRate: number | null;
  totalUsers: number | null;
}

// Trailing window for "active users" (30-day, MAU-style). Tunable.
const ENGAGEMENT_WINDOW_DAYS = 30;

export async function loader({ request }: LoaderFunctionArgs) {
  const resolved = await resolveDistrictAdmin(request);
  const district = resolved.district; // null on loadError (discriminated union)

  const params: MetricParams = {
    org: district?.organization ?? null,
    token: resolved.token,
    districtId: district?._id ?? null,
  };

  const engagementWindow = dailyWindow(ENGAGEMENT_WINDOW_DAYS);

  // Each metric function is independently safe()-wrapped already, but wrap the
  // calls here too so a thrown rejection can never bubble out of the loader.
  const [avg, dailyActive, participation, minutes, completedUsers, totalUsersResult] =
    await Promise.all([
      safe(getAvgSessionDuration(params)),
      safe(getDailyActiveSessionsIndex(params)),
      safe(getSchoolParticipationIndex(params)),
      safe(getTotalMinutesListened(params)),
      // Numerator of Active User Rate (never throws; null on soft error).
      getCompletedUsersTotal(params.org, engagementWindow),
      // Denominator: live org user count (UserTotals.students is unreliable).
      params.org
        ? safe(
            gqlClient.request(
              UsersByOrganizationTotalDocument,
              { organization: params.org },
              { "access-token": resolved.token },
            ),
          )
        : Promise.resolve(null),
    ]);

  const metrics: HomeMetrics = {
    avgSessionDuration: avg.ok ? avg.data : null,
    dailyActiveSessionsIndex: dailyActive.ok ? dailyActive.data : null,
    schoolParticipationIndex: participation.ok ? participation.data : null,
    totalMinutesListened: minutes.ok ? minutes.data : null,
  };

  const totalUsers =
    totalUsersResult && totalUsersResult.ok
      ? totalUsersResult.data.UsersByOrganizationFindMany?.total ?? null
      : null;
  // Rate only when both halves are real; clamp to [0,100]. Zero completions with
  // a real user count is a legitimate 0% (honest), not a missing source.
  const activeUserRate =
    completedUsers !== null && totalUsers && totalUsers > 0
      ? Math.min(100, Math.round((completedUsers / totalUsers) * 100))
      : null;

  const engagement: HomeEngagement = { activeUserRate, totalUsers };

  return {
    metrics,
    engagement,
    error: resolved.loadError ?? avg.error,
  };
}

// ---------------------------------------------------------------------------
// Status-badge thresholds (inline, reviewable). A KPI is "Normal" when it meets
// or beats the cross-district benchmark, "Moderate" when it's at least half the
// benchmark, "Low" otherwise. No benchmark (0) → "Normal" (nothing to compare).
// ---------------------------------------------------------------------------

function statusFromBenchmark(value: number, benchmark: number): DistrictStatStatus {
  if (benchmark <= 0) return "Normal";
  const ratio = value / benchmark;
  if (ratio >= 1) return "Normal";
  if (ratio >= 0.5) return "Moderate";
  return "Low";
}

const EM_DASH = "—";

// Round to one decimal place for display.
function oneDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

interface ResolvedCard {
  title: string;
  value: string;
  suffix?: string;
  status: DistrictStatStatus;
  chart: ReactNode;
}

// ---------------------------------------------------------------------------
// Card builders — each maps a metric (or its absence) to DistrictStatCard
// props. Stub metrics (null) keep today's placeholder so the page doesn't
// regress visually; a real-but-empty/errored metric shows the em-dash soft
// state. Primitives (DistrictStatCard / BarChartMini / ComparisonBar) reused.
// ---------------------------------------------------------------------------

function avgSessionDurationCard(metric: MetricResult | null): ResolvedCard {
  // Amplitude returns session length in seconds; the card renders minutes.
  if (!metric || metric.series.length === 0) {
    return {
      title: "Avg Session Duration",
      value: EM_DASH,
      suffix: "min",
      status: "Low",
      chart: <ComparisonBar average={0} yours={0} color="var(--color-primary)" />,
    };
  }
  const minutes = metric.value / 60;
  const benchmarkMinutes = metric.benchmark / 60;
  return {
    title: "Avg Session Duration",
    value: oneDecimal(minutes),
    suffix: "min",
    status: statusFromBenchmark(metric.value, metric.benchmark),
    chart: (
      <ComparisonBar
        average={Number(oneDecimal(benchmarkMinutes))}
        yours={Number(oneDecimal(minutes))}
        color="var(--color-primary)"
      />
    ),
  };
}

// Stub placeholders — kept identical to the pre-loader literals so the three
// not-yet-wired cards don't regress. Steps 4/5/6 replace these with metric
// reads once their functions return real data.
function dailyActiveSessionsCard(metric: MetricResult | null): ResolvedCard {
  if (!metric || metric.series.length === 0) {
    return {
      title: "Daily Active Sessions Index",
      value: metric ? EM_DASH : "82",
      suffix: "/100",
      status: metric ? "Low" : "Normal",
      chart: (
        <BarChartMini
          data={[40, 65, 55, 80, 72, 90, 82]}
          color="var(--color-primary)"
        />
      ),
    };
  }
  return {
    title: "Daily Active Sessions Index",
    value: oneDecimal(metric.value),
    suffix: "/100",
    status: statusFromBenchmark(metric.value, metric.benchmark),
    chart: <BarChartMini data={metric.series} color="var(--color-primary)" />,
  };
}

function schoolParticipationCard(metric: MetricResult | null): ResolvedCard {
  // No real series (errored, Amplitude unconfigured, or zero schools) → honest
  // empty state: em-dash + flat baseline chart. Do NOT fabricate demo bars or a
  // healthy-looking "0.96" — that misrepresents missing data as good data.
  if (!metric || metric.series.length === 0) {
    return {
      title: "School Participation Index",
      value: EM_DASH,
      status: "Low",
      chart: <BarChartMini data={[]} color="var(--color-primary)" />,
    };
  }
  return {
    title: "School Participation Index",
    value: oneDecimal(metric.value),
    status: statusFromBenchmark(metric.value, metric.benchmark),
    // Series are 0–1 participation ratios → scale against an absolute ceiling of
    // 1 (not the relative series max) so a low week reads as low bars and a
    // zero day reads as flat.
    chart: (
      <BarChartMini data={metric.series} color="var(--color-primary)" max={1} />
    ),
  };
}

function totalMinutesCard(metric: MetricResult | null): ResolvedCard {
  if (!metric) {
    return {
      title: "Total Minutes Listened",
      value: "715",
      suffix: "hrs",
      status: "Moderate",
      chart: <ComparisonBar average={1200} yours={715} color="#f97316" />,
    };
  }
  // Amplitude sums playback seconds; the card renders hours.
  const hours = metric.value / 3600;
  const benchmarkHours = metric.benchmark / 3600;
  return {
    title: "Total Minutes Listened",
    value: oneDecimal(hours),
    suffix: "hrs",
    status: statusFromBenchmark(metric.value, metric.benchmark),
    chart: (
      <ComparisonBar
        average={Number(oneDecimal(benchmarkHours))}
        yours={Number(oneDecimal(hours))}
        color="#f97316"
      />
    ),
  };
}

export default function DistrictHomeRoute() {
  const districtData = useRouteLoaderData<typeof districtLoader>(
    "routes/district",
  );
  const district = districtData?.district ?? null;
  const { metrics, engagement } = useLoaderData<typeof loader>();

  const cards: ResolvedCard[] = [
    dailyActiveSessionsCard(metrics.dailyActiveSessionsIndex),
    schoolParticipationCard(metrics.schoolParticipationIndex),
    avgSessionDurationCard(metrics.avgSessionDuration),
    totalMinutesCard(metrics.totalMinutesListened),
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col gap-4 p-5 lg:grid lg:grid-cols-[1fr_380px] lg:grid-rows-[minmax(280px,2.3fr)_minmax(0,2.7fr)] lg:h-full lg:min-h-[700px]">
        {/* Hero */}
        <div className="min-h-[220px] lg:min-h-0">
          <DistrictHero district={district} />
        </div>

        {/* Engagement insights panel */}
        <div className="min-h-[320px] lg:min-h-0">
          <EngagementInsightsPanel
            activeUserRate={engagement.activeUserRate}
            totalUsers={engagement.totalUsers}
          />
        </div>

        {/* Stat-card grid */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => (
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
