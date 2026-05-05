import { AuthLayout } from "./login/_components/auth-layout";
import { SSOButtons } from "./login/_components/sso-buttons";
import { SignupForm } from "./signup/_components/signup-form";

export async function action() {
  return Response.json(
    { error: "Signup is not yet available" },
    { status: 501 },
  );
}

export default function SignupRoute() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us on your mindfulness journey"
    >
      <SSOButtons />
      <SignupForm />
    </AuthLayout>
  );
}
