/**
 * One-time "seen the onboarding welcome slider" flag, persisted in a cookie so
 * the SERVER (the create action) can decide whether to route a fresh teacher
 * through /onboarding/welcome before the first classroom view. Mirrors the
 * announcement-dismissal pattern (client-writable, server-readable), but a
 * single GLOBAL flag rather than id-keyed — the welcome is shown once ever.
 *
 * The value is non-sensitive ("this browser has seen the welcome"), so a plain,
 * client-writable cookie is appropriate — no signing / session storage needed.
 */

const COOKIE_NAME = "onboarding-welcome-seen";
// ~1 year — the welcome is a once-ever intro; effectively permanent.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Server-side: has this browser already seen the onboarding welcome? Parses the
 * request `Cookie` header. A null/empty header (or missing cookie) means not
 * seen.
 */
export function hasSeenOnboardingWelcome(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.split(";").some((pair) => {
    const eq = pair.indexOf("=");
    if (eq === -1) return false;
    return (
      pair.slice(0, eq).trim() === COOKIE_NAME &&
      pair.slice(eq + 1).trim() === "1"
    );
  });
}

/**
 * Client-side: mark the onboarding welcome as seen so the server won't route
 * through it again. No-op during SSR.
 */
export function markOnboardingWelcomeSeen(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}
