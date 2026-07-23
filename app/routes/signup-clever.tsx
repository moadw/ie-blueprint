import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { establishSessionFromToken, SsoAuthError } from "~/lib/auth.server";
import { env } from "~/lib/env";
import { clearStateCookie, verifyState } from "~/lib/sso-state.server";

const LOG = "[signup-clever]";

/**
 * Mask a bearer/session token for logs: keep enough to correlate across
 * requests without dumping a usable credential into server logs.
 */
function maskToken(token: string | undefined | null): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `<len:${token.length}>`;
  return `${token.slice(0, 6)}…${token.slice(-4)} (len:${token.length})`;
}

/**
 * `/signup-clever` — Clever's registered `redirect_uri` (callback).
 *
 * Verifies the CSRF `state`, exchanges the authorization `code` + `platform`
 * at the Blueprint endpoint for a session token, then establishes the session
 * via the shared helper. The `sso_state` cookie is cleared on every exit
 * (success and failure) so the one-time state can't be replayed.
 *
 * Heavily instrumented (`[signup-clever]` prefix) while we debug the
 * `error=not-allowed` bounce back to /login with the backend team. Every
 * branch logs so we can pinpoint exactly which step fails and why. Grep the
 * server logs for `[signup-clever]` to reconstruct a single attempt.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const scope = url.searchParams.get("scope");

  console.log(`${LOG} callback received`, {
    hasCode: Boolean(code),
    code: code ?? null,
    hasState: Boolean(state),
    state: state ?? null,
    scope: scope ?? null,
    platform: env.PLATFORM,
    restUrl: env.REST_URL,
    fullQuery: url.search,
  });

  if (!code) {
    console.warn(`${LOG} → redirect error=missing-code (no code param)`);
    return redirect("/login?sso=clever&error=missing-code");
  }

  const stateOk = await verifyState(request, state);
  console.log(`${LOG} state verification`, {
    stateParam: state ?? null,
    hasStateCookie: Boolean(request.headers.get("Cookie")?.includes("sso_state")),
    verified: stateOk,
  });
  if (!stateOk) {
    console.warn(
      `${LOG} → redirect error=bad-state (state param did not match signed sso_state cookie — cookie missing/expired or Clever dropped the state)`,
    );
    return redirect("/login?sso=clever&error=bad-state", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  const endpoint = `${env.REST_URL}/webapi/signup-clever`;
  console.log(`${LOG} POST ${endpoint}`, {
    platform: env.PLATFORM,
    code,
  });

  let resp: Response;
  try {
    resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, platform: env.PLATFORM }),
    });
  } catch (err) {
    console.error(`${LOG} → backend fetch threw (network/DNS)`, err);
    return redirect("/login?sso=clever&error=auth-failed", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  // Read the body once as text so we can log the raw backend payload (exactly
  // what the backend team needs) and still parse it below.
  const rawBody = await resp.text();
  console.log(`${LOG} backend responded`, {
    status: resp.status,
    statusText: resp.statusText,
    ok: resp.ok,
    body: rawBody,
  });

  if (!resp.ok) {
    console.warn(
      `${LOG} → redirect error=auth-failed (backend /webapi/signup-clever returned ${resp.status})`,
    );
    return redirect("/login?sso=clever&error=auth-failed", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  let data: { token?: string } = {};
  try {
    data = rawBody ? (JSON.parse(rawBody) as { token?: string }) : {};
  } catch (err) {
    console.error(`${LOG} → backend body was not valid JSON`, err);
    return redirect("/login?sso=clever&error=no-token", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  const token = data.token;
  console.log(`${LOG} token extracted`, { hasToken: Boolean(token), token: maskToken(token) });
  if (!token) {
    console.warn(`${LOG} → redirect error=no-token (backend ok but no token in body)`);
    return redirect("/login?sso=clever&error=no-token", {
      headers: { "Set-Cookie": await clearStateCookie() },
    });
  }

  try {
    const res = await establishSessionFromToken(request, token);
    res.headers.append("Set-Cookie", await clearStateCookie());
    console.log(`${LOG} ✓ session established, redirecting to`, res.headers.get("Location"));
    return res;
  } catch (err) {
    if (err instanceof SsoAuthError) {
      console.warn(
        `${LOG} → redirect error=${err.code} (session gate failed — see [sso] log above for platform/lookup detail)`,
      );
      return redirect(`/login?sso=clever&error=${err.code}`, {
        headers: { "Set-Cookie": await clearStateCookie() },
      });
    }
    console.error(`${LOG} → unexpected error from establishSessionFromToken`, err);
    throw err;
  }
}
