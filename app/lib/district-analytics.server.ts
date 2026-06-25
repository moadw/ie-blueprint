import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { UserTotalsFindManyDocument } from "~/queries/analytics";
import {
  getActiveTeacherSeries,
  getActiveTeacherTotal,
  getActiveUsersTotal,
  getEngagedUsersTotal,
  getMindfulSecondsSeries,
  getRetentionCurve,
  getSessionCountSeries,
  windowFromISO,
  type AnalyticsWindow,
} from "~/lib/amplitude.server";

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

// ---------------------------------------------------------------------------
// Real-data shaping helpers (Amplitude daily series → card shapes)
//
// The Amplitude fetchers return a daily `number[]` aligned to the primary
// window (index 0 = `params.startDate`, one entry per day, inclusive). These
// helpers turn a series into the totals / deltas / heatmap / weekday-peak the
// cards render. All deterministic (date math from fixed strings only), so they
// keep SSR hydration stable.
// ---------------------------------------------------------------------------

function sum(series: number[]): number {
  return series.reduce((a, b) => a + b, 0);
}

/** Parse a Dashboard REST `YYYYMMDD` into a UTC Date. */
function parseYMD(ymd: string): Date {
  const y = Number(ymd.slice(0, 4));
  const m = Number(ymd.slice(4, 6));
  const d = Number(ymd.slice(6, 8));
  return new Date(Date.UTC(y, m - 1, d));
}

/** Weekday label (Sun…Sat) of the highest-value day in the series. */
function peakWeekday(series: number[], window: AnalyticsWindow): string {
  if (series.length === 0) return "—";
  let maxIdx = 0;
  let maxVal = -Infinity;
  series.forEach((v, i) => {
    if (v > maxVal) {
      maxVal = v;
      maxIdx = i;
    }
  });
  if (maxVal <= 0) return "—";
  const day = parseYMD(window.start);
  day.setUTCDate(day.getUTCDate() + maxIdx);
  return DAY_LABELS[day.getUTCDay()] ?? "—";
}

/**
 * Reshape a daily series into a `rows × cols` heatmap grid (default 5×7 = the
 * last 35 days), oldest-first, row-major. Fewer than `rows*cols` days are
 * front-padded with zeros so the grid keeps its shape. `DotGrid` normalizes
 * intensity against the grid max, so absolute scale doesn't matter.
 */
function seriesToGrid(series: number[], rows = 5, cols = 7): number[][] {
  const cells = rows * cols;
  const tail = series.slice(-cells);
  const padded = Array(Math.max(0, cells - tail.length))
    .fill(0)
    .concat(tail);
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    grid.push(padded.slice(r * cols, (r + 1) * cols).map((n) => Math.round(n)));
  }
  return grid;
}

