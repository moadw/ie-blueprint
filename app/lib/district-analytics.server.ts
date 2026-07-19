import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { UserTotalsFindManyDocument } from "~/queries/analytics";
import { SchoolFindManyDocument } from "~/queries/schools";
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
  // Optional single-school filter (school `_id`). Scopes only the Amplitude-driven
  // charts; roster/count figures stay district-level (see plan Derail notes).
  schoolId?: string;
}

/** Minimal school shape for the header selector (district-scoped, name-sorted). */
export interface AnalyticsSchool {
  _id: string;
  name: string | null;
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

/**
 * Per-card promises the route streams in behind skeletons. Each promise ALWAYS
 * resolves (never rejects) — a rejected promise reaching an `<Await>` without an
 * `errorElement` would white-screen the whole route via the root ErrorBoundary,
 * so `deferCard` resolves every card to its honest empty shape on any throw.
 */
export interface DeferredAnalytics {
  adoptionFunnel: Promise<AnalyticsDashboardData["adoptionFunnel"]>;
  mindfulMinutes: Promise<AnalyticsDashboardData["mindfulMinutes"]>;
  retention: Promise<AnalyticsDashboardData["retention"]>;
  sessions: Promise<AnalyticsDashboardData["sessions"]>;
  activeEducators: Promise<AnalyticsDashboardData["activeEducators"]>;
  insights: Promise<AnalyticsDashboardData["insights"]>;
}

export interface DistrictInfo {
  _id: string;
  name: string | null;
  organization: string | null;
}

// Weekday labels for the `peakWeekday` helper below (Sun…Sat, JS getUTCDay order).
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

// Honest empty/zero shapes — used both as the `deferCard` fallback and as the
// null-source branch inside each card promise. No invented numbers.
const EMPTY_SESSIONS: AnalyticsDashboardData["sessions"] = {
  total: 0,
  deltaVsPrev: 0,
  peakLabel: "—",
  grid: [],
};
const EMPTY_EDUCATORS: AnalyticsDashboardData["activeEducators"] = {
  total: 0,
  deltaVsPrev: 0,
  peakLabel: "—",
  grid: [],
};
const EMPTY_MINDFUL: AnalyticsDashboardData["mindfulMinutes"] = {
  total: 0,
  trendPct: 0,
  breakdowns: [],
};
const EMPTY_RETENTION: AnalyticsDashboardData["retention"] = { peakPct: 0, series: [] };
const EMPTY_INSIGHTS: AnalyticsDashboardData["insights"] = [];
// The funnel always renders its real stage labels (zero-valued when unsourced)
// so the card keeps its axes.
const ZERO_FUNNEL: AnalyticsDashboardData["adoptionFunnel"] = [
  { key: "registered", label: "Registered", value: 0 },
  { key: "active", label: "Active Users", value: 0 },
  { key: "engaged", label: "Engaged", value: 0 },
];

/**
 * Wrap a per-card async build so it ALWAYS resolves (never rejects): `safe()`
 * covers the fetch, but post-fetch shaping (`.map` / `sum` / `/60`) can still
 * throw. A rejected promise reaching an `<Await>` without an `errorElement`
 * white-screens the route via the root ErrorBoundary — the resilient-loader
 * convention forbids exactly that. On any throw we resolve to the empty shape.
 */
async function deferCard<T>(build: () => Promise<T>, empty: T): Promise<T> {
  try {
    return await build();
  } catch {
    return empty;
  }
}

// ---------------------------------------------------------------------------
// Loader — resolves the district org (+ the district-scoped school list, both
// awaited so the header selector and Insights count are ready synchronously),
// then returns each card's data as an UN-awaited promise so the route streams
// them in behind skeletons. There is NO mock/dummy data: when Amplitude is
// unconfigured or a call soft-errors, the card resolves to an honest zero/empty
// shape instead of invented numbers.
// ---------------------------------------------------------------------------

export async function getDistrictAnalytics(
  request: Request,
  params: AnalyticsParams,
): Promise<{
  district: DistrictInfo | null;
  schools: AnalyticsSchool[];
  schoolId: string | null;
  loadError: string | null;
  deferred: DeferredAnalytics | null;
}> {
  const result = await resolveDistrictAdmin(request);

  if (result.loadError || !result.district) {
    return {
      district: null,
      schools: [],
      schoolId: null,
      loadError: result.loadError ?? "Could not resolve district.",
      deferred: null,
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

  // --- Fire everything concurrently; validate the school filter after ---------
  // The district-scoped school list is needed synchronously (header selector +
  // Insights count), but we do NOT serialize the Amplitude fan-out behind it: the
  // school fetch runs concurrently with the per-card sources below.
  const schoolsResultP = safe(
    gqlClient.request(
      SchoolFindManyDocument,
      { filter: { district: district._id, platform: env.PLATFORM }, limit: 500 },
      { "access-token": token },
    ),
  );

  // Roster totals are always district-wide (never school-scoped) — fire once.
  const totalsP = safe(
    gqlClient.request(
      UserTotalsFindManyDocument,
      { district: district._id },
      { "access-token": token },
    ),
  );

  // Per-card Amplitude sources for a given school scope. Fired now with the
  // requested id (the common case); rebuilt unscoped below only if that id turns
  // out not to belong to this district. Fetchers are safe()-wrapped / cached and
  // resolve to `null` on soft error / unconfigured.
  const buildAmplitude = (schoolId: string | undefined) => ({
    sessionsPrimaryP: getSessionCountSeries(org, primary, schoolId),
    sessionsCompareP: compareWindow
      ? getSessionCountSeries(org, compareWindow, schoolId)
      : Promise.resolve(null),
    teachersPrimaryP: getActiveTeacherSeries(org, primary, schoolId),
    teacherTotalPrimaryP: getActiveTeacherTotal(org, primary, schoolId),
    teacherTotalCompareP: compareWindow
      ? getActiveTeacherTotal(org, compareWindow, schoolId)
      : Promise.resolve(null),
    mindfulPrimaryP: getMindfulSecondsSeries(org, primary, undefined, schoolId),
    mindfulCompareP: compareWindow
      ? getMindfulSecondsSeries(org, compareWindow, undefined, schoolId)
      : Promise.resolve(null),
    mindfulTeacherP: getMindfulSecondsSeries(org, primary, "teacher", schoolId),
    mindfulStudentP: getMindfulSecondsSeries(org, primary, "student", schoolId),
    retentionP: getRetentionCurve(org, primary, params.granularity, schoolId),
    activeUsersTotalP: getActiveUsersTotal(org, primary, schoolId),
    engagedUsersTotalP: getEngagedUsersTotal(org, primary, schoolId),
  });

  let {
    sessionsPrimaryP,
    sessionsCompareP,
    teachersPrimaryP,
    teacherTotalPrimaryP,
    teacherTotalCompareP,
    mindfulPrimaryP,
    mindfulCompareP,
    mindfulTeacherP,
    mindfulStudentP,
    retentionP,
    activeUsersTotalP,
    engagedUsersTotalP,
  } = buildAmplitude(params.schoolId);

  // Await the (concurrent) school list, then validate the requested school id.
  const schoolsResult = await schoolsResultP;

  // District-scoped school list for the header selector (name-sorted). Unaffected
  // by the selected school filter, so the selector always lists the full district.
  const schools: AnalyticsSchool[] = schoolsResult.ok
    ? (schoolsResult.data.SchoolFindMany ?? [])
        .flatMap((s) => (s && s._id ? [{ _id: s._id, name: s.name ?? null }] : []))
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
    : [];

  // Live schools count (district-wide) — feeds the Insights box. Uses the same
  // filtered list the selector shows, so the count and the options never disagree.
  const schoolsCount = schools.length;

  // Validate the requested school against this district's list. A stale, foreign,
  // or removed id (a bookmarked `?school=`, or a master-admin switching previewed
  // districts with the param still set) is treated as "all schools" so the header
  // selector and the actual filter never desync into silently-blank charts.
  const effectiveSchoolId =
    params.schoolId && schools.some((s) => s._id === params.schoolId)
      ? params.schoolId
      : undefined;
  if (effectiveSchoolId !== params.schoolId) {
    ({
      sessionsPrimaryP,
      sessionsCompareP,
      teachersPrimaryP,
      teacherTotalPrimaryP,
      teacherTotalCompareP,
      mindfulPrimaryP,
      mindfulCompareP,
      mindfulTeacherP,
      mindfulStudentP,
      retentionP,
      activeUsersTotalP,
      engagedUsersTotalP,
    } = buildAmplitude(effectiveSchoolId));
  }

  // Sessions card (real → shape; null → honest zero/empty).
  const sessions = deferCard(async () => {
    const [primarySeries, compareSeries] = await Promise.all([
      sessionsPrimaryP,
      sessionsCompareP,
    ]);
    return primarySeries !== null
      ? shapeCountCard(primarySeries, compareSeries, primary)
      : EMPTY_SESSIONS;
  }, EMPTY_SESSIONS);

  // Active Educators card (distinct teachers; total/delta use period-collapsed
  // distinct counts, the daily series drives the heatmap + peak).
  const activeEducators = deferCard(async () => {
    const [series, totalPrimary, totalCompare] = await Promise.all([
      teachersPrimaryP,
      teacherTotalPrimaryP,
      teacherTotalCompareP,
    ]);
    return series !== null
      ? shapeUniqueCard(series, totalPrimary, totalCompare, primary)
      : EMPTY_EDUCATORS;
  }, EMPTY_EDUCATORS);

  // Mindful Minutes card. The by-school-level breakdown has no real source, so we
  // break down by the real consuming role (Teachers / Students) via per-role
  // filtered sums — only roles with minutes are shown. No "Other" is fabricated.
  const mindfulMinutes = deferCard(async () => {
    const [primarySeries, compareSeries, teacherSeries, studentSeries] =
      await Promise.all([
        mindfulPrimaryP,
        mindfulCompareP,
        mindfulTeacherP,
        mindfulStudentP,
      ]);
    if (primarySeries === null) return EMPTY_MINDFUL;
    const totalMinutes = Math.round(sum(primarySeries) / 60);
    const prevMinutes =
      compareSeries !== null ? Math.round(sum(compareSeries) / 60) : 0;
    const breakdowns = [
      {
        label: "Teachers",
        value: teacherSeries ? Math.round(sum(teacherSeries) / 60) : 0,
        color: "var(--color-primary)",
      },
      {
        label: "Students",
        value: studentSeries ? Math.round(sum(studentSeries) / 60) : 0,
        color: "hsl(220 70% 55%)",
      },
    ].filter((b) => b.value > 0);
    return {
      total: totalMinutes,
      trendPct: pctChange(totalMinutes, prevMinutes),
      breakdowns,
    };
  }, EMPTY_MINDFUL);

  // Retention card (real → curve; null → empty).
  const retention = deferCard(
    async () => (await retentionP) ?? EMPTY_RETENTION,
    EMPTY_RETENTION,
  );

  // Adoption funnel — hybrid: "Registered" from the Blueprint roster (UserTotals),
  // "Active Users" + "Engaged" from Amplitude period uniques. "Licensed Seats" /
  // "Champions" (no real source) are omitted rather than fabricated. Real only
  // when Amplitude answered AND the roster resolved; otherwise the real stage
  // labels with zero values so the card still renders its axes.
  const adoptionFunnel = deferCard(async () => {
    const [totalsResult, activeUsersTotal, engagedUsersTotal] = await Promise.all([
      totalsP,
      activeUsersTotalP,
      engagedUsersTotalP,
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
    if (activeUsersTotal !== null && totals) {
      const registered = totals.students + totals.teachers;
      return [
        { key: "registered", label: "Registered", value: registered },
        { key: "active", label: "Active Users", value: activeUsersTotal },
        { key: "engaged", label: "Engaged", value: engagedUsersTotal ?? 0 },
      ];
    }
    return ZERO_FUNNEL;
  }, ZERO_FUNNEL);

  // Insights — composed from the already-firing promises (no duplicate calls):
  // the awaited schools count, Amplitude active users, and the mindful card's
  // trend. `mindfulPrimaryP` distinguishes a real 0 from "no data" for the trend
  // insight. Each entry is included only when its source is available → `[]`
  // shows the card's "No insights available." empty state.
  const insights = deferCard(async () => {
    const [activeUsersTotal, mindfulPrimary, mindfulCard] = await Promise.all([
      activeUsersTotalP,
      mindfulPrimaryP,
      mindfulMinutes,
    ]);
    const out: AnalyticsDashboardData["insights"] = [];
    if (schoolsCount > 0) {
      out.push({
        stat: String(schoolsCount),
        title: "Schools in the district",
        description:
          "Number of schools currently provisioned in this district on the platform.",
      });
    }
    if (activeUsersTotal !== null) {
      out.push({
        stat: activeUsersTotal.toLocaleString(),
        title: "Active users this period",
        description:
          "Total unique users with at least one recorded activity during the selected range.",
      });
    }
    if (mindfulPrimary !== null) {
      const trendPct = mindfulCard.trendPct;
      out.push({
        stat: `${trendPct >= 0 ? "+" : ""}${trendPct}%`,
        title: "Mindful minutes trend vs. previous period",
        description:
          "Change in total mindful minutes compared with the prior equivalent window.",
      });
    }
    return out;
  }, EMPTY_INSIGHTS);

  const districtInfo: DistrictInfo = {
    _id: district._id,
    name: district.name,
    organization: district.organization,
  };

  return {
    district: districtInfo,
    schools,
    // The validated filter — the header selector binds to this, so an invalid
    // requested id shows "All schools" (matching the now-unscoped charts).
    schoolId: effectiveSchoolId ?? null,
    loadError: null,
    deferred: {
      adoptionFunnel,
      mindfulMinutes,
      retention,
      sessions,
      activeEducators,
      insights,
    },
  };
}
