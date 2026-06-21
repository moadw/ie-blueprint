/**
 * Server-side client for the Amplitude Dashboard REST API.
 *
 * SERVER ONLY (`.server.ts`): authenticates with HTTP Basic `apiKey:secretKey`,
 * where the secret key is sensitive and must never reach the browser bundle.
 * Region host is chosen from `AMPLITUDE_REGION` (US `amplitude.com`, EU
 * `analytics.eu.amplitude.com`).
 *
 * Every outbound call is wrapped in `safe()` so an Amplitude 500 (or a missing
 * secret key) degrades to a soft, empty result instead of throwing — the route
 * loader then renders the card's fallback state rather than white-screening
 * (CLAUDE.md "Resilient loaders").
 *
 * This module owns the shared infra used by all four district-home KPI metric
 * functions. Step-3 implements `getAvgSessionDuration`; steps 4/5/6 add their
 * own metric functions (Daily Active Sessions Index, School Participation
 * Index, Total Minutes Listened) using the same helpers below — they must not
 * re-edit the district-home loader, only add functions here.
 */
import { env } from "~/lib/env";
import { serverEnv } from "~/lib/env.server";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { SchoolFindManyDocument } from "~/queries/schools";

// ---------------------------------------------------------------------------
// Region host
// ---------------------------------------------------------------------------

const REGION_HOSTS: Record<"us" | "eu", string> = {
  us: "https://amplitude.com/api/2",
  eu: "https://analytics.eu.amplitude.com/api/2",
};

