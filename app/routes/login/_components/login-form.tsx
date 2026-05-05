import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";

type LoginActionData = { error: string } | undefined;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigation = useNavigation();
  const actionData = useActionData() as LoginActionData;
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      onSubmit={(e) => {
        // Run RHF validation; if invalid, prevent native submit.
        // handleSubmit returns a handler that calls preventDefault on errors.
        void handleSubmit(
          () => {
            // valid — let native submission proceed by NOT preventing default.
            // handleSubmit already called e.preventDefault() once; we need to
            // re-submit the form natively.
            (e.target as HTMLFormElement).submit();
          },
          () => {
            // invalid — already prevented by handleSubmit
          },
        )(e);
      }}
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
        <Mail className="mr-2 h-4 w-4" />
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
