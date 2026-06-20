import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { env } from "~/lib/env";
import { createState } from "~/lib/sso-state.server";

/**
 * `/auth/clever/start` — resource route (no component).
 *
 * Mints a signed CSRF `state`, sets the `sso_state` cookie, and redirects the
 * browser to Clever's authorize endpoint. If the provider isn't configured
 * (missing `APP_URL` or client id), degrade to a clean login error instead of
 * sending a half-formed authorize URL.
 */
export async function loader({ request: _request }: LoaderFunctionArgs) {
  if (!env.APP_URL || !env.CLEVER_CLIENT_ID) {
    return redirect("/login?sso=clever&error=not-configured");
  }

  const { state, setCookie } = await createState();
  const redirectUri = encodeURIComponent(`${env.APP_URL}/signup-clever`);
  const authorizeUrl = `https://clever.com/oauth/authorize?response_type=code&client_id=${env.CLEVER_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;

  return redirect(authorizeUrl, { headers: { "Set-Cookie": setCookie } });
}
