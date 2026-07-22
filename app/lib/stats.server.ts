/**
 * Server-side per-teacher stats read-back from Amplitude.
 *
 * SERVER ONLY (`.server.ts`): reuses the Dashboard REST infra in
 * `amplitude.server.ts` (Basic auth, concurrency gate, 429 backoff, 10-min
 * in-memory cache, soft-fail-to-empty). Where the district metrics scope a
 * query to an organization via the `s` param (`gp:organization`), this module
 * scopes to a single teacher via `e.filters` on the `userId` **event property**
 * — the id `analytics.ts` now stamps on every event (step-1), because the
 * Dashboard Segmentation `s` param cannot filter by Amplitude `user_id`.
 *
 * Every call soft-fails to an empty result (never throws) so the
 * `/settings/stats` loader renders a soft/empty state instead of white-screening
 * (CLAUDE.md "Resilient loaders"). This module returns the raw materials the
 * page derives its numbers from; the tz-sensitive streak / weekly / routine math
 * is derived client-side (step-3) from `activeDates`, and `totalPractices` is a
 * Blueprint count computed in the loader (step-3) — neither lives here.
 *
 * **Cache growth (watch item):** the shared `cached()` module `Map` evicts only
 * lazily on read (stale check), so per-user keys accumulate in process memory
 * with no LRU. Acceptable at current scale (personal page, 10-min TTL); noted,
 * not bounded now.
 */
import {
  allSeries,
  amplitudeGet,
  cached,
  firstSeries,
  type DashboardChartResponse,
  type EventPropFilter,
} from "~/lib/amplitude.server";

// ---------------------------------------------------------------------------
// Per-user scope + shared query helper
// ---------------------------------------------------------------------------

/** A trailing daily window as Dashboard REST `YYYYMMDD` start/end. */
interface Window {
  start: string;
  end: string;
}

/**
 * The event-property filter that scopes an `events/segmentation` query to a
 * single teacher: `userId is [<blueprintId>]`. `userId` is the Blueprint `_id`
 * (same value as Amplitude `user_id`) stamped on every event by the enrichment
 * plugin (step-1). Mirrors the `userType=teacher` filter shape the district tab
 * uses — the exact, proven `e.filters` mechanism.
 */
export function userEventFilter(userId: string): EventPropFilter[] {
  return [
    {
      subprop_type: "event",
      subprop_key: "userId",
      subprop_op: "is",
      subprop_value: [userId],
    },
  ];
}

/**
 * Run a user-scoped `events/segmentation` query. Builds the event definition
 * JSON (`event_type` + optional `group_by` + the `userId` `filters`) and passes
 * `m` / `start` / `end` (+ any `extraParams`, e.g. the `limit` group-by cap)
 * through `amplitudeGet`'s `params`. No `s` segment — the teacher scope lives
 * entirely in `e.filters`. Returns the parsed chart response, or `null` on soft
 * error / unconfigured so the caller can distinguish "no data source" from
 * "real source, zero activity".
 */
