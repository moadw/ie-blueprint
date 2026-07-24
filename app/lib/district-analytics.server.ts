import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { getSchoolRosterTotal } from "~/lib/school-roster.server";
import { safe, type SafeResult } from "~/lib/safe-loader";
import { UserTotalsFindManyDocument } from "~/queries/analytics";
import { SchoolFindManyDocument } from "~/queries/schools";
import type { UserTotalsFindManyQuery } from "~/gql/graphql";
import {
  getActiveTeacherSeries,
  getActiveTeacherTotal,
  getActiveUsersTotal,
  getCompletedUsersTotal,
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
  // Optional single-school filter (school `_id`). District-admin/preview:
  // scopes only the Amplitude-driven charts — roster/count figures stay
  // district-level, unchanged (see plan Derail notes). School-admin: also
  // narrows the roster-derived "Registered" stage + Engagement-rate
  // denominator to that one school (step-5) — there is no district-level
  // figure to fall back to for this role.
  schoolId?: string;
}

/**
 * Minimal school shape for the header selector, name-sorted. District-admin /
 * preview: the district's schools (`SchoolFindMany`). School-admin: the
 * caller's OWN schools only (from `resolveDistrictAdmin`'s `schools`), never
 * the wider district's.
 */
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
 * Compact count for Insight stats ("2.4k"). Mirrors the Sessions card's
 * `formatCompactTotal` (kept local so `lib/` doesn't depend on a route util).
 */
function compactStat(value: number): string {
  if (value >= 10000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return value.toLocaleString();
}

/**
 * Trailing sentence clause describing a delta vs the compare window, e.g.
 * " up 4 pts vs last period". Empty string when the delta is null or 0, so the
 * Insight title reads cleanly without a trend when there's no comparison.
 */
function deltaClause(delta: number | null, unit: string): string {
  if (delta === null || delta === 0) return "";
  return delta > 0
    ? ` up ${delta} ${unit} vs last period`
    : ` down ${Math.abs(delta)} ${unit} vs last period`;
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
// Loader — resolves the caller's scope (district-admin/preview: the district
// org + its schools; school-admin: the caller's own schools, no org concept),
// awaited so the header selector and Insights count are ready synchronously,
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

  if (result.loadError) {
    return {
      district: null,
      schools: [],
      schoolId: null,
      loadError: result.loadError,
      deferred: null,
    };
  }

  const isSchoolAdmin = result.role === "school-admin";

  // District-admin / preview: unchanged guard — the district must resolve.
  // School-admin: `district` stays `null` by design (no district concept);
  // scope comes from the caller's own schools instead (checked next).
  if (!isSchoolAdmin && !result.district) {
    return {
      district: null,
      schools: [],
      schoolId: null,
      loadError: "Could not resolve district.",
      deferred: null,
    };
  }

  // School-admin: `resolveDistrictAdmin` guarantees non-empty `schools` /
  // `schoolIds` whenever `role === "school-admin"` and `loadError` is null (an
  // empty list is itself a soft `loadError` there) — this guard is
  // defensive only, keeping strict-TS happy about the independently-nullable
  // fields on the shared result type.
  if (isSchoolAdmin && (!result.schools || !result.schoolIds)) {
    return {
      district: null,
      schools: [],
      schoolId: null,
      loadError: "Could not resolve schools.",
      deferred: null,
    };
  }

  const { token, district } = result;
  // School-admin has no org/district concept — its Amplitude scope comes
  // entirely from `schoolSegmentFilter(schoolIds)` below, no org filter at all.
  const org = isSchoolAdmin ? null : (district?.organization ?? null);
  // Powers the district-admin-only `SchoolFindMany` / `UserTotalsFindMany`
  // calls below; `null` for school-admin (those calls are skipped entirely).
  const districtId = isSchoolAdmin ? null : (district?._id ?? null);

  // School-admin's OWN schools (never the district's). `resolveDistrictAdmin`
  // already guarantees these are non-empty for this role (guarded above); the
  // `?? []` fallback is defensive only.
  const ownSchools: AnalyticsSchool[] = isSchoolAdmin ? (result.schools ?? []) : [];
  const ownSchoolIds: string[] = isSchoolAdmin ? (result.schoolIds ?? []) : [];

  // Primary + comparison windows (the loader always supplies compare defaults).
  const primary = windowFromISO(params.startDate, params.endDate);
  const compareWindow =
    params.compareStart && params.compareEnd
      ? windowFromISO(params.compareStart, params.compareEnd)
      : null;

  // --- Fire everything concurrently; validate the school filter after ---------
  // District-admin / preview: the district-scoped school list is needed
  // synchronously (header selector + Insights count), fetched concurrently with
  // the per-card sources below (unchanged). School-admin: no fetch needed —
  // `ownSchools` (already resolved by `resolveDistrictAdmin`, step-1) IS the
  // selector's option list, so this is skipped entirely.
  const schoolsResultP = districtId
    ? safe(
        gqlClient.request(
          SchoolFindManyDocument,
          { filter: { district: districtId, platform: env.PLATFORM }, limit: 500 },
          { "access-token": token },
        ),
      )
    : null;

  // Roster totals for district-admin/preview are always district-wide (never
  // school-scoped) — fire once, exactly as before. School-admin has no
  // district to key this off of; its roster total is `schoolRegisteredP`
  // below instead (step-5, `school-roster.server.ts`), fired once
  // `effectiveSchoolId` is resolved (so it can respect `?school=` narrowing
  // the same way the Amplitude numerators do).
  const totalsP: Promise<SafeResult<UserTotalsFindManyQuery>> = districtId
    ? safe(
        gqlClient.request(
          UserTotalsFindManyDocument,
          { district: districtId },
          { "access-token": token },
        ),
      )
    : Promise.resolve({
        ok: false as const,
        data: null,
        error: "No district scope for this role.",
      });

  // step-5: school-admin roster total (teachers + students), scoped to the
  // SAME effective school scope the Amplitude numerators use below (a single
  // selected `?school=` id, or the caller's full school aggregate when none
  // is selected/valid) — assigned inside the `isSchoolAdmin` branch further
  // down, once that scope is known. Stays `Promise.resolve(null)` for
  // district-admin/preview (unused — `totalsP` above is their source).
  let schoolRegisteredP: Promise<number | null> = Promise.resolve(null);

  // Per-card Amplitude sources for a given school scope (a single id, a
  // multi-id list — the school-admin aggregate — or `undefined`/unscoped).
  // Fired now with the requested/default scope (the common case); rebuilt
  // below only if the requested id turns out invalid. Fetchers are
  // safe()-wrapped / cached and resolve to `null` on soft error / unconfigured.
  const buildAmplitude = (schoolId: string | string[] | undefined) => ({
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
    retentionCompareP: compareWindow
      ? getRetentionCurve(org, compareWindow, params.granularity, schoolId)
      : Promise.resolve(null),
    activeUsersTotalP: getActiveUsersTotal(org, primary, schoolId),
    engagedUsersTotalP: getEngagedUsersTotal(org, primary, schoolId),
    // Engagement rate = completed ÷ registered. District-admin/preview: KEEP
    // `getCompletedUsersTotal` org-only (no `schoolId`) — this Insight is
    // district-wide BY DESIGN regardless of the `?school=` selection, same as
    // "Registered" (`totalsP`) and matching the district-home `activeUserRate`
    // formula (see `AnalyticsParams.schoolId` docstring: "roster/count figures
    // stay district-level"). Do NOT thread `schoolId` here for that role —
    // unlike its siblings above, this one must NOT narrow with the selector.
    // School-admin: step-5 additively widened `getCompletedUsersTotal`
    // (`amplitude.server.ts`) to accept a schoolId scope — `org` is always
    // `null` for this role, so passing `schoolId` (the resolved effective
    // scope: a single selected school or the full aggregate) is the ONLY
    // scoping signal. The denominator ("registered") is computed once, from
    // `totalsP` (district-admin) or `schoolRegisteredP` (school-admin) — see
    // the `adoptionFunnel` and `insights` builders below.
    completedPrimaryP: isSchoolAdmin
      ? getCompletedUsersTotal(org, primary, schoolId)
      : getCompletedUsersTotal(org, primary),
    completedCompareP: !compareWindow
      ? Promise.resolve(null)
      : isSchoolAdmin
        ? getCompletedUsersTotal(org, compareWindow, schoolId)
        : getCompletedUsersTotal(org, compareWindow),
  });

  // Initial scope: district-admin — the requested id or `undefined` (org filter
  // alone = all schools in the district), exactly as before. School-admin — the
  // requested id (optimistic; validated below) or, when absent, the full
  // `ownSchoolIds` list (the aggregate-all default is THEIR schools, never the
  // whole platform — school-admin has no org filter to fall back on).
  const initialSchoolScope: string | string[] | undefined = isSchoolAdmin
    ? (params.schoolId ?? ownSchoolIds)
    : params.schoolId;

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
    retentionCompareP,
    activeUsersTotalP,
    engagedUsersTotalP,
    completedPrimaryP,
    completedCompareP,
  } = buildAmplitude(initialSchoolScope);

  // Reassign the Amplitude-sourced promises to a different school scope — used
  // below only when the optimistically-fired scope turns out invalid.
  const rebuildAmplitude = (scope: string | string[] | undefined) => {
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
      retentionCompareP,
      activeUsersTotalP,
      engagedUsersTotalP,
      completedPrimaryP,
      completedCompareP,
    } = buildAmplitude(scope));
  };

  let schools: AnalyticsSchool[];
  let effectiveSchoolId: string | undefined;

  if (isSchoolAdmin) {
    // School-admin: selector options are the caller's OWN schools (from
    // step-1's `resolveDistrictAdmin`), never the district's — already
    // resolved synchronously, no fetch needed.
    schools = ownSchools;
    effectiveSchoolId =
      params.schoolId && ownSchoolIds.includes(params.schoolId)
        ? params.schoolId
        : undefined;
    if (effectiveSchoolId !== params.schoolId) {
      // Absent, or foreign to this school-admin's own list — rebuild scoped to
      // the full `ownSchoolIds` aggregate. Unlike the district-admin branch,
      // "unscoped" can never mean `undefined` here — with no org filter to
      // fall back on, that would mean the whole platform, not just their
      // schools (no data leak on a stale/foreign `?school=`).
      rebuildAmplitude(effectiveSchoolId ?? ownSchoolIds);
    }
    // step-5: roster total (funnel "Registered" + Engagement-rate denominator),
    // scoped to the SAME effective scope just resolved above — a single valid
    // `?school=` narrows it to that one school, otherwise it aggregates the
    // caller's full school list (mirrors the Amplitude scope exactly).
    schoolRegisteredP = getSchoolRosterTotal(
      token,
      effectiveSchoolId ? [effectiveSchoolId] : ownSchoolIds,
    );
  } else {
    // Await the (concurrent) school list, then validate the requested id.
    const schoolsResult = schoolsResultP ? await schoolsResultP : null;

    // District-scoped school list for the header selector (name-sorted).
    // Unaffected by the selected school filter, so the selector always lists
    // the full district.
    schools =
      schoolsResult && schoolsResult.ok
        ? (schoolsResult.data.SchoolFindMany ?? [])
            .flatMap((s) => (s && s._id ? [{ _id: s._id, name: s.name ?? null }] : []))
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        : [];

    // Validate the requested school against this district's list. A stale,
    // foreign, or removed id (a bookmarked `?school=`, or a master-admin
    // switching previewed districts with the param still set) is treated as
    // "all schools" so the header selector and the actual filter never desync
    // into silently-blank charts.
    effectiveSchoolId =
      params.schoolId && schools.some((s) => s._id === params.schoolId)
        ? params.schoolId
        : undefined;
    if (effectiveSchoolId !== params.schoolId) {
      rebuildAmplitude(effectiveSchoolId);
    }
  }

  // Live schools count — feeds the Insights box. Uses the same list the
  // selector shows (the district's for district-admin, the caller's own for
  // school-admin), so the count and the options never disagree.
  const schoolsCount = schools.length;

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

  // Adoption funnel — hybrid: "Registered" from the Blueprint roster
  // (`UserTotalsFindMany` for district-admin/preview; the school-scoped
  // `getSchoolRosterTotal` sum for school-admin, step-5), "Active Users" +
  // "Engaged" from Amplitude period uniques. "Licensed Seats" / "Champions"
  // (no real source) are omitted rather than fabricated. Real only when
  // Amplitude answered AND the roster resolved; otherwise the real stage
  // labels with zero values so the card still renders its axes.
  const adoptionFunnel = deferCard(async () => {
    const [totalsResult, schoolRegistered, activeUsersTotal, engagedUsersTotal] =
      await Promise.all([
        totalsP,
        schoolRegisteredP,
        activeUsersTotalP,
        engagedUsersTotalP,
      ]);
    const registered = isSchoolAdmin
      ? schoolRegistered
      : totalsResult.ok && totalsResult.data.UserTotalsFindMany
        ? (totalsResult.data.UserTotalsFindMany.students ?? 0) +
          (totalsResult.data.UserTotalsFindMany.teachers ?? 0)
        : null;
    if (activeUsersTotal !== null && registered !== null) {
      return [
        { key: "registered", label: "Registered", value: registered },
        { key: "active", label: "Active Users", value: activeUsersTotal },
        { key: "engaged", label: "Engaged", value: engagedUsersTotal ?? 0 },
      ];
    }
    return ZERO_FUNNEL;
  }, ZERO_FUNNEL);

  // Insights — the three prototype metrics (Engagement rate, Retention rate,
  // New sessions), composed from the already-firing (cached) promises so there
  // are no duplicate Amplitude calls. Deltas use the page's compare window, same
  // as the sibling cards. A metric is included ONLY when its displayed value is
  // > 0; a 0 or unavailable metric is dropped. When all three drop, `[]` renders
  // the card's "Still learning" empty state — i.e. 0 / no-data shows the holding
  // state (the original request), rather than a row of "0%" cards.
  const insights = deferCard(async () => {
    const [
      completedPrimary,
      completedCompare,
      totalsResult,
      schoolRegistered,
      retentionPrimary,
      retentionCompare,
      sessionsPrimary,
      sessionsCompare,
    ] = await Promise.all([
      completedPrimaryP,
      completedCompareP,
      totalsP,
      schoolRegisteredP,
      retentionP,
      retentionCompareP,
      sessionsPrimaryP,
      sessionsCompareP,
    ]);
    const out: AnalyticsDashboardData["insights"] = [];

    // 1. Engagement rate = completed ÷ registered roster (district-wide via
    // `UserTotalsFindMany` for district-admin/preview; the school-scoped
    // `getSchoolRosterTotal` sum, narrowed to `?school=` when set, for
    // school-admin — step-5; same source as the funnel's "Registered" stage
    // above).
    const registered = isSchoolAdmin
      ? schoolRegistered
      : totalsResult.ok && totalsResult.data.UserTotalsFindMany
        ? (totalsResult.data.UserTotalsFindMany.students ?? 0) +
          (totalsResult.data.UserTotalsFindMany.teachers ?? 0)
        : null;
    if (completedPrimary !== null && registered !== null && registered > 0) {
      const rate = Math.round((completedPrimary / registered) * 100);
      if (rate > 0) {
        const prevRate =
          completedCompare !== null ? (completedCompare / registered) * 100 : null;
        const deltaPP = prevRate !== null ? Math.round(rate - prevRate) : null;
        out.push({
          stat: `${rate}%`,
          title: `Engagement rate${deltaClause(deltaPP, "pts")}.`,
          description: `${completedPrimary.toLocaleString()} of ${registered.toLocaleString()} registered users completed a practice this period.`,
        });
      }
    }

    // 2. Retention rate = retention-curve peak, delta vs the compare window.
    if (retentionPrimary !== null && retentionPrimary.peakPct > 0) {
      const deltaPP =
        retentionCompare !== null
          ? Math.round(retentionPrimary.peakPct - retentionCompare.peakPct)
          : null;
      out.push({
        stat: `${retentionPrimary.peakPct}%`,
        title: `Peak retention${deltaClause(deltaPP, "pts")}.`,
        description:
          "Share of active users who returned within the retention window.",
      });
    }

    // 3. New sessions started (autocaptured `session_start`), delta vs compare.
    if (sessionsPrimary !== null) {
      const total = sum(sessionsPrimary);
      if (total > 0) {
        const delta =
          sessionsCompare !== null ? total - sum(sessionsCompare) : null;
        const description =
          delta !== null && delta !== 0
            ? `${Math.abs(delta).toLocaleString()} ${delta > 0 ? "more" : "fewer"} than the previous period.`
            : "Practice sessions started in the selected range.";
        out.push({
          stat: compactStat(total),
          title: `New sessions started across ${schoolsCount} ${schoolsCount === 1 ? "school" : "schools"}.`,
          description,
        });
      }
    }

    return out;
  }, EMPTY_INSIGHTS);

  // `null` for school-admin (no district concept for that role, by design);
  // populated for district-admin / preview exactly as before.
  const districtInfo: DistrictInfo | null =
    !isSchoolAdmin && district
      ? { _id: district._id, name: district.name, organization: district.organization }
      : null;

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
