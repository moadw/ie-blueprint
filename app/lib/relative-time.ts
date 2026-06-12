const UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
  { unit: "second", ms: 1000 },
];

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelativeTime(
  date: string | number | Date | null | undefined,
): string {
  if (date == null) return "—";
  // The backend may return epoch milliseconds as a string (see MTW's
  // Number() coercion); plain-digit strings are not parseable by new Date().
  const input =
    typeof date === "string" && /^\d+$/.test(date) ? Number(date) : date;
  const ts = new Date(input).getTime();
  if (Number.isNaN(ts)) return "—";

  const diff = ts - Date.now();
  const absDiff = Math.abs(diff);

  if (absDiff > THIRTY_DAYS_MS) {
    return new Date(input).toLocaleDateString();
  }

  for (const { unit, ms } of UNITS) {
    if (absDiff >= ms) {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }

  return rtf.format(0, "second");
}
