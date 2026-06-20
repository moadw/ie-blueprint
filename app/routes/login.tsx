import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { establishSessionFromToken, SsoAuthError } from "~/lib/auth.server";
import { env } from "~/lib/env";
import { getSessionToken } from "~/lib/session.server";
import { AuthLayout } from "./login/_components/auth-layout";
import { SSOButtons } from "./login/_components/sso-buttons";
import { LoginForm, loginSchema } from "./login/_components/login-form";

export type SsoConfig = {
  google: { enabled: boolean };
  clever: { enabled: boolean };
  classlink: { enabled: boolean };
};

export type SsoError = { provider: string | null; code: string } | null;

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getSessionToken(request);
  if (token) return redirect("/");

  const url = new URL(request.url);
  const sso = url.searchParams.get("sso");
  const error = url.searchParams.get("error");

  return {
    ssoError: error ? { provider: sso, code: error } : null,
    sso: {
      google: {
        enabled: Boolean(
          env.FIREBASE_API_KEY &&
            env.FIREBASE_AUTH_DOMAIN &&
            env.FIREBASE_PROJECT_ID &&
            env.FIREBASE_APP_ID,
        ),
      },
      clever: { enabled: Boolean(env.APP_URL && env.CLEVER_CLIENT_ID) },
      classlink: { enabled: Boolean(env.APP_URL && env.CLASSLINK_CLIENT_ID) },
    } satisfies SsoConfig,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");

  // Google SSO branch (submitted by the GoogleSSOButton fetcher after the
  // Firebase popup). Exchanges the Google ID token at webapi/signup-google,
  // then establishes the session via the shared helper.
  if (intent === "google") {
    const token = String(form.get("token") ?? "");
    if (!token) {
      return Response.json({ error: "Missing Google token" }, { status: 400 });
    }
    const googleRes = await fetch(`${env.REST_URL}/webapi/signup-google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform: env.PLATFORM }),
    });
    if (!googleRes.ok) {
      return Response.json(
        { error: "Couldn't sign you in with Google" },
        { status: 401 },
      );
    }
    const googleBody = (await googleRes.json()) as { token?: string };
    if (!googleBody.token) {
      return Response.json(
        { error: "Google response missing token" },
        { status: 502 },
      );
    }
    try {
      return await establishSessionFromToken(request, googleBody.token);
    } catch (err) {
      if (err instanceof SsoAuthError) {
        if (err.code === "not-allowed") {
          return Response.json(
            {
              title: "Not allowed",
              error:
                "This account isn't available on this site. Contact support@innerexplorer.com to request access.",
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

  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid email or password format" },
      { status: 400 },
    );
  }
  const res = await fetch(`${env.REST_URL}/webapi/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
  if (!res.ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const body = (await res.json()) as { token?: string };
  if (!body.token) {
    return Response.json(
      { error: "Login response missing token" },
      { status: 502 },
    );
  }
  if (!env.PLATFORM) {
    return Response.json(
      { error: "Platform is not configured. Please contact your administrator." },
      { status: 500 },
    );
  }
  try {
    return await establishSessionFromToken(request, body.token);
  } catch (err) {
    if (err instanceof SsoAuthError) {
      if (err.code === "not-allowed") {
        return Response.json(
          {
            title: "Not allowed",
            error:
              "This account isn't available on this site. Contact support@innerexplorer.com to request access.",
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

export default function LoginRoute() {
  const { ssoError, sso } = useLoaderData<typeof loader>();
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your mindfulness journey"
    >
      <SSOButtons sso={sso} />
      <LoginForm ssoError={ssoError} />
    </AuthLayout>
  );
}
