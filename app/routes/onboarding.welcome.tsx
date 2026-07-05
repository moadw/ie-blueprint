import { useCallback } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { markOnboardingWelcomeSeen } from "~/lib/onboarding-welcome";
import { requireSessionToken } from "~/lib/session.server";
import { InteractiveOnboarding } from "./onboarding.welcome/_components/interactive-onboarding";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSessionToken(request);

  const url = new URL(request.url);
  const group = url.searchParams.get("group");
  const curriculum = url.searchParams.get("curriculum");

  return { group, curriculum };
}

export default function OnboardingWelcomeRoute() {
  const { group, curriculum } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleComplete = useCallback(() => {
    markOnboardingWelcomeSeen();
    navigate(group && curriculum ? `/classrooms/${group}/${curriculum}` : "/classrooms", {
      replace: true,
    });
  }, [group, curriculum, navigate]);

  return <InteractiveOnboarding onComplete={handleComplete} />;
}
