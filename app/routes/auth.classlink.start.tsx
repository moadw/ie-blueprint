import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { env } from "~/lib/env";
import { createState } from "~/lib/sso-state.server";

/**
 * `/auth/classlink/start` — resource route (no component).
 *
 * Mints a signed CSRF `state`, sets the `sso_state` cookie, and redirects the
 * browser to ClassLink's authorize endpoint. If the provider isn't configured
 * (missing `APP_URL` or client id), degrade to a clean login error.
 */
export async function loader({ request: _request }: LoaderFunctionArgs) {
  if (!env.APP_URL || !env.CLASSLINK_CLIENT_ID) {
    return redirect("/login?sso=classlink&error=not-configured");
  }

  const { state, setCookie } = await createState();
  const redirectUri = encodeURIComponent(`${env.APP_URL}/signup-classlink`);
  const authorizeUrl = `https://launchpad.classlink.com/oauth2/v2/auth?scope=profile&response_type=code&client_id=${env.CLASSLINK_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;

  return redirect(authorizeUrl, { headers: { "Set-Cookie": setCookie } });
}
