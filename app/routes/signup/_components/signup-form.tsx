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

type SignupActionData = { error: string } | undefined;

export const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigation = useNavigation();
  const actionData = useActionData() as SignupActionData;
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
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
        void handleSubmit(
          () => {
            (e.target as HTMLFormElement).submit();
          },
          () => {
            // invalid — already prevented by handleSubmit
          },
        )(e);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Input
          label="First Name"
          type="text"
          placeholder="Jane"
          autoComplete="given-name"
          {...(errors.firstName?.message
            ? { error: errors.firstName.message }
            : {})}
          {...register("firstName")}
        />
        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          autoComplete="family-name"
          {...(errors.lastName?.message
            ? { error: errors.lastName.message }
            : {})}
          {...register("lastName")}
        />
      </div>
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
        autoComplete="new-password"
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
        Create Account
      </Button>
      <p className="text-center text-[14px] text-muted-foreground mt-8">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-foreground font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Form>
  );
}
