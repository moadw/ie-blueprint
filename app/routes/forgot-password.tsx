import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { z } from "zod";
import { gqlClient } from "~/lib/graphql";
import { toErrorMessage } from "~/lib/errors";
import { getSessionToken } from "~/lib/session.server";
import { UserForgotPasswordDocument } from "~/mutations/users";
import { AuthLayout } from "./login/_components/auth-layout";
import { ForgotPasswordForm } from "./forgot-password/_components/forgot-password-form";

const forgotSchema = z.object({ email: z.string().email() });

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getSessionToken(request);
  if (token) return redirect("/");
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");

  const parsed = forgotSchema.safeParse({ email });
  if (!parsed.success) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  try {
    await gqlClient.request(UserForgotPasswordDocument, {
      email: parsed.data.email.toLowerCase(),
    });
  } catch (err) {
    // The backend errors with "user not found" for unregistered emails. Swallow
    // that so we always return the same neutral response — never reveal whether
    // an email is registered (anti account-enumeration). Surface only genuine
    // failures (network / backend outage).
    if (!toErrorMessage(err, "").toLowerCase().includes("user not found")) {
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  }

  return Response.json({ ok: true });
}

export default function ForgotPasswordRoute() {
  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you reset instructions."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
