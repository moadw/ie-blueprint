import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, useActionData, useNavigation, useSubmit } from "react-router";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";

type JoinSignupActionData = { error: string; title?: string } | undefined;

export const joinSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type JoinSignupFormValues = z.infer<typeof joinSignupSchema>;

/**
 * Email + password account-creation form for the district join flow. Mirrors
 * `login-form.tsx` (RHF + zod + `useSubmit` POST to the route action +
 * `useActionData` sonner toast). Name is NOT collected here — it is set later at
 * `/onboarding/account`.
 */
export function JoinSignupForm() {
  const navigation = useNavigation();
  const actionData = useActionData() as JoinSignupActionData;
  const submit = useSubmit();
  const isSubmitting = navigation.state !== "idle";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinSignupFormValues>({
    resolver: zodResolver(joinSignupSchema),
    mode: "onTouched",
  });

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
        id: "join-blocked",
      });
    } else {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const onValid = (values: JoinSignupFormValues) => {
    void submit(values, { method: "post" });
  };

  return (
    <Form method="post" onSubmit={handleSubmit(onValid)} className="space-y-4">
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
        {!isSubmitting && <Mail className="mr-2 h-4 w-4" />}
        Create Account
      </Button>
    </Form>
  );
}
