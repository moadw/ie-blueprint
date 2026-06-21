import { redirect } from "react-router";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { commitSession, getSession, setSessionToken } from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { UsersFindOneDocument } from "~/queries/users";

/**
 * Typed failure from {@link establishSessionFromToken}. Callers map each code to
 * their own idiom:
 * - Login action → `Response.json` (502 for `verify-failed`, 403 for `not-allowed`).
 * - SSO callback routes → `redirect("/login?sso=<provider>&error=<code>")`.
 */
export class SsoAuthError extends Error {
  code: "verify-failed" | "not-allowed";
  constructor(code: "verify-failed" | "not-allowed") {
    super(code);
    this.name = "SsoAuthError";
    this.code = code;
  }
}

/**
 * Shared post-token session logic for email + every SSO flow.
 *
 * Single, unambiguous contract:
 * - On success it RETURNS a redirect `Response` (to the role home) with a
 *   `Set-Cookie` committing the session.
 * - On failure it THROWS a typed {@link SsoAuthError} — never returns an error
 *   value, never emits a redirect/`Response.json` itself.
 *
 *   - `verify-failed` — the `UsersFindOne` lookup threw (couldn't verify the
 *     account).
 *   - `not-allowed` — the platform gate failed (`user.platform !== env.PLATFORM`).
 */
export async function establishSessionFromToken(
  request: Request,
  token: string,
): Promise<Response> {
  let userResp;
  try {
    userResp = await gqlClient.request(
      UsersFindOneDocument,
      {},
      { "access-token": token },
    );
  } catch {
    throw new SsoAuthError("verify-failed");
  }

  const user = userResp.UsersFindOne;
  if (!user?.platform || user.platform !== env.PLATFORM) {
    throw new SsoAuthError("not-allowed");
  }

  const session = await getSession(request);
  await setSessionToken(session, token);
  const target = homePathForIdentifier(user.typeObj?.identifier);
  return redirect(target, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
