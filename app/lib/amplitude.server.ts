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

/**
 * Build a segment-filter clause scoping a query to a single school via the
 * `gp:school` group property `analytics.ts` stamps on every event. `schools` is
 * an ARRAY property (a user can belong to several schools), so `op: "is"` here
 * means "the school set CONTAINS this id" — a multi-school user's events match
 * under any of their schools, not exclusively this one. An empty/falsy id yields
 * no filter (district-wide baseline).
 */
export function schoolSegmentFilter(schoolId?: string | null): SegmentClause[] {
  if (!schoolId) return [];
  return [{ prop: "gp:school", op: "is", values: [schoolId] }];
}

// ---------------------------------------------------------------------------
// Low-level fetch — concurrency gate + 429 retry
//
// The Amplitude Dashboard REST API allows only a few CONCURRENT requests per
// project (≈4-5); beyond that it returns HTTP 429. The district-home fires ~4
// metric queries, but the analytics tab fans out ~12 (primary + comparison +
// funnel + retention), so a naive `Promise.all` makes most of them 429 and
// silently fall back to mock. A small module-scope semaphore (shared across
// home + tab in this server process) caps in-flight requests at 2 — well below
// Amplitude's limit, with headroom for the heavier sums/retention queries; an
// exponential-backoff retry handles any 429 that still slips through. Soft
// failures are NOT cached (see `cached`), so a straggler recovers on the next
// load. The 10-min per-metric cache means this gate only bites on a cold load.
// ---------------------------------------------------------------------------

const MAX_CONCURRENT_AMPLITUDE = 2;
let amplitudeActive = 0;
const amplitudeQueue: Array<() => void> = [];

function acquireAmplitudeSlot(): Promise<void> {
  if (amplitudeActive < MAX_CONCURRENT_AMPLITUDE) {
    amplitudeActive++;
    return Promise.resolve();
  }
  return new Promise((resolve) => amplitudeQueue.push(resolve));
}

function releaseAmplitudeSlot(): void {
  const next = amplitudeQueue.shift();
  // Hand the just-freed slot straight to the next waiter (active count stays);
  // only decrement when nobody is waiting.
  if (next) next();
  else amplitudeActive--;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET a Dashboard REST endpoint (path relative to `/api/2`, e.g.
 * `sessions/average`). Returns parsed JSON or a soft error. Never throws.
 * `segment` is JSON-encoded into the `s` query param when non-empty. Runs under
 * the concurrency gate and retries HTTP 429 / network errors with linear
 * backoff (up to 4 attempts).
 */
export async function amplitudeGet<T = unknown>(
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

  await acquireAmplitudeSlot();
  try {
    const MAX_ATTEMPTS = 6;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { Authorization: auth, Accept: "application/json" },
        });
        if (res.status === 429) {
          if (attempt < MAX_ATTEMPTS - 1) {
            // Exponential backoff (capped) so a query under cost-based throttling
            // gets several escalating chances rather than giving up to mock.
            await sleep(Math.min(3200, 400 * 2 ** attempt));
            continue;
          }
          return { ok: false, error: `Amplitude ${endpoint} 429: rate limited` };
        }
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          return {
            ok: false,
            error: `Amplitude ${endpoint} ${res.status}: ${body.slice(0, 200)}`,
          };
        }
        return { ok: true, data: (await res.json()) as T };
      } catch (err) {
        // Network/transport error — retry with the same backoff, then give up soft.
        if (attempt === MAX_ATTEMPTS - 1) {
          return {
            ok: false,
            error: err instanceof Error ? err.message : "Amplitude fetch failed",
          };
        }
        await sleep(Math.min(3200, 400 * 2 ** attempt));
      }
    }
    return { ok: false, error: `Amplitude ${endpoint}: exhausted retries` };
  } finally {
    releaseAmplitudeSlot();
  }
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
export interface DashboardChartResponse {
  data?: {
    series?: number[][];
    seriesLabels?: unknown[];
    xValues?: string[];
    // The period-collapsed value(s): `seriesCollapsed[0][0].value` is the single
    // figure for the whole window (e.g. distinct users over the period, NOT the
    // sum of daily uniques, which over-counts repeat users).
    seriesCollapsed?: Array<Array<{ value?: number }>>;
  };
}

