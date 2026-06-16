import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { UserTotalsFindManyDocument } from "~/queries/analytics";

export interface AnalyticsParams {
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;
  granularity: "daily" | "weekly" | "monthly";
  compareStart?: string;
  compareEnd?: string;
}

export interface AnalyticsDashboardData {
  totals: {
    schools: number;
    groups: number;
    districts: number;
    students: number;
    teachers: number;
  } | null; // REAL
  adoptionFunnel: { key: string; label: string; value: number }[];
  mindfulMinutes: {
    total: number;
    trendPct: number;
    breakdowns: { label: string; value: number; color: string }[];
  };
  retention: {
    peakPct: number;
    series: { label: string; rate: number }[];
  };
  sessions: {
    total: number;
    deltaVsPrev: number;
    peakLabel: string;
    grid: number[][];
  };
  activeEducators: {
    total: number;
    deltaVsPrev: number;
    peakLabel: string;
    grid: number[][];
  };
  insights: { stat: string; title: string; description: string }[];
  meta: { sources: Record<string, "real" | "mock"> };
}

export interface DistrictInfo {
  _id: string;
  name: string | null;
  organization: string | null;
}

// Deterministic random generator (LCG) seeded from the params hash.
// No Math.random()/Date.now() here — keeps SSR hydration stable.
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function generateAdoptionFunnel(rng: () => number): AnalyticsDashboardData["adoptionFunnel"] {
  const jitter = () => 0.9 + rng() * 0.2; // ±10%
  const licensed = Math.round(2400 * jitter());
  const registered = Math.round(Math.min(1850 * jitter(), licensed));
  const active = Math.round(Math.min(1240 * jitter(), registered));
  const engaged = Math.round(Math.min(890 * jitter(), active));
  const champions = Math.round(Math.min(320 * jitter(), engaged));

  return [
    { key: "licensed", label: "Licensed Seats", value: licensed },
    { key: "registered", label: "Registered", value: registered },
    { key: "active", label: "Active Users", value: active },
    { key: "engaged", label: "Engaged", value: engaged },
    { key: "champions", label: "Champions", value: champions },
  ];
}

function generateMindfulMinutes(rng: () => number): AnalyticsDashboardData["mindfulMinutes"] {
  const total = Math.round(41540 * (0.85 + rng() * 0.3));
  const trendPct = Math.round((15 + (rng() - 0.5) * 10) * 10) / 10;

  const segments = [
    { label: "Elementary Schools", base: 0.35, color: "var(--color-primary)" },
    { label: "Middle Schools", base: 0.25, color: "hsl(220 70% 55%)" },
    { label: "High Schools", base: 0.2, color: "hsl(340 75% 55%)" },
    { label: "Early Learning", base: 0.12, color: "hsl(275 55% 55%)" },
    { label: "Support Staff", base: 0.08, color: "hsl(35 75% 55%)" },
  ];

  let remaining = total;
  const breakdowns = segments.map((seg, idx) => {
    const isLast = idx === segments.length - 1;
    const jitter = 0.85 + rng() * 0.3;
    const value = isLast ? remaining : Math.round(total * seg.base * jitter);
    remaining -= value;
    return {
      label: seg.label,
      value: Math.max(0, value),
      color: seg.color,
    };
  });

  return { total, trendPct, breakdowns };
}

function generateRetention(
  rng: () => number,
  params: AnalyticsParams,
): AnalyticsDashboardData["retention"] {
  const count =
    params.granularity === "monthly" ? 6 : params.granularity === "weekly" ? 8 : 10;

  const series: { label: string; rate: number }[] = [];
  let peakRate = 0;

  for (let i = 0; i < count; i++) {
    const base = 25 + (i / Math.max(1, count - 1)) * 18;
    const wobble = (rng() - 0.5) * 8;
    const rate = clampInt(base + wobble, 22, 45);
    peakRate = Math.max(peakRate, rate);

    let label: string;
    if (params.granularity === "monthly") {
      label = MONTH_LABELS[(11 - (count - 1) + i) % 12] ?? "";
    } else if (params.granularity === "weekly") {
      label = `W${i + 1}`;
    } else {
      label = DAY_LABELS[(i + 1) % 7] ?? "";
    }
    series.push({ label, rate });
  }

  return { peakPct: peakRate, series };
}

