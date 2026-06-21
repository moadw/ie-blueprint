import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { establishSessionFromToken, SsoAuthError } from "~/lib/auth.server";
import { env } from "~/lib/env";
import { clearStateCookie, verifyState } from "~/lib/sso-state.server";

/**
 * `/signup-classlink` — ClassLink's registered `redirect_uri` (callback).
 *
 * Verifies the CSRF `state`, exchanges the authorization `code` + `platform`
 * at the Blueprint endpoint for a session token, then establishes the session
 * via the shared helper. The `sso_state` cookie is cleared on every exit
 * (success and failure) so the one-time state can't be replayed.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return redirect("/login?sso=classlink&error=missing-code");
  }

  if (!(await verifyState(request, state))) {
    return redirect("/login?sso=classlink&error=bad-state", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  const resp = await fetch(`${env.REST_URL}/webapi/signup-classlink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, platform: env.PLATFORM }),
  });

  if (!resp.ok) {
    return redirect("/login?sso=classlink&error=auth-failed", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  const data = (await resp.json()) as { token?: string };
  const token = data.token;
  if (!token) {
    return redirect("/login?sso=classlink&error=no-token", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  try {
    const res = await establishSessionFromToken(request, token);
    res.headers.append("Set-Cookie", await clearStateCookie());
    return res;
  } catch (err) {
    if (err instanceof SsoAuthError) {
      return redirect(`/login?sso=classlink&error=${err.code}`, {
        headers: { "Set-Cookie": await clearStateCookie() },
      });
    }
    throw err;
  }
}