export function firstSeries(resp: DashboardChartResponse): number[] {
  const series = resp.data?.series;
  if (!Array.isArray(series) || series.length === 0) return [];
  const first = series[0];
  if (!Array.isArray(first)) return [];
  return first.map((n) => (typeof n === "number" && isFinite(n) ? n : 0));
}

/**
 * The period-collapsed value of a chart response — the single figure for the
 * whole window. For `m=uniques` this is the distinct-user count over the period
 * (the right denominator for a funnel stage), unlike summing the daily series.
 * Defensive: 0 on any shape mismatch.
 */
export function collapsedValue(resp: DashboardChartResponse): number {
  const v = resp.data?.seriesCollapsed?.[0]?.[0]?.value;
  return typeof v === "number" && isFinite(v) ? v : 0;
}

/**
 * All daily group series from a grouped chart response, each sanitized to
 * finite numbers. `series[i]` is the daily array for the group named by
 * `seriesLabels[i]`. Returns `[]` on any shape mismatch.
 */
export function allSeries(resp: DashboardChartResponse): number[][] {
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

export async function cached<T>(key: string, compute: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.value as T;
  }
  const value = await compute();
  // Never cache a soft failure (`null`/`undefined`): a transient 429/network
  // error must be retried on the next load, not pinned for the whole TTL (which
  // would freeze one card on its mock fallback for 10 minutes). Successful
  // results — including legitimate empty ones like EMPTY_METRIC or `0` — cache.
  if (value != null) {
    cache.set(key, { at: Date.now(), value });
  }
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

// ===========================================================================
// District Analytics TAB — arbitrary-window daily series
//
// The home KPIs use a fixed trailing 7-day window (`dailyWindow`). The Analytics
// tab (`/district/analytics`) drives an arbitrary primary range + comparison
// window from the URL, so these fetchers take an explicit `{start,end}` window
// (YYYYMMDD) and return the raw daily series for that range. All SHAPING
// (totals, period deltas, heatmap grid, weekday peak, breakdowns) lives in
// `district-analytics.server.ts`; this module only talks to Amplitude.
//
// Each returns the daily `number[]` on success or **`null`** on soft error /
// unconfigured, so the caller can tell "no data source" (→ fall back) apart
// from "real source, zero activity" (→ honest zeros). Each is cached per
// (metric + org + window) like the home metrics.
// ===========================================================================

/** ISO `YYYY-MM-DD` → Dashboard REST `YYYYMMDD`. */
export function ymdFromISO(iso: string): string {
  return iso.replaceAll("-", "").slice(0, 8);
}

/** A primary/compare date window for the tab, as Dashboard REST `YYYYMMDD`. */
export interface AnalyticsWindow {
  start: string;
  end: string;
}

/** Build an {@link AnalyticsWindow} from ISO `YYYY-MM-DD` start/end. */
export function windowFromISO(startISO: string, endISO: string): AnalyticsWindow {
  return { start: ymdFromISO(startISO), end: ymdFromISO(endISO) };
}

/**
 * One event-property filter clause for an `events/segmentation` `e.filters`
 * entry — filters the event stream by an event property (e.g. `userType` =
 * `teacher`). Distinct from {@link SegmentClause} (the `s` param), which filters
 * by user/group properties. `userType` is stamped on every event by
 * `analytics.ts`, so it is available as an event-property filter here.
 */
export interface EventPropFilter {
  subprop_type: "event";
  subprop_key: string;
  subprop_op: "is" | "is not";
  subprop_value: string[];
}

/**
 * Daily series for an `events/segmentation` query over an arbitrary window.
 *
 *   - `metric`    = the Amplitude measure: `totals` (event count), `uniques`
 *                   (distinct users), or `sums` (sum of a numeric property).
 *   - `sumProp`   = the event property to sum (required for `sums`; Amplitude
 *                   sums the value named by `group_by` when `m=sums`).
 *   - `filters`   = event-property filters AND-ed into the event definition.
 *   - `segment`   = the `s` clauses (org scope via `gp:organization`).
 *
 * Returns the daily `number[]` (non-finite entries sanitized to 0) on success,
 * or `null` on soft error / unconfigured.
 */
interface SegmentationOpts {
  eventType: string;
  window: AnalyticsWindow;
  metric: "totals" | "uniques" | "sums";
  segment: SegmentClause[];
  sumProp?: string;
  filters?: EventPropFilter[];
}

/** Run an `events/segmentation` query, returning the parsed chart response or
 * `null` on soft error / unconfigured. Shared by the series + collapsed wrappers. */
async function segmentationRequest(
  opts: SegmentationOpts,
): Promise<DashboardChartResponse | null> {
  if (!isAmplitudeConfigured()) return null;
  const event: Record<string, unknown> = { event_type: opts.eventType };
  if (opts.sumProp) {
    event.group_by = [{ type: "event", value: opts.sumProp }];
  }
  if (opts.filters && opts.filters.length > 0) {
    event.filters = opts.filters;
  }
  const resp = await amplitudeGet<DashboardChartResponse>(
    "events/segmentation",
    {
      e: JSON.stringify(event),
      start: opts.window.start,
      end: opts.window.end,
      m: opts.metric,
    },
    opts.segment,
  );
  return resp.ok ? resp.data : null;
}

/** Daily series for a segmentation query (`null` on soft error / unconfigured). */
async function fetchSegmentationSeries(
  opts: SegmentationOpts,
): Promise<number[] | null> {
  const data = await segmentationRequest(opts);
  return data ? firstSeries(data) : null;
}

/** Period-collapsed value for a segmentation query (`null` on soft error). */
async function fetchSegmentationCollapsed(
  opts: SegmentationOpts,
): Promise<number | null> {
  const data = await segmentationRequest(opts);
  return data ? collapsedValue(data) : null;
}

/**
 * Daily **practice-session counts** (`session_start` totals) for the org over
 * the window. Drives the Analytics tab's "Practice Sessions" card. `null` on
 * soft error / unconfigured.
 */
export function getSessionCountSeries(
  org: string | null | undefined,
  window: AnalyticsWindow,
  schoolId?: string | null,
): Promise<number[] | null> {
  const key = `tab-sessions:${org ?? "all"}:${schoolId ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationSeries({
      eventType: "session_start",
      window,
      metric: "totals",
      segment: [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
    }),
  );
}

/**
 * Daily **distinct active teachers** (`_active` uniques filtered to
 * `userType = teacher`) for the org. Drives the "Active Educators" card.
 * `null` on soft error / unconfigured.
 */
export function getActiveTeacherSeries(
  org: string | null | undefined,
  window: AnalyticsWindow,
  schoolId?: string | null,
): Promise<number[] | null> {
  const key = `tab-teachers:${org ?? "all"}:${schoolId ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationSeries({
      eventType: "_active",
      window,
      metric: "uniques",
      segment: [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
      filters: [
        {
          subprop_type: "event",
          subprop_key: "userType",
          subprop_op: "is",
          subprop_value: ["teacher"],
        },
      ],
    }),
  );
}

/**
 * **Distinct active teachers** over the whole period (`_active` uniques filtered
 * to `userType = teacher`, collapsed). This is the right total for the "Active
 * Educators" headline — unlike summing the daily-uniques series, which counts a
 * teacher once per active day. `null` on soft error / unconfigured.
 */
export function getActiveTeacherTotal(
  org: string | null | undefined,
  window: AnalyticsWindow,
  schoolId?: string | null,
): Promise<number | null> {
  const key = `tab-teachers-total:${org ?? "all"}:${schoolId ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationCollapsed({
      eventType: "_active",
      window,
      metric: "uniques",
      segment: [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
      filters: [
        {
          subprop_type: "event",
          subprop_key: "userType",
          subprop_op: "is",
          subprop_value: ["teacher"],
        },
      ],
    }),
  );
}

/**
 * Daily **distinct active users** (any `userType`, `_active` uniques) for the
 * org — the funnel's "Active" stage input. `null` on soft error / unconfigured.
 */
export function getActiveUserSeries(
  org: string | null | undefined,
  window: AnalyticsWindow,
): Promise<number[] | null> {
  const key = `tab-active:${org ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationSeries({
      eventType: "_active",
      window,
      metric: "uniques",
      segment: orgSegmentFilter(org),
    }),
  );
}

/**
 * Daily **total mindful seconds** (`content_played` summed `seconds`) for the
 * org. Drives the "Mindful Minutes" headline. Optionally scoped to a single
 * `userType` (for the real per-role breakdown). `null` on soft error /
 * unconfigured.
 */
export function getMindfulSecondsSeries(
  org: string | null | undefined,
  window: AnalyticsWindow,
  userType?: string,
  schoolId?: string | null,
): Promise<number[] | null> {
  const scope = userType ?? "all";
  const key = `tab-mindful:${org ?? "all"}:${schoolId ?? "all"}:${scope}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationSeries({
      eventType: "content_played",
      window,
      metric: "sums",
      sumProp: DURATION_PROPERTY,
      segment: [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
      ...(userType
        ? {
            filters: [
              {
                subprop_type: "event" as const,
                subprop_key: "userType",
                subprop_op: "is" as const,
                subprop_value: [userType],
              },
            ],
          }
        : {}),
    }),
  );
}

// ---------------------------------------------------------------------------
// Adoption funnel period totals (distinct users over the whole window)
//
// Funnel stages need the *distinct users over the period*, not the sum of daily
// uniques (which double-counts repeat users), so these read the collapsed value.
// ---------------------------------------------------------------------------

/**
 * Distinct **active users** (any `userType`) over the period for the org — the
 * funnel's "Active Users" stage. `null` on soft error / unconfigured.
 */
export function getActiveUsersTotal(
  org: string | null | undefined,
  window: AnalyticsWindow,
  schoolId?: string | null,
): Promise<number | null> {
  const key = `tab-active-total:${org ?? "all"}:${schoolId ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationCollapsed({
      eventType: "_active",
      window,
      metric: "uniques",
      segment: [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
    }),
  );
}

/**
 * Distinct **engaged users** over the period for the org — users who actually
 * played mindfulness content (`content_played` uniques). The funnel's "Engaged"
 * stage. `null` on soft error / unconfigured.
 */
export function getEngagedUsersTotal(
  org: string | null | undefined,
  window: AnalyticsWindow,
  schoolId?: string | null,
): Promise<number | null> {
  const key = `tab-engaged-total:${org ?? "all"}:${schoolId ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationCollapsed({
      eventType: "content_played",
      window,
      metric: "uniques",
      segment: [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
    }),
  );
}

/**
 * Distinct users who **completed at least one practice** over the period
 * (uniques of `practice_completed`) for the org. This is the numerator of the
 * district-home "Active User Rate" — the client defines an Active User as one
 * who logs in AND completes ≥1 practice. The `practice_completed` event is
 * emitted client-side when a class's final media step ends (see
 * `recordCompletion` in the lesson route). `null` on soft error / unconfigured.
 */
export function getCompletedUsersTotal(
  org: string | null | undefined,
  window: AnalyticsWindow,
): Promise<number | null> {
  const key = `home-completed-total:${org ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationCollapsed({
      eventType: "practice_completed",
      window,
      metric: "uniques",
      segment: orgSegmentFilter(org),
    }),
  );
}

// ---------------------------------------------------------------------------
// Retention (N-day) — drives the Analytics tab's "Retention" card
//
// The Dashboard REST `/retention` endpoint has its own response shape (NOT the
// `events/segmentation` chart shape). `rm=nday` returns an N-day retention
// curve; `series[0].combined[n]` is the aggregated `{count, outof}` for day-N
// across all cohorts in the window, so `count/outof` is the day-N retention
// rate. `se`/`re` are the start/return events — we use Amplitude's "Any Active
// Event" (`_active`) for both: of the users active on their first day, what %
// were active again N days later.
// ---------------------------------------------------------------------------

/** Dashboard REST `/retention` (rm=nday) response shape. */
interface RetentionResponse {
  data?: {
    series?: Array<{
      combined?: Array<{ count: number; outof: number; incomplete?: boolean }>;
    }>;
  };
}

/** One point on the retention curve: a day-N bucket and its retention %. */
export interface RetentionPoint {
  label: string;
  rate: number;
}

/** An N-day retention curve plus the peak rate, or `null` on soft error. */
export interface RetentionResult {
  peakPct: number;
  series: RetentionPoint[];
}

/**
 * N-day retention curve for the org over the window. The bucket interval scales
 * with the tab's granularity — daily (1d, `D`-labels), weekly (7d, `W`), monthly
 * (30d, `M`). Trailing buckets with no cohort base (`outof === 0`) are trimmed:
 * those are future days with no data, not genuine 0% retention. Returns `null`
 * on soft error / unconfigured.
 */
export function getRetentionCurve(
  org: string | null | undefined,
  window: AnalyticsWindow,
  granularity: "daily" | "weekly" | "monthly",
  schoolId?: string | null,
): Promise<RetentionResult | null> {
  const interval = granularity === "monthly" ? 30 : granularity === "weekly" ? 7 : 1;
  const prefix = interval === 30 ? "M" : interval === 7 ? "W" : "D";
  // The chart is small — cap the cohort buckets shown per granularity
  // (daily 7, weekly 4, monthly 5). Applied after the trailing-empty trim below.
  const cap = interval === 30 ? 5 : interval === 7 ? 4 : 7;
  const key = `tab-retention:${org ?? "all"}:${schoolId ?? "all"}:${granularity}:${window.start}-${window.end}`;
  return cached(key, async () => {
    if (!isAmplitudeConfigured()) return null;
    const resp = await amplitudeGet<RetentionResponse>(
      "retention",
      {
        se: JSON.stringify({ event_type: "_active" }),
        re: JSON.stringify({ event_type: "_active" }),
        start: window.start,
        end: window.end,
        rm: "nday",
        i: String(interval),
      },
      [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
    );
    if (!resp.ok) return null;

    const combined = resp.data.data?.series?.[0]?.combined ?? [];
    let lastWithData = -1;
    combined.forEach((c, n) => {
      if ((c?.outof ?? 0) > 0) lastWithData = n;
    });

    // Emit at most `cap` buckets (past the trailing-empty trim), 1-indexed so the
    // first cohort reads `W1`/`M1`/`D1`. `peak` is over the capped set only.
    const series: RetentionPoint[] = [];
    let peak = 0;
    for (let n = 0; n <= lastWithData && n < cap; n++) {
      const cell = combined[n];
      const outof = cell?.outof ?? 0;
      const rate = outof > 0 ? Math.round((100 * (cell?.count ?? 0)) / outof) : 0;
      peak = Math.max(peak, rate);
      series.push({ label: `${prefix}${n + 1}`, rate });
    }
    return { peakPct: peak, series };
  });
}

// ===========================================================================
// Per-school stat cards (school-detail page — /district/school/:schoolId)
//
// The district-home KPIs scope by org via the `s` param (`gp:organization`);
// per-school scoping instead filters the event stream by the `schools` EVENT
// property — the array of school `_id`s `analytics.ts` stamps on every event
// (`analytics.ts:37-89`) — via an `e.filters` clause, mirroring the proven
// per-teacher `userId` filter in `stats.server.ts` (`userEventFilter`). There is
// no `s` segment: the school scope lives entirely in `e.filters`.
//
// Window: callers pass `dailyWindow(365)`. The prototype metric is "all-time";
// the Dashboard REST daily API needs a bounded window, so a trailing 365-day
// window is the pragmatic all-time stand-in (the same choice as
// `stats.server.ts`). No `group_by` here (collapsed / `totals`), so no
// `limit:"1000"` top-N cap is needed.
//
// SCOPE CAVEAT — array-`is` (verify against live Amplitude): `schools` is an
// *array* event property. These fns rely on Amplitude's `is` operator matching
// events whose `schools` array contains `schoolId` (narrowing to ONE school),
// NOT matching the whole array / all schools. The orchestrator's Global QA must
// confirm this: a school's Total Plays must be ≤ the district-wide total, and
// two different schools in the same district must return different numbers. If
// the numbers are identical across schools or equal the district total, array-
// `is` is NOT narrowing — fall back to the `gp:school` SEGMENT clause instead
// (`{ prop: "gp:school", op: "is", values: [schoolId] }` via the `s` param;
// `school` is a group key, see `analytics.ts:84`) and re-verify.
// ===========================================================================

/**
 * The event-property filter that scopes an `events/segmentation` query to a
 * single school: `schools is [<schoolId>]`. `schools` is the array-of-school-ids
 * event property stamped on every event by the enrichment plugin
 * (`analytics.ts:37-59`). Mirrors `userEventFilter` in `stats.server.ts`.
 */
export function schoolEventFilter(schoolId: string): EventPropFilter[] {
  return [
    {
      subprop_type: "event",
      subprop_key: "schools",
      subprop_op: "is",
      subprop_value: [schoolId],
    },
  ];
}

/**
 * Total Plays for one school over the window: the count of `practice_completed`
 * events whose `schools` event property includes `schoolId`.
 * `events/segmentation`, `m = "totals"`, reduced via `total(firstSeries(resp))`
 * — the summed daily completion count for the window.
 *
 * Mapping note: the prototype's "Total Plays" = count of practice COMPLETIONS →
 * `practice_completed`. If product instead wants "plays STARTED", switch the
 * event to `content_played` (call this out in the PR).
 *
 * Cached per (metric + school + window), run through the shared `amplitudeGet`
 * concurrency gate, soft-empty → `null` (unconfigured / soft-fail) so the card
 * shows "—" rather than a misleading 0.
 */
export async function getSchoolTotalPlays(
  schoolId: string,
  window: { start: string; end: string },
): Promise<number | null> {
  if (!isAmplitudeConfigured()) return null;
  const key = `school-total-plays:${schoolId}:${window.start}-${window.end}`;
  return cached(key, async () => {
    const e = {
      event_type: "practice_completed",
      filters: schoolEventFilter(schoolId),
    };
    const resp = await amplitudeGet<DashboardChartResponse>(
      "events/segmentation",
      {
        e: JSON.stringify(e),
        start: window.start,
        end: window.end,
        m: "totals",
      },
      [],
    );
    if (!resp.ok) return null;
    return total(firstSeries(resp.data));
  });
}

/**
 * Educators Active at one school over the window: distinct `userType = teacher`
 * users who fired any event (`_active`) whose `schools` includes `schoolId`.
 * `events/segmentation`, `m = "uniques"`, read the period-COLLAPSED distinct
 * count via `collapsedValue(resp)` (mirrors `getActiveTeacherTotal` plus the
 * school filter) — the correct total, unlike summing the daily-uniques series
 * which counts a teacher once per active day.
 *
 * Cached per (metric + school + window), run through the shared `amplitudeGet`
 * concurrency gate, soft-empty → `null` (unconfigured / soft-fail) → card "—".
 */
export async function getSchoolActiveEducators(
  schoolId: string,
  window: { start: string; end: string },
): Promise<number | null> {
  if (!isAmplitudeConfigured()) return null;
  const key = `school-active-educators:${schoolId}:${window.start}-${window.end}`;
  return cached(key, async () => {
    const filters: EventPropFilter[] = [
      ...schoolEventFilter(schoolId),
      {
        subprop_type: "event",
        subprop_key: "userType",
        subprop_op: "is",
        subprop_value: ["teacher"],
      },
    ];
    const e = { event_type: "_active", filters };
    const resp = await amplitudeGet<DashboardChartResponse>(
      "events/segmentation",
      {
        e: JSON.stringify(e),
        start: window.start,
        end: window.end,
        m: "uniques",
      },
      [],
    );
    if (!resp.ok) return null;
    return collapsedValue(resp.data);
  });
}

// ===========================================================================
// District-home cluster helpers (School Registration + Practice Sessions)
//
// The home's "School Registration" and "Practice Sessions" cards each need a
// single window figure. These two wrappers reuse the existing private fetchers
// and collapse to one number, returning `null` on soft error / unconfigured so
// the cards can tell "no data source" (→ empty shape) apart from "real source,
// zero activity" (→ honest `0`). Cached per (metric + org + school + window)
// like the other window helpers.
// ===========================================================================

/**
 * Peak distinct **active schools** over the window for the org — the home's
 * "School Registration" registered count (schools with ≥1 user firing any event
 * this period). Reuses {@link fetchActiveSchoolsPerDay}'s per-day distinct-
 * active-school series and collapses it with `Math.max`.
 *
 * NOTE — `Math.max(...series)` (the peak single-day distinct-active-school
 * count) is a documented APPROXIMATION of "distinct schools active at least
 * once this period". A true period-collapsed distinct-group count isn't
 * available from the Dashboard REST response here (`collapsedValue` collapses
 * distinct USERS, not distinct group-by values), so the busiest day is the
 * closest single figure; it undercounts when different schools are active on
 * different days.
 *
 * An empty series (`[]` = soft error / unconfigured) ⇒ `null`; a real
 * zero-activity window returns per-day zeros ⇒ `0`.
 */
export async function getActiveSchoolsCount(
  org: string | null | undefined,
  window: AnalyticsWindow,
  schoolId?: string | null,
): Promise<number | null> {
  if (!isAmplitudeConfigured()) return null;
  const key = `home-active-schools:${org ?? "all"}:${schoolId ?? "all"}:${window.start}-${window.end}`;
  return cached(key, async () => {
    const series = await fetchActiveSchoolsPerDay(window, [
      ...orgSegmentFilter(org),
      ...schoolSegmentFilter(schoolId),
    ]);
    if (series.length === 0) return null;
    return Math.max(...series);
  });
}

/**
 * Total **content plays** (`content_played` event count) over the window for the
 * org — the home's "Practice Sessions" figure. Mirrors {@link getSessionCountSeries}
 * but collapses to a single window total (`metric: "totals"` via
 * {@link fetchSegmentationCollapsed}) instead of returning the daily series.
 * `null` on soft error / unconfigured.
 */
export function getContentPlayedTotal(
  org: string | null | undefined,
  window: AnalyticsWindow,
  schoolId?: string | null,
): Promise<number | null> {
  const key = `home-plays-total:${org ?? "all"}:${schoolId ?? "all"}:${window.start}-${window.end}`;
  return cached(key, () =>
    fetchSegmentationCollapsed({
      eventType: "content_played",
      window,
      metric: "totals",
      segment: [...orgSegmentFilter(org), ...schoolSegmentFilter(schoolId)],
    }),
  );
}
