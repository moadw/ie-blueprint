import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import {
  commitSession,
  getSession,
  getSessionToken,
  setSessionToken,
} from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { UsersFindOneDocument } from "~/queries/users";
import { AuthLayout } from "./login/_components/auth-layout";
import { SSOButtons } from "./login/_components/sso-buttons";
import { LoginForm, loginSchema } from "./login/_components/login-form";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getSessionToken(request);
  if (token) return redirect("/");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
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
  let userResp;
  try {
    userResp = await gqlClient.request(
      UsersFindOneDocument,
      {},
      { "access-token": body.token },
    );
  } catch {
    return Response.json(
      {
        error:
          "We couldn't verify your account right now. Please try again or contact your administrator.",
      },
      { status: 502 },
    );
  }
  const user = userResp.UsersFindOne;
  if (!user?.platform || user.platform !== env.PLATFORM) {
    return Response.json(
      {
        title: "Not allowed",
        error:
          "This account isn't available on this site. Contact support@innerexplorer.com to request access.",
      },
      { status: 403 },
    );
  }
  const session = await getSession(request);
  await setSessionToken(session, body.token);
  const target = homePathForIdentifier(user.typeObj?.identifier);
  return redirect(target, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function LoginRoute() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your mindfulness journey"
    >
      <SSOButtons />
      <LoginForm />
    </AuthLayout>
  );
}
