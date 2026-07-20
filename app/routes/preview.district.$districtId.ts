import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { gqlClient } from "~/lib/graphql";
import { serializePreviewCookie } from "~/lib/district-preview.server";
import { safe } from "~/lib/safe-loader";
import {
  isInvalidSessionError,
  logoutRedirect,
  requireSessionToken,
} from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { UsersFindOneDocument } from "~/queries/users";

/**
 * `/preview/district/:districtId` — enter route (no component, always
 * redirects). Sets the signed `preview_district` cookie **only** when the
 * caller is a confirmed master admin, then hands off to `/district/home`; the
 * ongoing scope lives in the cookie (Phase 2 resolvers honor it).
 *
 * Fail-soft: never grant a preview when the role can't be confirmed. On a
 * user-lookup failure, an invalid-session signature forces re-login; any other
 * failure falls back to the admin district list without setting a cookie.
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const districtId = params.districtId;
  if (!districtId) {
    return redirect("/admin/districts");
  }

  const result = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );

  // Lookup soft-failed — do NOT set the cookie. A dead session forces
  // re-login; anything else falls back safely to the admin list.
  if (!result.ok) {
    if (isInvalidSessionError(result.error)) {
      await logoutRedirect(request);
    }
    return redirect("/admin/districts");
  }

  // Only master admins may preview a district's portal.
  const identifier = result.data.UsersFindOne?.typeObj?.identifier;
  if (identifier !== "admin") {
    return redirect(homePathForIdentifier(identifier));
  }

  return redirect("/district/home", {
    headers: { "Set-Cookie": await serializePreviewCookie(districtId) },
  });
}
