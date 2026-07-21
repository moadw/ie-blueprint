import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { establishSessionFromToken, SsoAuthError } from "~/lib/auth.server";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { redeemErrorToMessage } from "~/lib/join-code";
import { safe } from "~/lib/safe-loader";
import { getSessionToken } from "~/lib/session.server";
import { UserJoinByCodeDocument } from "~/mutations/users";
import { UsersFindOneDocument } from "~/queries/users";
import { AuthLayout } from "./login/_components/auth-layout";
import { SSOButtons } from "./login/_components/sso-buttons";
import { JoinWelcome } from "./join.$code/_components/join-welcome";
import { JoinSignupForm, joinSignupSchema } from "./join.$code/_components/join-signup-form";

export async function loader({ request }: LoaderFunctionArgs) {
  // Public page — read the token but never bounce to /login (getSessionToken,
  // NOT requireSessionToken). The `?district` query param is the display source
  // for the inviting district's name (ie has no verify-invite endpoint).
  const url = new URL(request.url);
  const districtName = url.searchParams.get("district");

  const token = await getSessionToken(request);
  if (token) {
    // Already authenticated: verify the session and, if this is a teacher, skip
    // the welcome and continue onboarding. safe() so a transient verify failure
    // renders the welcome instead of white-screening the whole page.
    const result = await safe(
      gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
    );
    const identifier = result.ok
      ? result.data.UsersFindOne?.typeObj?.identifier
      : null;
    if (identifier === "teacher") {
      throw redirect("/onboarding/account");
    }
  }

  return { districtName };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const code = params.code ?? "";
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const parsed = joinSignupSchema.safeParse({ email, password });
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid email or password format" },
      { status: 400 },
    );
  }
  if (!env.PLATFORM) {
    return Response.json(
      {
        error:
          "Platform is not configured. Please contact your administrator.",
      },
      { status: 500 },
    );
  }

  // Mint a session token by creating the account. Mirrors the Google-SSO branch
  // in login.tsx (POST + `{ token }` parse), not just the login branch.
  // TODO(join-signup): backend endpoint — POST /webapi/signup does not exist yet.
  // This fails gracefully (clear toast, never a white screen) until it ships.
  let signupRes: Response;
  try {
    signupRes = await fetch(`${env.REST_URL}/webapi/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
        platform: env.PLATFORM,
      }),
    });
  } catch {
    return Response.json(
      {
        error:
          "We couldn't create your account right now. Please try again later.",
      },
      { status: 502 },
    );
  }
  if (!signupRes.ok) {
    return Response.json(
      {
        error:
          "We couldn't create your account. Sign-up isn't available yet — please contact your administrator.",
      },
      { status: signupRes.status },
    );
  }
  const body = (await signupRes.json()) as { token?: string };
  if (!body.token) {
    return Response.json(
      { error: "Sign-up response missing token" },
      { status: 502 },
    );
  }
  const token = body.token;

  // Redeem the invite code with the RAW token header — the session cookie isn't
  // committed yet. "User Organization already exists" is idempotent success.
  const redeem = await safe(
    gqlClient.request(
      UserJoinByCodeDocument,
      { code },
      { "access-token": token },
    ),
  );
  if (!redeem.ok) {
    const mapped = redeemErrorToMessage(redeem.error);
    if ("message" in mapped) {
      return Response.json({ error: mapped.message }, { status: 400 });
    }
    // mapped.ok === true — idempotent success; fall through to the session.
  }

  // Commit the session and continue onboarding (name → school), overriding the
  // default role-home redirect. Same SsoAuthError handling as login.tsx.
  try {
    return await establishSessionFromToken(
      request,
      token,
      "/onboarding/account",
    );
  } catch (err) {
    if (err instanceof SsoAuthError) {
      if (err.code === "not-allowed") {
        return Response.json(
          {
            title: "Not allowed",
            error:
              "This account isn't available on this site. Contact info@innerexplorer.com to request access.",
          },
          { status: 403 },
        );
      }
      return Response.json(
        {
          error:
            "We couldn't verify your account right now. Please try again or contact your administrator.",
        },
        { status: 502 },
      );
    }
    throw err;
  }
}

export default function JoinRoute() {
  const { districtName } = useLoaderData<typeof loader>();
  const [step, setStep] = useState<"welcome" | "form">("welcome");

  if (step === "welcome") {
    return (
      <JoinWelcome
        districtName={districtName}
        onGetStarted={() => setStep("form")}
      />
    );
  }

  return (
    <AuthLayout
      title={districtName ? `Join ${districtName}` : "Join Inner Explorer"}
      subtitle="Create your account to access mindfulness practices"
    >
      <SSOButtons />
      <JoinSignupForm />
    </AuthLayout>
  );
}
