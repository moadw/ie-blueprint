/**
 * Teacher-flow language preference (English / Spanish), persisted in a GLOBAL
 * cookie so the SERVER (route loaders) can localize on first paint — no
 * English-first flash. Mirrors the onboarding-welcome pattern
 * (`app/lib/onboarding-welcome.ts`): a plain, client-writable, non-id-keyed
 * cookie (`path=/; max-age=~1yr; SameSite=Lax`), read via a hand-rolled
 * `split(";")` parse and written client-side behind a `typeof document` guard.
 *
 * The value is non-sensitive ("this browser prefers en/es"), so no signing /
 * session storage is needed. English is the default for every user; any
 * missing/garbage cookie resolves to English.
 */

export type Lang = "en" | "es";

/** English is the default for all users. */
export const DEFAULT_LANG: Lang = "en";

export const LANGUAGE_COOKIE = "ie-lang";

// ~1 year — a durable preference, effectively permanent.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Server-side: read the active language from the request `Cookie` header.
 * Returns `"es"` only when the `ie-lang` cookie is exactly `"es"`; a
 * null/empty header, a missing cookie, or any other value falls back to
 * `DEFAULT_LANG` (English).
 */
export function readLanguage(cookieHeader: string | null): Lang {
  if (!cookieHeader) return DEFAULT_LANG;
  for (const pair of cookieHeader.split(";")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    if (pair.slice(0, eq).trim() === LANGUAGE_COOKIE) {
      return pair.slice(eq + 1).trim() === "es" ? "es" : DEFAULT_LANG;
    }
  }
  return DEFAULT_LANG;
}

/**
 * Client-side: persist the language preference so the server localizes on the
 * next loader run. No-op during SSR.
 */
export function setLanguage(lang: Lang): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
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
