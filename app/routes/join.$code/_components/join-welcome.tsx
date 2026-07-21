import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";

export interface JoinWelcomeProps {
  districtName: string | null;
  onGetStarted: () => void;
}

/**
 * The initial `/join/:code` screen — a minimal centered welcome card (NOT the
 * AuthLayout shell), matching the prototype `JoinDistrict`. Names the inviting
 * district (from the `?district` query param) and hands off to the signup form.
 */
export function JoinWelcome({ districtName, onGetStarted }: JoinWelcomeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <Logo className="h-10 mx-auto" />
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">
              {districtName
                ? `${districtName} has invited you to join Inner Explorer`
                : "You've been invited to join Inner Explorer"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign up or log in to get started with mindfulness practices for
              your classroom.
            </p>
          </div>
          <Button className="w-full" onClick={onGetStarted}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
