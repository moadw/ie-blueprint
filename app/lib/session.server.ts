import { createCookieSessionStorage, redirect } from "react-router";
import type { Session } from "react-router";

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    secrets: [secret],
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  },
});

const TOKEN_KEY = "token";

/**
 * NOTE (milestone 2 — single-token deviation):
 * Blueprint's `POST /webapi/login` returns a single `{ token }` JWT (48h
 * lifetime), not separate access + refresh tokens. The documented
 * `POST /common/refreshtoken` endpoint is currently broken on the test
 * environment (HTTP 500: "this.database.models.blacklisttoken is not a
 * constructor"), so we cannot perform a real refresh round-trip yet.
 *
 * Until the backend is fixed, the session stores a single `token` and a
 * 401 from upstream is treated as "re-login required" by `/api/session`.
 * Follow-up: wire the real refresh once `/common/refreshtoken` works.
 */

export async function getSession(request: Request): Promise<Session> {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function commitSession(session: Session): Promise<string> {
  return sessionStorage.commitSession(session);
}

export async function destroySession(session: Session): Promise<string> {
  return sessionStorage.destroySession(session);
}

export async function getSessionToken(
  request: Request,
): Promise<string | null> {
  const session = await getSession(request);
  const token = session.get(TOKEN_KEY);
  return typeof token === "string" && token.length > 0 ? token : null;
}

export async function requireSessionToken(request: Request): Promise<string> {
  const token = await getSessionToken(request);
  if (!token) {
    throw redirect("/login");
  }
  return token;
}

/**
 * Blueprint's `blueprint-user` service has no clean 401 path: when an
 * `access-token` no longer resolves to a user (expired/invalid JWT), its
 * `checkAccess` guard throws `TypeError: Cannot read properties of undefined
 * (reading '_id')` and returns it as a GraphQL `INTERNAL_SERVER_ERROR`. We
 * treat that exact message — surfaced on a `UsersFindOne` session lookup — as
 * "the session is dead, force re-login".
 */
export const INVALID_SESSION_SIGNATURE =
  "Cannot read properties of undefined (reading '_id')";

/**
 * True when a thrown error — or a `safe()` error string — carries the
 * invalid-token signature above. Accepts the raw graphql-request `ClientError`
 * shape as well as the already-normalized message string.
 */
export function isInvalidSessionError(err: unknown): boolean {
  if (typeof err === "string") return err.includes(INVALID_SESSION_SIGNATURE);
  const gqlMessage = (
    err as {
      response?: {
        errors?: ReadonlyArray<{ message?: string | null }> | null;
      } | null;
    } | null
  )?.response?.errors?.[0]?.message;
  if (
    typeof gqlMessage === "string" &&
    gqlMessage.includes(INVALID_SESSION_SIGNATURE)
  ) {
    return true;
  }
  return err instanceof Error && err.message.includes(INVALID_SESSION_SIGNATURE);
}

/** Clear the session cookie and redirect to /login. Always throws. */
export async function logoutRedirect(request: Request): Promise<never> {
  const session = await getSession(request);
  throw redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export async function setSessionToken(
  session: Session,
  token: string,
): Promise<void> {
  session.set(TOKEN_KEY, token);
}
