import { createCookie } from "react-router";

/**
 * Signed, short-lived CSRF cookie for the redirect-OAuth SSO flows
 * (Clever + ClassLink). The `state` value is generated on the provider
 * "start" route, stored here, and re-checked on the callback to defend
 * against forged callbacks / CSRF.
 *
 * Signing reuses `SESSION_SECRET` (the same secret backing the session
 * cookie in `session.server.ts`) so the value can't be forged. 10-minute
 * TTL — long enough for a real authorize round-trip, short enough to limit
 * replay.
 */
const ssoStateCookie = createCookie("sso_state", {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 600,
  secrets: [process.env.SESSION_SECRET!],
});

/**
 * Mint a fresh CSRF `state` using Web Crypto (cryptographically random UUID,
 * never a predictable timestamp- or PRNG-derived value) and the matching
 * signed `Set-Cookie` to stash it for the callback.
 */
export async function createState(): Promise<{
  state: string;
  setCookie: string;
}> {
  const state = crypto.randomUUID();
  return { state, setCookie: await ssoStateCookie.serialize(state) };
}

/**
 * Strict-equality check of the callback's `state` query param against the
 * value signed into the `sso_state` cookie. False if either is missing.
 */
export async function verifyState(
  request: Request,
  stateParam: string | null,
): Promise<boolean> {
  const stored = (await ssoStateCookie.parse(
    request.headers.get("Cookie"),
  )) as string | null;
  return Boolean(stateParam) && stored === stateParam;
}

/**
 * Expire the `sso_state` cookie. Emitted on both success and failure
 * callbacks so the one-time `state` can't be reused.
 */
export async function clearStateCookie(): Promise<string> {
  return ssoStateCookie.serialize("", { maxAge: 0 });
}
