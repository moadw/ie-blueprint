import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Link, useActionData, useNavigation, useSubmit } from "react-router";
import { Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type ForgotActionData = { ok?: boolean; error?: string } | undefined;

const forgotFormSchema = z.object({ email: z.string().email() });
type ForgotFormValues = z.infer<typeof forgotFormSchema>;

export function ForgotPasswordForm() {
  const navigation = useNavigation();
  const actionData = useActionData() as ForgotActionData;
  const submit = useSubmit();
  const isSubmitting = navigation.state !== "idle";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
  }, [actionData]);

  const onValid = (values: ForgotFormValues) => {
    void submit(values, { method: "post" });
  };

  if (actionData?.ok) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] font-medium text-foreground">Check your inbox</p>
            <p className="text-[14px] text-muted-foreground">
              If an account exists for that email, we've sent password reset
              instructions.
            </p>
          </div>
        </div>
        <p className="text-center text-[14px] text-muted-foreground">
          <Link to="/login" className="text-foreground font-semibold hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

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
      <Button variant="primary" type="submit" loading={isSubmitting} className="w-full">
        {!isSubmitting && <Mail className="mr-2 h-4 w-4" />}
        Send reset instructions
      </Button>
      <p className="text-center text-[14px] text-muted-foreground mt-8">
        Remembered it?{" "}
        <Link to="/login" className="text-foreground font-semibold hover:underline">
          Back to sign in
        </Link>
      </p>
    </Form>
  );
}
