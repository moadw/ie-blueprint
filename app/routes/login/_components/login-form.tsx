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

type LoginActionData = { error: string } | undefined;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
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
    if (actionData?.error) {
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
