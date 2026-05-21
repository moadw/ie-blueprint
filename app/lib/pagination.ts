/**
 * Parse the `?page` query parameter from a Remix loader `Request` into a
 * 1-based positive integer.
 *
 * - NaN-safe: any non-numeric value falls back to 1.
 * - Clamps to >= 1 (negative or zero -> 1).
 * - Floors decimals (e.g. `?page=2.7` -> 2).
 *
 * Single source of truth shared by every paginated admin loader (steps
 * 3-7). Do not copy-paste a variant.
 */
export function readPageFromRequest(request: Request): number {
  const raw = new URL(request.url).searchParams.get("page") ?? "1";
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}
