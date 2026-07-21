/**
 * Blueprint's `Date` scalar serializes to an epoch-ms string on output; on
 * input it accepts an ISO 8601 string. These helpers bridge that scalar to the
 * browser's native `<input type="date">` (which speaks `YYYY-MM-DD`) and to a
 * compact "Mon YYYY" display, treating the value as a timezone-agnostic
 * calendar date (UTC getters) so the day never drifts across viewer timezones.
 */

/**
 * Coerce a Blueprint `Date` value (epoch-ms string | ISO string | number) to a
 * `Date`, or `null` when missing/invalid. Mirrors the coercion in
 * `relative-time.ts` (epoch-ms may arrive as a numeric string).
 */
export function coerceDate(
  value: string | number | null | undefined,
): Date | null {
  if (value == null || value === "") return null;
  const input =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "Jun 2027" (UTC). Empty string when the value is missing/invalid. */
export function formatMonthYear(
  value: string | number | null | undefined,
): string {
  const d = coerceDate(value);
  return d ? MONTH_YEAR.format(d) : "";
}

/**
 * `YYYY-MM-DD` for an `<input type="date">` default value (UTC). Empty string
 * when the value is missing/invalid.
 */
export function toDateInputValue(
  value: string | number | null | undefined,
): string {
  const d = coerceDate(value);
  if (!d) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Convert an `<input type="date">` `YYYY-MM-DD` value into an ISO string for the
 * `Date` scalar, or `null` when empty/invalid (used to clear the field).
 */
export function fromDateInputValue(ymd: string): string | null {
  if (!ymd) return null;
  const d = new Date(`${ymd}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