function generateGrid(rng: () => number, rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => clampInt(1 + rng() * 10, 1, 10)),
  );
}

function generateSessions(rng: () => number): AnalyticsDashboardData["sessions"] {
  const total = Math.round(106000 * (0.9 + rng() * 0.2));
  const deltaVsPrev = Math.round(34002 * (0.85 + rng() * 0.3));
  const peakLabel = DAY_LABELS[3 + Math.floor(rng() * 3)] ?? ""; // Wed-Fri
  const grid = generateGrid(rng, 5, 7);
  return { total, deltaVsPrev, peakLabel, grid };
}

function generateActiveEducators(
  rng: () => number,
): AnalyticsDashboardData["activeEducators"] {
  const total = Math.round(1284 * (0.9 + rng() * 0.2));
  const deltaVsPrev = Math.round(320 * (0.8 + rng() * 0.4));
  const peakLabel = DAY_LABELS[2 + Math.floor(rng() * 3)] ?? ""; // Tue-Thu
  const grid = generateGrid(rng, 5, 7);
  return { total, deltaVsPrev, peakLabel, grid };
}

function generateInsights(
  rng: () => number,
  totals: AnalyticsDashboardData["totals"],
): AnalyticsDashboardData["insights"] {
  const schools = totals?.schools ?? 0;
  const students = totals?.students ?? 0;
  const stat1 = schools > 0 ? `${schools}` : "24";
  const stat2 = students > 0 ? `${students}` : "1,240";

  const pool = [
    {
      stat: stat1,
      title: "Schools actively practicing mindfulness",
      description:
        "Number of schools in the district with at least one recorded session during the period.",
    },
    {
      stat: stat2,
      title: "Students reached across all campuses",
      description:
        "Total unique students who joined at least one mindful minute activity this period.",
    },
    {
      stat: "+15%",
      title: "Mindful minutes trend vs. previous period",
      description:
        "Growth in total mindful minutes when comparing the selected range with the prior equivalent window.",
    },
  ];

  const shuffled = [...pool].sort(() => rng() - 0.5);
  return shuffled.slice(0, 3);
}

function makeMockData(
  params: AnalyticsParams,
  totals: AnalyticsDashboardData["totals"],
): AnalyticsDashboardData {
  const seed = hashString(
    `${params.startDate}|${params.endDate}|${params.granularity}|${params.compareStart ?? ""}|${params.compareEnd ?? ""}`,
  );
  const rng = makeRng(seed);

  const sources: Record<string, "real" | "mock"> = {
    totals: totals ? "real" : "mock",
    adoptionFunnel: "mock",
    mindfulMinutes: "mock",
    retention: "mock",
    sessions: "mock",
    activeEducators: "mock",
    insights: "mock",
  };

  return {
    totals,
    adoptionFunnel: generateAdoptionFunnel(rng),
    mindfulMinutes: generateMindfulMinutes(rng),
    retention: generateRetention(rng, params),
    sessions: generateSessions(rng),
    activeEducators: generateActiveEducators(rng),
    insights: generateInsights(rng, totals),
    meta: { sources },
  };
}

export async function getDistrictAnalytics(
  request: Request,
  params: AnalyticsParams,
): Promise<{
  district: DistrictInfo | null;
  data: AnalyticsDashboardData | null;
  loadError: string | null;
}> {
  const result = await resolveDistrictAdmin(request);

  if (result.loadError || !result.district) {
    return {
      district: null,
      data: null,
      loadError: result.loadError ?? "Could not resolve district.",
    };
  }

  const { token, district } = result;

  const totalsResult = await safe(
    gqlClient.request(
      UserTotalsFindManyDocument,
      { district: district._id },
      { "access-token": token },
    ),
  );

  let totals: AnalyticsDashboardData["totals"] = null;
  if (totalsResult.ok && totalsResult.data.UserTotalsFindMany) {
    const raw = totalsResult.data.UserTotalsFindMany;
    totals = {
      schools: raw.schools ?? 0,
      groups: raw.groups ?? 0,
      districts: raw.districts ?? 0,
      students: raw.students ?? 0,
      teachers: raw.teachers ?? 0,
    };
  }

  const districtInfo: DistrictInfo = {
    _id: district._id,
    name: district.name,
    organization: district.organization,
  };

  return {
    district: districtInfo,
    data: makeMockData(params, totals),
    loadError: null,
  };
}
