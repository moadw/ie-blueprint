/**
 * Per-announcement dismissal, persisted in a cookie so the SERVER can decide
 * whether to render the green bar before first paint. This replaces the old
 * `localStorage`-in-`useEffect` approach, which rendered a dismissed bar on the
 * server (no `localStorage` there), then hid it after mount — a one-frame flash
 * on every reload. Cookies travel with the request, so the loader knows the
 * dismissal state at render time and simply omits the announcement.
 *
 * The value is non-sensitive ("this browser closed banner X"), so a plain,
 * client-writable cookie is appropriate — no signing / session storage needed.
 */

const COOKIE_PREFIX = "dismissed-announcement-";
// ~1 year — matches the effectively-permanent `localStorage` behaviour it replaces.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function announcementDismissalCookieName(id: string): string {
  return `${COOKIE_PREFIX}${id}`;
}

/**
 * Server-side: has this browser dismissed announcement `id`? Parses the request
 * `Cookie` header. A null/empty header (or missing cookie) means not dismissed.
 */
export function isAnnouncementDismissed(
  cookieHeader: string | null,
  id: string,
): boolean {
  if (!cookieHeader) return false;
  const name = announcementDismissalCookieName(id);
  return cookieHeader.split(";").some((pair) => {
    const eq = pair.indexOf("=");
    if (eq === -1) return false;
    return (
      pair.slice(0, eq).trim() === name && pair.slice(eq + 1).trim() === "1"
    );
  });
}

/**
 * Client-side: persist dismissal of announcement `id` so the server won't
 * render the bar on the next load. No-op during SSR.
 */
export function dismissAnnouncement(id: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${announcementDismissalCookieName(id)}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}
