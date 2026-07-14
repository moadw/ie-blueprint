/**
 * Teacher-flow language preference (English / Spanish), persisted PER CLASSROOM
 * (per group) in a single cookie so the SERVER (route loaders) can localize on
 * first paint — no English-first flash. The cookie value is a URL-encoded JSON
 * map keyed by `groupId` (`{ "<groupId>": "en" | "es", … }`); a classroom with
 * no entry resolves to English. Mirrors the onboarding-welcome pattern
 * (`app/lib/onboarding-welcome.ts`): a plain, client-writable cookie
 * (`path=/; max-age=~1yr; SameSite=Lax`), read via a hand-rolled `split(";")`
 * parse and written client-side behind a `typeof document` guard.
 *
 * The value is non-sensitive ("this browser prefers en/es per classroom"), so
 * no signing / session storage is needed. English is the default for every
 * classroom; any missing/garbage cookie (including the legacy scalar
 * `ie-lang=es`) resolves to English.
 */

export type Lang = "en" | "es";

/** English is the default for all users. */
export const DEFAULT_LANG: Lang = "en";

export const LANGUAGE_COOKIE = "ie-lang";

// ~1 year — a durable preference, effectively permanent.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Extract the raw `ie-lang` cookie value from a cookie string (a request
 * `Cookie` header or `document.cookie` — both use the same `name=value; …`
 * format). Returns the still-URL-encoded value, or `undefined` when absent.
 */
function readCookieValue(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  for (const pair of cookieHeader.split(";")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    if (pair.slice(0, eq).trim() === LANGUAGE_COOKIE) {
      return pair.slice(eq + 1).trim();
    }
  }
  return undefined;
}

/**
 * Parse the raw cookie value into a per-group language map. Decodes then
 * JSON-parses, keeping only `"en"`/`"es"` entries. Any failure — the legacy
 * scalar (`ie-lang=es`), malformed JSON, or a non-object — yields `{}`, so
 * every classroom defaults to English.
 */
function parseMap(raw: string | undefined): Record<string, Lang> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const out: Record<string, Lang> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === "en" || value === "es") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Server-side: read a classroom's active language from the request `Cookie`
 * header. Returns `DEFAULT_LANG` (English) when `groupId` is
 * missing/undefined, when the group has no stored entry, or when the cookie is
 * absent/garbage/legacy-scalar. The optional `groupId` lets non-group callers
 * (e.g. the root loader) compile while resolving to English.
 */
export function readLanguage(
  cookieHeader: string | null,
  groupId?: string,
): Lang {
  if (!groupId) return DEFAULT_LANG;
  // `noUncheckedIndexedAccess`: `map[groupId]` is `Lang | undefined`, so the
  // `?? DEFAULT_LANG` coalesce is required.
  return parseMap(readCookieValue(cookieHeader))[groupId] ?? DEFAULT_LANG;
}

/**
 * Client-side: persist a classroom's language so the server localizes it on
 * the next loader run. Read-modify-writes the group-keyed map so other
 * classrooms' entries are preserved. No-op during SSR.
 */
export function setLanguage(groupId: string, lang: Lang): void {
  if (typeof document === "undefined") return;
  const map = parseMap(readCookieValue(document.cookie));
  map[groupId] = lang;
  document.cookie = `${LANGUAGE_COOKIE}=${encodeURIComponent(
    JSON.stringify(map),
  )}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

/** A localizable record's title/description fields (top-level or a locale sub-object). */
type LocalizedFields = {
  title?: string | null | undefined;
  description?: string | null | undefined;
};

/**
 * Resolve a single field: prefer the Spanish value when Spanish is active AND
 * it is a non-empty string; otherwise fall back to the top-level (English)
 * value. Returns `V | string` so a non-nullable `top` (e.g. `title: string`)
 * simplifies back to `string` at the call site — no cast needed.
 */
function pickField<V>(
  top: V,
  spanish: string | null | undefined,
  useSpanish: boolean,
): V | string {
  if (useSpanish && typeof spanish === "string" && spanish.length > 0) {
    return spanish;
  }
  return top;
}

/**
 * Pick localized `title`/`description` with PER-FIELD English fallback. Given a
 * top-level record (`{ title, description }`) and a nested locale sub-object
 * (`language.spanish`, `{ title?, description? }`), return the Spanish value for
 * each field when `lang === "es"` and that Spanish field is a non-empty string,
 * else the top-level/English value. Title and description resolve independently.
 * Works for both curriculum and class since both expose `{ title, description }`.
 */
export function pickLocalized<T extends LocalizedFields>(
  top: T,
  locale: LocalizedFields | null | undefined,
  lang: Lang,
): { title: T["title"] | string; description: T["description"] | string } {
  const useSpanish = lang === "es";
  return {
    title: pickField(top.title, locale?.title, useSpanish),
    description: pickField(top.description, locale?.description, useSpanish),
  };
}

/**
 * Tap-language filter predicate: hide ONLY the opposite language. Taps whose
 * `language` matches, is unset (`null`/`""`), or is an unknown value are kept.
 *   - `en` active → drop only `"es"`
 *   - `es` active → drop only `"en"`
 */
export function keepTapForLang(
  tapLanguage: string | null | undefined,
  lang: Lang,
): boolean {
  return lang === "en" ? tapLanguage !== "es" : tapLanguage !== "en";
}
