import { createCookie } from "react-router";

/**
 * Signed session cookie carrying the district `_id` a master admin is
 * previewing. Mirrors `sso-state.server.ts`: signed with `SESSION_SECRET` so
 * the id can't be forged, `httpOnly` so client JS can't read it.
 *
 * This is a **session cookie** (no `maxAge`) — it never lingers past the
 * browser session, and the `/preview/exit` route clears it explicitly. Only
 * honored by the district resolvers when the session user's role is master
 * `admin` (defense in depth — see Phase 2).
 */
const previewDistrictCookie = createCookie("preview_district", {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  secrets: [process.env.SESSION_SECRET!],
});

/** Signed `Set-Cookie` stashing the previewed district `_id`. */
export async function serializePreviewCookie(
  districtId: string,
): Promise<string> {
  return previewDistrictCookie.serialize(districtId);
}

/** The previewed district `_id` from the request, or `null` when absent. */
export async function readPreviewDistrictId(
  request: Request,
): Promise<string | null> {
  return (await previewDistrictCookie.parse(
    request.headers.get("Cookie"),
  )) as string | null;
}

/** Expire the preview cookie. Emitted by `/preview/exit`. */
export async function clearPreviewCookie(): Promise<string> {
  return previewDistrictCookie.serialize("", { maxAge: 0 });
}