function apiBase(): string {
  return REGION_HOSTS[serverEnv.AMPLITUDE_REGION];
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

/**
 * Whether the Dashboard REST API is usable (both Basic-auth halves present).
 * When false, every helper resolves to a soft-error / empty result so the
 * loader renders the fallback instead of throwing.
 */
export function isAmplitudeConfigured(): boolean {
  return Boolean(serverEnv.AMPLITUDE_API_KEY && serverEnv.AMPLITUDE_SECRET_KEY);
}

function basicAuthHeader(): string | null {
  const key = serverEnv.AMPLITUDE_API_KEY;
  const secret = serverEnv.AMPLITUDE_SECRET_KEY;
  if (!key || !secret) return null;
  const encoded = Buffer.from(`${key}:${secret}`).toString("base64");
  return `Basic ${encoded}`;
}

// ---------------------------------------------------------------------------
// Date-window helpers (Dashboard REST uses YYYYMMDD)
// ---------------------------------------------------------------------------

function formatYMD(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * A trailing N-day window ending today (UTC), inclusive, as `YYYYMMDD`
 * `start`/`end`. Default 7 days → the 7-bar home sparklines.
 */
export function dailyWindow(days = 7): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { start: formatYMD(start), end: formatYMD(end) };
}

// ---------------------------------------------------------------------------
// Segment filter (the `organization` property stamped on every event)
// ---------------------------------------------------------------------------

/**
 * One Amplitude segment-filter clause. The Dashboard REST `s` parameter is a
 * JSON-encoded array of these clauses (each `prop` "and"-ed together).
 */
export interface SegmentClause {
  prop: string;
  op: "is" | "is not" | "contains" | "does not contain";
  values: string[];
}

/**
 * Build a segment-filter clause matching events where the `organization` event
 * property equals `org`. `organization` is the property `analytics.ts` stamps
 * on every event (and the org group key), so this scopes a query to a single
 * district. An empty/falsy org yields no filter (all-org baseline).
 */
export function orgSegmentFilter(org: string | null | undefined): SegmentClause[] {
  if (!org) return [];
  return [{ prop: "gp:organization", op: "is", values: [org] }];
}

// ---------------------------------------------------------------------------
// Low-level fetch
// ---------------------------------------------------------------------------

/**
 * GET a Dashboard REST endpoint (path relative to `/api/2`, e.g.
 * `sessions/average`). Returns parsed JSON or a soft error. Never throws.
 * `segment` is JSON-encoded into the `s` query param when non-empty.
 */
async function amplitudeGet<T = unknown>(
  endpoint: string,
  params: Record<string, string>,
  segment: SegmentClause[] = [],
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const auth = basicAuthHeader();
  if (!auth) {
    return { ok: false, error: "Amplitude credentials not configured" };
  }

  const url = new URL(`${apiBase()}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (segment.length > 0) {
    url.searchParams.set("s", JSON.stringify(segment));
  }

  const result = await safe(
    fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: auth, Accept: "application/json" },
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
          `Amplitude ${endpoint} ${res.status}: ${body.slice(0, 200)}`,
        );
      }
      return (await res.json()) as T;
    }),
  );

  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, data: result.data };
}

// ---------------------------------------------------------------------------
// Response shape helpers (Dashboard REST chart responses)
// ---------------------------------------------------------------------------

/**
 * Dashboard chart endpoints (`sessions/average`, `events/segmentation`, etc.)
 * return `{ data: { series: number[][], seriesLabels, xValues } }`. `series[0]`
 * is the daily value array for the (single) segment we request; when the query
 * is grouped (e.g. `events/segmentation` grouped by the `schools` property)
 * each entry in `series` is the daily array for one group value, named by the
 * matching entry in `seriesLabels`. Defensive: any shape mismatch yields an
 * empty series.
 */
interface DashboardChartResponse {
  data?: {
    series?: number[][];
    seriesLabels?: unknown[];
    xValues?: string[];
  };
}

function firstSeries(resp: DashboardChartResponse): number[] {
  const series = resp.data?.series;
  if (!Array.isArray(series) || series.length === 0) return [];
  const first = series[0];
  if (!Array.isArray(first)) return [];
  return first.map((n) => (typeof n === "number" && isFinite(n) ? n : 0));
}

/**
 * All daily group series from a grouped chart response, each sanitized to
 * finite numbers. `series[i]` is the daily array for the group named by
 * `seriesLabels[i]`. Returns `[]` on any shape mismatch.
 */
function allSeries(resp: DashboardChartResponse): number[][] {
  const series = resp.data?.series;
  if (!Array.isArray(series)) return [];
  return series
    .filter((row): row is number[] => Array.isArray(row))
    .map((row) =>
      row.map((n) => (typeof n === "number" && isFinite(n) ? n : 0)),
    );
}

/**
 * Per-day count of *distinct* groups that had any activity, from a grouped
 * chart response. With `events/segmentation` grouped by the `schools` event
 * property, each group is one school, so this is the count of distinct active
 * schools per day: for day index `d`, the number of group series whose value
 * on day `d` is `> 0`. Returns `[]` when there are no groups.
 */
function distinctActiveGroupsPerDay(resp: DashboardChartResponse): number[] {
  const rows = allSeries(resp);
  if (rows.length === 0) return [];
  const days = rows.reduce((max, row) => (row.length > max ? row.length : max), 0);
  const counts: number[] = [];
  for (let d = 0; d < days; d++) {
    let active = 0;
    for (const row of rows) {
      if ((row[d] ?? 0) > 0) active++;
    }
    counts.push(active);
  }
  return counts;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

function total(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

// ---------------------------------------------------------------------------
// Per-org in-memory TTL cache
// ---------------------------------------------------------------------------

/**
 * District aggregates are slow-moving and the Dashboard API is cost-based
 * rate-limited, so cache per (metric + org) for a TTL rather than querying on
 * every page load. Module-scope map (per server process); fine for these
 * low-cardinality, low-churn values.
 */
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map<string, { at: number; value: unknown }>();

async function cached<T>(key: string, compute: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.value as T;
  }
  const value = await compute();
  cache.set(key, { at: Date.now(), value });
  return value;
}

/** Test/maintenance hook — clears the per-org metric cache. */
export function clearAmplitudeCache(): void {
  cache.clear();
}

// ---------------------------------------------------------------------------
// Shared metric result shape
// ---------------------------------------------------------------------------

/**
 * A district KPI: `value` = the org-filtered figure, `benchmark` = the
 * unfiltered (all-org / cross-district) baseline, `series` = the 7-day daily
 * trend for the org. All zero/empty on soft error so cards fall back cleanly.
 */
export interface MetricResult {
  value: number;
  benchmark: number;
  series: number[];
}

const EMPTY_METRIC: MetricResult = { value: 0, benchmark: 0, series: [] };

// ---------------------------------------------------------------------------
// Endpoint wrappers (shared by metric functions across steps)
// ---------------------------------------------------------------------------

/**
 * `GET /api/2/sessions/average` — average session length per day over the
 * window, optionally org-filtered. Returns the daily series.
 */
async function fetchSessionAverageSeries(
  window: { start: string; end: string },
  segment: SegmentClause[],
): Promise<number[]> {
  const resp = await amplitudeGet<DashboardChartResponse>(
    "sessions/average",
    { start: window.start, end: window.end },
    segment,
  );
  if (!resp.ok) return [];
  return firstSeries(resp.data);
}

/**
 * `GET /api/2/sessions/peruser` — average number of sessions per active user
 * per day over the window, optionally org-filtered. This is the daily
 * active-sessions *rate* the research recommends for the index (autocapture
 * gives Amplitude session ids today). Returns the daily series.
 */
async function fetchSessionsPerUserSeries(
  window: { start: string; end: string },
  segment: SegmentClause[],
): Promise<number[]> {
  const resp = await amplitudeGet<DashboardChartResponse>(
    "sessions/peruser",
    { start: window.start, end: window.end },
    segment,
  );
  if (!resp.ok) return [];
  return firstSeries(resp.data);
}

/**
 * `GET /api/2/events/segmentation` for "Any Active Event" (`_active`) grouped
 * by the `schools` event property over the window, optionally org-filtered.
 * The `school` dimension is stamped on every event by `analytics.ts` (step-1).
 * Each returned group is one school, so this gives the daily count of *distinct
 * active schools* — schools with ≥1 of their users firing any event that day.
 * Returns the daily distinct-active-schools series.
 *
 * Request shape (Dashboard REST):
 *   - `e` = the event definition JSON. `_active` = Amplitude's "Any Active
 *     Event"; `group_by` puts one series per distinct value of the `schools`
 *     event property.
 *   - `m` = `uniques` (distinct users), though only presence (`> 0`) matters
 *     for the distinct-school count.
 */
async function fetchActiveSchoolsPerDay(
  window: { start: string; end: string },
  segment: SegmentClause[],
): Promise<number[]> {
  const event = {
    event_type: "_active",
    group_by: [{ type: "event", value: "schools" }],
  };
  const resp = await amplitudeGet<DashboardChartResponse>(
    "events/segmentation",
    {
      e: JSON.stringify(event),
      start: window.start,
      end: window.end,
      m: "uniques",
    },
    segment,
  );
  if (!resp.ok) return [];
  return distinctActiveGroupsPerDay(resp.data);
}

/**
 * `GET /api/2/events/segmentation` summing a numeric event property over the
 * window, optionally org-filtered. Returns the daily summed-property series.
 *
 * Request shape (Dashboard REST):
 *   - `e` = the event definition JSON. `group_by` names the **event property to
 *     sum** (`{ type: "event", value: property }`) — for `m = "sums"` Amplitude
 *     aggregates that property's value rather than partitioning by it, so the
 *     result is a single series of the daily property total.
 *   - `m` = `sums` (sum of the property value).
 * Each daily value is the org-filtered (or all-org) sum of `property` for that
 * day. `firstSeries` sanitizes non-finite entries to 0 (zero data → all-zero
 * series, never `NaN`).
 */
async function fetchSummedPropertySeries(
  property: string,
  window: { start: string; end: string },
  eventType: string,
  segment: SegmentClause[],
): Promise<number[]> {
  const event = {
    event_type: eventType,
    group_by: [{ type: "event", value: property }],
  };
  const resp = await amplitudeGet<DashboardChartResponse>(
    "events/segmentation",
    {
      e: JSON.stringify(event),
      start: window.start,
      end: window.end,
      m: "sums",
    },
    segment,
  );
  if (!resp.ok) return [];
  return firstSeries(resp.data);
}

/**
 * Live total-schools roster count for a district, used as the Participation
 * Index denominator. Counts `SchoolFindMany({ district, platform })` (limit
 * 500 — districts stay well under a single page, so no pagination) and returns
 * `.length`. The live roster, NOT the stale `UserTotalsFindMany`. `safe()`-
 * wrapped; returns `null` on any error so the caller degrades softly.
 */
async function fetchTotalSchools(
  districtId: string,
  token: string,
): Promise<number | null> {
  const result = await safe(
    gqlClient.request(
      SchoolFindManyDocument,
      { filter: { district: districtId, platform: env.PLATFORM }, limit: 500 },
      { "access-token": token },
    ),
  );
  if (!result.ok) return null;
  return result.data.SchoolFindMany?.length ?? 0;
}

// ---------------------------------------------------------------------------
// Metric: Avg Session Duration (this step)
// ---------------------------------------------------------------------------

/**
 * Avg Session Duration for the district vs. the cross-district baseline.
 *
 * - `value`     = avg over the 7-day window of the org-filtered daily averages.
 * - `benchmark` = same, unfiltered (all orgs) — the cross-district baseline
 *                 the home card's "Average" comparison bar shows.
 * - `series`    = the org's daily averages (7-bar sparkline input).
 *
 * Amplitude returns session length in **seconds**; the card renders minutes, so
 * the loader converts. Soft-fails to the empty metric (no throw) when the
 * secret key is missing or a call errors.
 */
export async function getAvgSessionDuration(
  params: MetricParams,
): Promise<MetricResult> {
  const { org } = params;
  if (!isAmplitudeConfigured()) return EMPTY_METRIC;
  const key = `avg-session-duration:${org ?? "all"}`;
  return cached(key, async () => {
    const window = dailyWindow(7);
    const [orgSeries, allSeries] = await Promise.all([
      fetchSessionAverageSeries(window, orgSegmentFilter(org)),
      fetchSessionAverageSeries(window, []),
    ]);
    return {
      value: average(orgSeries),
      benchmark: average(allSeries),
      series: orgSeries,
    };
  });
}

// ---------------------------------------------------------------------------
// Shared metric params (passed to every district-home metric function)
// ---------------------------------------------------------------------------

/**
 * Shared params for every district-home metric function. The district-home
 * loader (`district.home.tsx`) passes the same object to all four so steps
 * 4/5/6 can fill in their own function without re-editing the loader:
 *   - `org`        — organization id (Amplitude `organization` filter value).
 *   - `token`      — Blueprint access-token (step-5's participation denominator
 *                    needs a `SchoolFindMany` count).
 *   - `districtId` — resolved district `_id` (step-5 denominator filter).
 *
 * Unimplemented metrics return `null` so the loader leaves their card on its
 * fallback/soft state. Each step replaces the body and returns a `MetricResult`.
 */
export interface MetricParams {
  org: string | null | undefined;
  token: string;
  districtId: string | null | undefined;
}

// ---------------------------------------------------------------------------
// Metric: Daily Active Sessions Index (`/100`) — this step
// ---------------------------------------------------------------------------

/**
 * Normalization for the Daily Active Sessions Index (`X/100`).
 *
 * The card shows a single 0–100 "index" plus a 7-day sparkline. Amplitude only
 * returns the raw daily active-sessions *rate* (sessions per active user per
 * day, from `sessions/peruser`); mapping that to a `/100` index is OUR business
 * logic and must be reviewable/tunable — hence this named formula.
 *
 * Default formula (proposed in root.md derail notes; pending stakeholder sign-off):
 *
 *     index = round( latestDay / peak(7-day window) * 100 ), clamped to [0, 100]
 *
 * i.e. the most recent day's daily-active-sessions rate as a percentage of the
 * org's own recent peak over the trailing 7 days. 100 ⇒ today is the best day of
 * the week; lower ⇒ today is below the recent high-water mark. This is
 * self-relative (no cross-district baseline needed) and naturally lands in
 * 0–100 without an external target. If `peak` is 0 (no activity) the index is 0.
 *
 * TODO(index-formula): confirm with stakeholders whether the `/100` denominator
 * should be the org's own 7-day peak (this default) or a platform-wide
 * per-capita target — see root.md "Derail notes" / research Open Questions.
 */
const DAILY_ACTIVE_INDEX_MAX = 100;

function dailyActiveSessionsIndex(series: number[]): { index: number; peak: number } {
  if (series.length === 0) return { index: 0, peak: 0 };
  const peak = series.reduce((max, n) => (n > max ? n : max), 0);
  const latest = series[series.length - 1] ?? 0;
  if (peak <= 0) return { index: 0, peak: 0 };
  const raw = (latest / peak) * DAILY_ACTIVE_INDEX_MAX;
  const clamped = Math.max(0, Math.min(DAILY_ACTIVE_INDEX_MAX, raw));
  return { index: Math.round(clamped), peak };
}

/**
 * Daily Active Sessions Index for the district.
 *
 * - `value`     = the 0–100 index (see `dailyActiveSessionsIndex` above): the
 *                 latest day's active-sessions rate as a % of the 7-day peak.
 * - `benchmark` = the peak (in raw sessions/user/day) we normalized against —
 *                 the "100" reference point, surfaced for review/debug. The
 *                 card's badge derivation handles a 0 benchmark gracefully.
 * - `series`    = the org's daily active-sessions rate (7-bar sparkline input;
 *                 the raw values, NOT re-normalized, so the sparkline shows the
 *                 true daily shape).
 *
 * Soft-fails to the empty metric (no throw) when the secret key is missing or a
 * call errors — the loader then renders the card's fallback state.
 */
export async function getDailyActiveSessionsIndex(
  params: MetricParams,
): Promise<MetricResult | null> {
  const { org } = params;
  if (!isAmplitudeConfigured()) return EMPTY_METRIC;
  const key = `daily-active-sessions-index:${org ?? "all"}`;
  return cached(key, async () => {
    const window = dailyWindow(7);
    const orgSeries = await fetchSessionsPerUserSeries(
      window,
      orgSegmentFilter(org),
    );
    const { index, peak } = dailyActiveSessionsIndex(orgSeries);
    return {
      value: index,
      benchmark: peak,
      series: orgSeries,
    };
  });
}

// ---------------------------------------------------------------------------
// Metric stubs (implemented by steps 5/6 — same signature, swap the body)
// ---------------------------------------------------------------------------

/**
 * School Participation Index for the district — the one *blended* KPI.
 *
 * A `0–1` ratio: distinct **active schools** (Amplitude, via the `schools`
 * dimension from step-1) ÷ **total schools** in the district (live
 * `SchoolFindMany` roster, NOT the stale `UserTotalsFindMany`).
 *
 * - `value`     = the period ratio: latest-day distinct active schools ÷ total
 *                 schools, clamped to `[0, 1]`.
 * - `benchmark` = the total-schools denominator, surfaced for review/debug
 *                 (there is no cross-district baseline for this metric).
 * - `series`    = the 7-day daily participation ratio (distinct active schools
 *                 that day ÷ total schools), each clamped to `[0, 1]` — the
 *                 7-bar sparkline input.
 *
 * Divide-by-zero guard: `totalSchools === 0` (or no district / unresolved
 * roster) → returns the empty metric, never `NaN`/`Infinity`. Soft-fails to
 * the empty metric (no throw) when the secret key is missing or a call errors,
 * so the loader renders the card's fallback state.
 */
export async function getSchoolParticipationIndex(
  params: MetricParams,
): Promise<MetricResult | null> {
  const { org, token, districtId } = params;
  if (!isAmplitudeConfigured()) return EMPTY_METRIC;
  if (!districtId) return EMPTY_METRIC;
  const key = `school-participation-index:${org ?? "all"}:${districtId}`;
  return cached(key, async () => {
    const totalSchools = await fetchTotalSchools(districtId, token);
    // Divide-by-zero / unresolved roster → soft empty (no NaN/Infinity).
    if (!totalSchools || totalSchools <= 0) return EMPTY_METRIC;

    const window = dailyWindow(7);
    const activePerDay = await fetchActiveSchoolsPerDay(
      window,
      orgSegmentFilter(org),
    );

    const ratioSeries = activePerDay.map((active) =>
      Math.min(1, active / totalSchools),
    );
    const latest = ratioSeries[ratioSeries.length - 1] ?? 0;

    return {
      value: latest,
      benchmark: totalSchools,
      series: ratioSeries,
    };
  });
}

// ---------------------------------------------------------------------------
// Metric: Total Minutes Listened (this step)
// ---------------------------------------------------------------------------

/**
 * The duration event property summed for Total Minutes Listened. `analytics.ts`
 * (`trackContentPlayed`) emits an integer `seconds` event property on every
 * `content_played` event — that is the playback duration we sum.
 */
const CONTENT_PLAYED_EVENT = "content_played";
const DURATION_PROPERTY = "seconds";

/**
 * Cross-district benchmark divisor for Total Minutes Listened.
 *
 * The card's "Average" comparison bar wants a *per-district* baseline so a
 * single district's total is comparable against a typical district. Amplitude's
 * unfiltered `events/segmentation` gives us the **all-org** (whole-platform)
 * summed playback total, but the Dashboard REST response carries no
 * district-count, and counting districts here would mean an extra Blueprint
 * round-trip on every load for a baseline that is still a placeholder (the same
 * "what is 'Average'?" question flagged for cards 3/4 in the research doc). So
 * we derive the per-district average as `all-org total ÷ BENCHMARK_DISTRICT_COUNT`,
 * a single tunable constant, rather than a live count.
 *
 * TODO(total-minutes-benchmark): confirm with stakeholders the right
 * cross-district baseline for Total Minutes Listened — a live district count
 * (extra `DistrictFindMany` query), a fixed platform target, or this constant.
 * Until then this is a documented placeholder, NOT a vetted figure. Kept in the
 * same units (seconds) as `value` so the card's `/3600` makes both hours.
 */
const BENCHMARK_DISTRICT_COUNT = 1;

/**
 * Total Minutes Listened for the district vs. the cross-district baseline.
 *
 * Sums the `content_played` event's `seconds` duration property (step-2's
 * playback instrumentation) over the 7-day window via Amplitude
 * `events/segmentation` with `m = "sums"`.
 *
 * - `value`     = org-filtered total playback **seconds** over the window. The
 *                 card (`district.home.tsx` `totalMinutesCard`) divides by 3600
 *                 to render the `hrs` unit, so this is returned in seconds (same
 *                 contract as `getAvgSessionDuration`, which returns seconds and
 *                 lets the card convert).
 * - `benchmark` = the cross-district per-district average in **seconds** =
 *                 all-org total ÷ `BENCHMARK_DISTRICT_COUNT` (see the constant's
 *                 note; flagged for stakeholder review). The card's `ComparisonBar`
 *                 shows this as "Average" vs. the district's "Your Result".
 * - `series`    = the org's daily total playback seconds (7-bar sparkline input).
 *
 * Zero `content_played` data (fresh instrumentation) → all-zero series → `value`
 * 0, `benchmark` 0 (never `NaN`: empty series sum to 0 and the divisor is ≥ 1).
 * Soft-fails to the empty metric (no throw) when the secret key is missing or a
 * call errors — the loader then renders the card's fallback state.
 */
export async function getTotalMinutesListened(
  params: MetricParams,
): Promise<MetricResult | null> {
  const { org } = params;
  if (!isAmplitudeConfigured()) return EMPTY_METRIC;
  const key = `total-minutes-listened:${org ?? "all"}`;
  return cached(key, async () => {
    const window = dailyWindow(7);
    const [orgSeries, allSeries] = await Promise.all([
      fetchSummedPropertySeries(
        DURATION_PROPERTY,
        window,
        CONTENT_PLAYED_EVENT,
        orgSegmentFilter(org),
      ),
      fetchSummedPropertySeries(
        DURATION_PROPERTY,
        window,
        CONTENT_PLAYED_EVENT,
        [],
      ),
    ]);
    // Divisor is a constant ≥ 1, so this never produces NaN/Infinity.
    const benchmark = total(allSeries) / Math.max(1, BENCHMARK_DISTRICT_COUNT);
    return {
      value: total(orgSeries),
      benchmark,
      series: orgSeries,
    };
  });
}