async function userSegmentation(
  userId: string,
  window: Window,
  event: { event_type: string; group_by?: Array<{ type: "event"; value: string }> },
  metric: "totals" | "sums",
  extraParams: Record<string, string> = {},
): Promise<DashboardChartResponse | null> {
  const e = { ...event, filters: userEventFilter(userId) };
  const resp = await amplitudeGet<DashboardChartResponse>(
    "events/segmentation",
    {
      e: JSON.stringify(e),
      start: window.start,
      end: window.end,
      m: metric,
      ...extraParams,
    },
    [],
  );
  return resp.ok ? resp.data : null;
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

// ---------------------------------------------------------------------------
// Metric fetchers (internal) — return `null` on soft error so `cached` skips
// caching a transient failure; the public wrappers coalesce to 0 / [].
// ---------------------------------------------------------------------------

/**
 * Minutes practiced: `content_played` `m=sums` of the `seconds` event property,
 * scoped to the teacher. Per the contract we **sum the returned daily series**
 * (the proven district approach for `m=sums`) rather than relying on
 * `collapsedValue`, then convert seconds → minutes (rounded).
 */
async function fetchMinutesPracticed(
  userId: string,
  window: Window,
): Promise<number | null> {
  const data = await userSegmentation(
    userId,
    window,
    { event_type: "content_played", group_by: [{ type: "event", value: "seconds" }] },
    "sums",
  );
  if (!data) return null;
  const seconds = sum(firstSeries(data));
  return Math.round(seconds / 60);
}

/**
 * Practices completed: `practice_completed` `m=totals` grouped by `contentId`,
 * scoped to the teacher. Each returned group is a distinct class that had ≥1
 * completion, so the count of groups = distinct classes completed.
 *
 * **Group-by cap:** a grouped segmentation query returns only the top-N group
 * values (`limit` max 1000); without it the distinct-class count would be
 * silently truncated. So `limit: "1000"`.
 */
async function fetchPracticesCompleted(
  userId: string,
  window: Window,
): Promise<number | null> {
  const data = await userSegmentation(
    userId,
    window,
    {
      event_type: "practice_completed",
      group_by: [{ type: "event", value: "contentId" }],
    },
    "totals",
    { limit: "1000" },
  );
  if (!data) return null;
  return allSeries(data).length;
}

/** A `localDate` (`YYYY-MM-DD`) is a valid active-day label. */
const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Extract the group-value string from a `seriesLabels` entry. Grouped
 * segmentation may return the label as a bare string or nested in an array
 * (e.g. `["2026-07-15"]` or `[0, "2026-07-15"]`); take the last string part.
 * Returns `null` for a shape we don't recognize.
 */
function labelToString(label: unknown): string | null {
  if (typeof label === "string") return label;
  if (Array.isArray(label)) {
    for (let i = label.length - 1; i >= 0; i--) {
      const part = label[i];
      if (typeof part === "string") return part;
    }
  }
  return null;
}

/**
 * Active dates: `practice_completed` `m=totals` grouped by the `localDate` event
 * property, scoped to the teacher. Returns the `YYYY-MM-DD` labels whose group
 * total (sum across the window) is `> 0`, sorted ascending. These are the local
 * calendar days with ≥1 completion — the raw material step-3 derives streaks /
 * weekly-chain / routine from, using the browser's local "today".
 *
 * **Group-by cap:** up to 365 distinct `localDate`s → `limit: "1000"` so no day
 * is dropped by the default top-N truncation.
 */
async function fetchActiveDates(
  userId: string,
  window: Window,
): Promise<string[] | null> {
  const data = await userSegmentation(
    userId,
    window,
    {
      event_type: "practice_completed",
      group_by: [{ type: "event", value: "localDate" }],
    },
    "totals",
    { limit: "1000" },
  );
  if (!data) return null;

  const labels = data.data?.seriesLabels ?? [];
  const rows = allSeries(data);
  const dates: string[] = [];
  labels.forEach((rawLabel, i) => {
    const label = labelToString(rawLabel);
    if (!label || !YMD_RE.test(label)) return;
    const row = rows[i];
    if (row && sum(row) > 0) dates.push(label);
  });
  return dates.sort();
}

// ---------------------------------------------------------------------------
// Public metric functions (cached per-user, coalesce soft error → empty)
// ---------------------------------------------------------------------------

/** Minutes practiced over `window`, scoped to `userId`. `0` on soft error. */
export async function getMinutesPracticed(
  userId: string,
  window: Window,
): Promise<number> {
  const value = await cached(`stats:minutes:${userId}`, () =>
    fetchMinutesPracticed(userId, window),
  );
  return value ?? 0;
}

/** Distinct classes completed over `window`, scoped to `userId`. `0` on soft error. */
export async function getPracticesCompleted(
  userId: string,
  window: Window,
): Promise<number> {
  const value = await cached(`stats:completed:${userId}`, () =>
    fetchPracticesCompleted(userId, window),
  );
  return value ?? 0;
}

/** Sorted `YYYY-MM-DD` local days with ≥1 completion over `window`. `[]` on soft error. */
export async function getActiveDates(
  userId: string,
  window: Window,
): Promise<string[]> {
  const value = await cached(`stats:dates:${userId}`, () =>
    fetchActiveDates(userId, window),
  );
  return value ?? [];
}
