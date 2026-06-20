import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Link, useActionData, useNavigation, useSubmit } from "react-router";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";

type LoginActionData = { error: string; title?: string } | undefined;

type SsoError = { provider: string | null; code: string } | null;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const SSO_ERROR_MESSAGES: Record<string, string> = {
  "auth-failed": "We couldn't sign you in. Please try again.",
  "not-allowed":
    "This account isn't available on this site. Contact support@innerexplorer.com to request access.",
  "bad-state": "Your sign-in link expired. Please try again.",
  "no-token": "We couldn't sign you in. Please try again.",
  "missing-code": "We couldn't sign you in. Please try again.",
  "not-configured": "This sign-in option isn't available right now.",
  "verify-failed":
    "We couldn't verify your account right now. Please try again or contact your administrator.",
};

function ssoErrorMessage(code: string): string {
  return SSO_ERROR_MESSAGES[code] ?? "We couldn't sign you in. Please try again.";
}

export function LoginForm({ ssoError }: { ssoError?: SsoError }) {
  const navigation = useNavigation();
  const actionData = useActionData() as LoginActionData;
  const submit = useSubmit();
  const isSubmitting = navigation.state !== "idle";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (!ssoError) return;
    // Surface an SSO callback error (arriving via `?sso=&error=`) once on mount.
    toast.error(ssoErrorMessage(ssoError.code), {
      id: `sso-${ssoError.code}`,
    });
    // Only on the initial render for a given error payload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!actionData?.error) return;
    // A hard access block (e.g. wrong platform) carries a title — surface it as
    // a persistent, dismissable toast so it isn't missed; retryable errors stay
    // as a brief auto-dismissing toast.
    if (actionData.title) {
      toast.error(actionData.title, {
        description: actionData.error,
        duration: Infinity,
        closeButton: true,
        id: "login-blocked",
      });
    } else {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const onValid = (values: LoginFormValues) => {
    void submit(values, { method: "post" });
  };

  return (
    <Form
      method="post"
      onSubmit={handleSubmit(onValid)}
      className="space-y-4"
    >
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        {...(errors.email?.message ? { error: errors.email.message } : {})}
        {...register("email")}
      />
      <PasswordInput
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        {...(errors.password?.message ? { error: errors.password.message } : {})}
        {...register("password")}
      />
      <Button
        variant="primary"
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        {!isSubmitting && <Mail className="mr-2 h-4 w-4" />}
        Sign In
      </Button>
      <p className="text-center text-[14px] text-muted-foreground mt-8">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-foreground font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </Form>
  );
}