/** Percent change of `cur` vs `prev`, one decimal; 0 when `prev` is 0. */
function pctChange(cur: number, prev: number): number {
  if (prev <= 0) return 0;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

/**
 * Shape a **count**-style metric (events, e.g. practice sessions) — the period
 * total is the sum of the daily counts. Use for `m=totals` series only.
 */
function shapeCountCard(
  primary: number[],
  compare: number[] | null,
  window: AnalyticsWindow,
): { total: number; deltaVsPrev: number; peakLabel: string; grid: number[][] } {
  const total = Math.round(sum(primary));
  const prev = compare ? Math.round(sum(compare)) : 0;
  return {
    total,
    deltaVsPrev: total - prev,
    peakLabel: peakWeekday(primary, window),
    grid: seriesToGrid(primary),
  };
}

/**
 * Shape a **unique**-style metric (e.g. active educators) — the period total is
 * the collapsed distinct count, NOT the sum of daily uniques (which counts a
 * user once per active day). The daily series still drives the heatmap + peak.
 */
function shapeUniqueCard(
  series: number[],
  totalPrimary: number | null,
  totalCompare: number | null,
  window: AnalyticsWindow,
): { total: number; deltaVsPrev: number; peakLabel: string; grid: number[][] } {
  const total = Math.round(totalPrimary ?? 0);
  const prev = Math.round(totalCompare ?? 0);
  return {
    total,
    deltaVsPrev: total - prev,
    peakLabel: peakWeekday(series, window),
    grid: seriesToGrid(series),
  };
}

// ---------------------------------------------------------------------------
// Mock generators (fallback when Amplitude is unconfigured / errors, and the
// not-yet-wired cards: Adoption Funnel + Retention + Insights). Each card the
// loader fills from real data records `meta.sources[card] = "real"`; the rest
// stay `"mock"` so the UI can mark them honestly.
// ---------------------------------------------------------------------------

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

function generateMindfulMinutes(
  rng: () => number,
): AnalyticsDashboardData["mindfulMinutes"] {
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

// ---------------------------------------------------------------------------
// Loader — resolves the district org, then fills each card from real Amplitude
// data where a source exists (Sessions, Active Educators, Mindful Minutes),
// falling back to the seeded mock generator when Amplitude is unconfigured or a
// call soft-errors. Adoption Funnel + Retention + Insights remain mock for now
// (their own follow-up tasks). `meta.sources` records real vs mock per card.
// ---------------------------------------------------------------------------

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
  const org = district.organization;

  // Primary + comparison windows (the loader always supplies compare defaults).
  const primary = windowFromISO(params.startDate, params.endDate);
  const compareWindow =
    params.compareStart && params.compareEnd
      ? windowFromISO(params.compareStart, params.compareEnd)
      : null;

  // Fetch everything in parallel. Amplitude fetchers are each safe()-wrapped
  // and return `null` on soft error / unconfigured (never throw).
  const [
    totalsResult,
    sessionsPrimary,
    sessionsCompare,
    teachersPrimary,
    teacherTotalPrimary,
    teacherTotalCompare,
    mindfulPrimary,
    mindfulCompare,
    retentionResult,
    activeUsersTotal,
    engagedUsersTotal,
    mindfulTeacherSeries,
    mindfulStudentSeries,
  ] = await Promise.all([
    safe(
      gqlClient.request(
        UserTotalsFindManyDocument,
        { district: district._id },
        { "access-token": token },
      ),
    ),
    getSessionCountSeries(org, primary),
    compareWindow ? getSessionCountSeries(org, compareWindow) : Promise.resolve(null),
    getActiveTeacherSeries(org, primary),
    getActiveTeacherTotal(org, primary),
    compareWindow ? getActiveTeacherTotal(org, compareWindow) : Promise.resolve(null),
    getMindfulSecondsSeries(org, primary),
    compareWindow ? getMindfulSecondsSeries(org, compareWindow) : Promise.resolve(null),
    getRetentionCurve(org, primary, params.granularity),
    getActiveUsersTotal(org, primary),
    getEngagedUsersTotal(org, primary),
    getMindfulSecondsSeries(org, primary, "teacher"),
    getMindfulSecondsSeries(org, primary, "student"),
  ]);

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

  // Seeded RNG drives the still-mock cards (and the real-card fallbacks) so
  // output stays deterministic for a given range (stable SSR hydration).
  const seed = hashString(
    `${params.startDate}|${params.endDate}|${params.granularity}|${params.compareStart ?? ""}|${params.compareEnd ?? ""}`,
  );
  const rng = makeRng(seed);

  // Adoption funnel — hybrid: "Registered" from the Blueprint roster
  // (UserTotals), "Active Users" + "Engaged" from Amplitude period uniques. The
  // prototype's "Licensed Seats" (no contract/seat source) and "Champions" (no
  // agreed power-user definition) are intentionally omitted rather than
  // fabricated; the card renders however many stages it's given. Real only when
  // Amplitude answered AND the roster resolved; otherwise the seeded mock.
  let adoptionFunnel: AnalyticsDashboardData["adoptionFunnel"];
  let funnelIsReal = false;
  if (activeUsersTotal !== null && totals) {
    const registered = totals.students + totals.teachers;
    adoptionFunnel = [
      { key: "registered", label: "Registered", value: registered },
      { key: "active", label: "Active Users", value: activeUsersTotal },
      { key: "engaged", label: "Engaged", value: engagedUsersTotal ?? 0 },
    ];
    funnelIsReal = true;
  } else {
    adoptionFunnel = generateAdoptionFunnel(rng);
  }

  const sources: Record<string, "real" | "mock"> = {
    totals: totals ? "real" : "mock",
    adoptionFunnel: funnelIsReal ? "real" : "mock",
    mindfulMinutes: mindfulPrimary !== null ? "real" : "mock",
    retention: retentionResult !== null ? "real" : "mock",
    sessions: sessionsPrimary !== null ? "real" : "mock",
    activeEducators: teachersPrimary !== null ? "real" : "mock",
    insights: "mock",
  };

  // Sessions (real → shape; null → mock fallback).
  const sessions =
    sessionsPrimary !== null
      ? shapeCountCard(sessionsPrimary, sessionsCompare, primary)
      : generateSessions(rng);

  // Active Educators (distinct teachers; real → shape with collapsed totals;
  // null → mock fallback). Total/delta use the period-collapsed distinct counts
  // (not summed daily uniques); the daily series drives the heatmap + peak.
  const activeEducators =
    teachersPrimary !== null
      ? shapeUniqueCard(
          teachersPrimary,
          teacherTotalPrimary,
          teacherTotalCompare,
          primary,
        )
      : generateActiveEducators(rng);

  // Mindful Minutes (real headline + trend; null → mock fallback). The
  // prototype's by-school-level breakdown has no real source (events carry
  // school IDs, not a level dimension, and summing seconds grouped by a
  // dimension isn't a single Dashboard-REST call). Instead we break down by the
  // real consuming role (Teachers / Students) via per-role filtered sums —
  // only roles with minutes are shown, so it stays honest (today: teachers
  // only; students appear automatically once they report). No remainder/"Other"
  // is fabricated.
  let mindfulMinutes: AnalyticsDashboardData["mindfulMinutes"];
  if (mindfulPrimary !== null) {
    const totalMinutes = Math.round(sum(mindfulPrimary) / 60);
    const prevMinutes =
      mindfulCompare !== null ? Math.round(sum(mindfulCompare) / 60) : 0;
    const roleBreakdown = [
      {
        label: "Teachers",
        value: mindfulTeacherSeries ? Math.round(sum(mindfulTeacherSeries) / 60) : 0,
        color: "var(--color-primary)",
      },
      {
        label: "Students",
        value: mindfulStudentSeries ? Math.round(sum(mindfulStudentSeries) / 60) : 0,
        color: "hsl(220 70% 55%)",
      },
    ].filter((b) => b.value > 0);
    mindfulMinutes = {
      total: totalMinutes,
      trendPct: pctChange(totalMinutes, prevMinutes),
      breakdowns: roleBreakdown,
    };
  } else {
    mindfulMinutes = generateMindfulMinutes(rng);
  }

  const data: AnalyticsDashboardData = {
    totals,
    adoptionFunnel,
    mindfulMinutes,
    retention: retentionResult ?? generateRetention(rng, params),
    sessions,
    activeEducators,
    insights: generateInsights(rng, totals),
    meta: { sources },
  };

  const districtInfo: DistrictInfo = {
    _id: district._id,
    name: district.name,
    organization: district.organization,
  };

  return {
    district: districtInfo,
    data,
    loadError: null,
  };
}
