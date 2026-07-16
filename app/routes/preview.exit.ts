import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { clearPreviewCookie } from "~/lib/district-preview.server";

/**
 * `/preview/exit` — exit route (no component, always redirects). Clears the
 * `preview_district` cookie and returns to the admin district list. No auth
 * gate needed: clearing a cookie and landing on `/admin/districts` is safe,
 * and `/admin` re-gates the role.
 */
export async function loader({ request: _request }: LoaderFunctionArgs) {
  return redirect("/admin/districts", {
    headers: { "Set-Cookie": await clearPreviewCookie() },
  });
}
