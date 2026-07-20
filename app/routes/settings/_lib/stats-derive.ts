/**
 * Pure, tz-sensitive derivation of the day-based stats metrics from the set of
 * local calendar days on which the teacher completed ≥1 practice (`activeDates`,
 * `YYYY-MM-DD`, produced server-side by `stats.server.ts`).
 *
 * WHY CLIENT-SIDE + PURE: "today" and "this week" depend on the viewer's
 * timezone, so the SSR (UTC) server can't compute them without risking a
 * hydration mismatch. The route calls this after hydration with the browser's
 * local `new Date()`; keeping it a pure function (no I/O, no `Date.now()`
 * inside) makes the "today"/"windowStart" inputs explicit and testable.
 *
 * All calendar math is done on `YYYY-MM-DD` strings / a stable day-ordinal so it
 * is independent of the machine timezone EXCEPT where "today"/"this week" are
 * intentionally local (via the passed `today`).
 */

export interface DayMetrics {
  /** Consecutive active days ending today (or yesterday, grace for an in-progress day). */
  dayStreak: number;
  /** Longest consecutive active-day run anywhere in the window (tz-independent). */
  longestStreak: number;
  /** Mon=0 … Sun=6 completion flags for the week containing `today` (length 7). */
  completedDays: boolean[];
  /** Today's weekday index, Mon=0 … Sun=6 (the WeeklyChain "?" node). */
  currentDayIndex: number;
  /** Active days ÷ weeks elapsed since `windowStart`, clamped [0,5], rounded. */
  averageDaysPerWeek: number;
}

const MS_PER_DAY = 86_400_000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

/** Stable first-paint placeholder (no tz-sensitive values resolved yet). */
export const PLACEHOLDER_DAY_METRICS: DayMetrics = {
  dayStreak: 0,
  longestStreak: 0,
  completedDays: [false, false, false, false, false, false, false],
  // -1 never equals a real weekday index, so no "?" node lights up on SSR.
  currentDayIndex: -1,
  averageDaysPerWeek: 0,
};

/** Local `YYYY-MM-DD` for a Date (browser-local calendar day — NOT UTC). */
function localYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** A new Date `n` days offset from `d` (local). */
function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/**
 * A `YYYY-MM-DD` string → a stable integer day-ordinal (days since epoch), used
 * only to test consecutiveness. Uses `Date.UTC` so the ordinal is tz-independent
 * (we're comparing labels to labels, never to a local clock here).
 */
function ymdToOrdinal(ymd: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const [, y, mo, d] = m;
  const ms = Date.UTC(Number(y), Number(mo) - 1, Number(d));
  return Math.floor(ms / MS_PER_DAY);
}

/**
 * Resolve the `averageDaysPerWeek` divisor window start: the teacher's
 * `createdAt` when it falls inside the trailing 365-day segmentation window,
 * else the window start (`today − 365d`). Clamping to the window start prevents a
 * brand-new teacher from being divided by ~52 weeks. `null`/invalid `createdAt`
 * → window start.
 */
export function resolveWindowStart(
  createdAt: string | null,
  today: Date,
): Date {
  const windowStart = addDays(today, -365);
  if (!createdAt) return windowStart;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return windowStart;
  return created.getTime() > windowStart.getTime() ? created : windowStart;
}

/**
 * Derive the day-based metrics from `activeDates` relative to a local `today`
 * and the `averageDaysPerWeek` divisor `windowStart` (both passed explicitly so
 * the function stays pure).
 *
 * - `dayStreak`: walk backward from `today` (one-day grace: if `today` isn't in
 *   the set yet, start at `today − 1` so an in-progress day doesn't zero the
 *   streak); count consecutive days present in the set.
 * - `longestStreak`: longest run of consecutive day-ordinals in the set.
 * - `completedDays[Mon..Sun]` / `currentDayIndex`: membership for each weekday of
 *   the week containing `today` (Monday-anchored).
 * - `averageDaysPerWeek`: `activeDates.length / weeksElapsed`, where
 *   `weeksElapsed = max(1, (today − windowStart) / 7 days)`, clamped [0,5] and
 *   rounded.
 */
export function deriveDayMetrics(
  activeDates: string[],
  today: Date,
  windowStart: Date,
): DayMetrics {
  const set = new Set(activeDates);

  // --- dayStreak (current run ending today / yesterday) ---
  let dayStreak = 0;
  let cursor = new Date(today);
  if (!set.has(localYmd(cursor))) {
    // today not active yet — grace: try yesterday, else the streak is broken.
    cursor = addDays(cursor, -1);
  }
  while (set.has(localYmd(cursor))) {
    dayStreak++;
    cursor = addDays(cursor, -1);
  }

  // --- longestStreak (longest consecutive run of active-day ordinals) ---
  const ordinals = [
    ...new Set(
      activeDates
        .map(ymdToOrdinal)
        .filter((n): n is number => n !== null),
    ),
  ].sort((a, b) => a - b);
  let longestStreak = 0;
  let run = 0;
  let prev = Number.NaN;
  for (const n of ordinals) {
    run = n === prev + 1 ? run + 1 : 1;
    if (run > longestStreak) longestStreak = run;
    prev = n;
  }

  // --- completedDays[Mon..Sun] + currentDayIndex (this week) ---
  // getDay(): 0=Sun … 6=Sat → Mon=0 … Sun=6.
  const currentDayIndex = (today.getDay() + 6) % 7;
  const monday = addDays(today, -currentDayIndex);
  const completedDays: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    completedDays.push(set.has(localYmd(addDays(monday, i))));
  }

  // --- averageDaysPerWeek (active days ÷ weeks elapsed since windowStart) ---
  // Divisor = actual weeks elapsed (min 1) so a new teacher isn't divided by the
  // full ~52-week window. Result clamped to the RoutineCard's [0,5] ring.
  const weeksElapsed = Math.max(
    1,
    (today.getTime() - windowStart.getTime()) / MS_PER_WEEK,
  );
  const averageDaysPerWeek = Math.max(
    0,
    Math.min(5, Math.round(activeDates.length / weeksElapsed)),
  );

  return {
    dayStreak,
    longestStreak,
    completedDays,
    currentDayIndex,
    averageDaysPerWeek,
  };
}
