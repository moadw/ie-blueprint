import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Link, useActionData, useNavigation, useSubmit } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/ui/password-input";

type ResetActionData = { ok?: boolean; error?: string } | undefined;

const resetFormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type ResetFormValues = z.infer<typeof resetFormSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const navigation = useNavigation();
  const actionData = useActionData() as ResetActionData;
  const submit = useSubmit();
  const isSubmitting = navigation.state !== "idle";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
  }, [actionData]);

  const onValid = (values: ResetFormValues) => {
    void submit({ password: values.password }, { method: "post" });
  };

  if (actionData?.ok) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] font-medium text-foreground">Password reset</p>
            <p className="text-[14px] text-muted-foreground">
              Your password has been changed. Sign in with your new password.
            </p>
          </div>
        </div>
        <Link to="/login" className="block">
          <Button variant="primary" className="w-full">
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  const invalidToken = !token;

  return (
    <Form method="post" onSubmit={handleSubmit(onValid)} className="space-y-4">
      <PasswordInput
        label="New password"
        placeholder="••••••••"
        autoComplete="new-password"
        {...(errors.password?.message ? { error: errors.password.message } : {})}
        {...register("password")}
      />
      <Button
        variant="primary"
        type="submit"
        loading={isSubmitting}
        disabled={invalidToken}
        className="w-full"
      >
        Reset password
      </Button>
      <p className="text-center text-[14px] text-muted-foreground mt-4">
        <Link to="/login" className="text-foreground font-semibold hover:underline">
          Back to sign in
        </Link>
      </p>
    </Form>
  );
}
