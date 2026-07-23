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
 * - On success it RETURNS a redirect `Response` (to `redirectTo` when given,
 *   else the role home) with a `Set-Cookie` committing the session.
 * - On failure it THROWS a typed {@link SsoAuthError} — never returns an error
 *   value, never emits a redirect/`Response.json` itself.
 *
 *   - `verify-failed` — the `UsersFindOne` lookup threw (couldn't verify the
 *     account).
 *   - `not-allowed` — the platform gate failed (`user.platform !== env.PLATFORM`).
 *
 * @param redirectTo Optional explicit redirect target. Callers that want the
 *   default role-based home (login + every SSO flow) omit it; the join-code
 *   signup flow passes `/onboarding/account` to continue onboarding instead.
 */
export async function establishSessionFromToken(
  request: Request,
  token: string,
  redirectTo?: string,
): Promise<Response> {
  let userResp;
  try {
    userResp = await gqlClient.request(
      UsersFindOneDocument,
      {},
      { "access-token": token },
    );
  } catch (err) {
    console.error(
      "[sso] verify-failed — UsersFindOne lookup threw for the token returned by the SSO backend",
      err,
    );
    throw new SsoAuthError("verify-failed");
  }

  const user = userResp.UsersFindOne;
  if (!user?.platform || user.platform !== env.PLATFORM) {
    console.warn("[sso] not-allowed — platform gate failed", {
      userId: user?._id ?? null,
      userEmail: user?.email ?? null,
      userType: user?.typeObj?.identifier ?? null,
      userPlatform: user?.platform ?? null,
      expectedPlatform: env.PLATFORM,
      reason: !user
        ? "UsersFindOne returned null (token has no associated user)"
        : !user.platform
          ? "user record has no platform"
          : "user.platform !== expected platform",
    });
    throw new SsoAuthError("not-allowed");
  }

  const session = await getSession(request);
  await setSessionToken(session, token);
  const target = redirectTo ?? homePathForIdentifier(user.typeObj?.identifier);
  return redirect(target, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
