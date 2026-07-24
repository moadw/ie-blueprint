import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { z } from "zod";
import { gqlClient } from "~/lib/graphql";
import { toErrorMessage } from "~/lib/errors";
import { UserResetPasswordDocument } from "~/mutations/users";
import { Logo } from "~/components/ui/logo";
import { ResetPasswordForm } from "./reset-password.$token/_components/reset-password-form";

const resetSchema = z.object({ password: z.string().min(6) });

export async function loader({ params }: LoaderFunctionArgs) {
  return { token: params.token ?? "" };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const token = params.token ?? "";
  if (!token) {
    return Response.json(
      { error: "This reset link is invalid. Please request a new one." },
      { status: 400 },
    );
  }

  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const parsed = resetSchema.safeParse({ password });
  if (!parsed.success) {
    return Response.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  try {
    const data = await gqlClient.request(UserResetPasswordDocument, {
      token,
      password: parsed.data.password,
    });
    if (data.UserResetPassword === "password changed") {
      return Response.json({ ok: true });
    }
    return Response.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 },
    );
  } catch (err) {
    // The backend throws "token not valid" / "user not found" for a bad or
    // expired link — map those to a friendly message rather than leaking the
    // raw backend string; surface anything unexpected as a generic error.
    const raw = toErrorMessage(err, "").toLowerCase();
    const invalidLink =
      raw.includes("token not valid") || raw.includes("user not found");
    return Response.json(
      {
        error: invalidLink
          ? "This reset link is invalid or has expired. Please request a new one."
          : "Something went wrong. Please try again.",
      },
      { status: 400 },
    );
  }
}

export default function ResetPasswordRoute() {
  const { token } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <Logo className="h-9 mb-8" />
      <div className="w-full max-w-[400px] rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1
          className="text-[28px] leading-tight mb-2 text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
        >
          Reset password
        </h1>
        <p className="text-muted-foreground text-[15px] mb-6">
          Choose a new password for your account.
        </p>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
