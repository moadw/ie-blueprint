import { useEffect, useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { IconTile } from "~/components/ui/icon-tile";
import { Slider } from "~/components/ui/slider";
import { OptionCard } from "~/components/ui/option-card";
import { setToken } from "~/lib/auth";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { getInitials } from "~/lib/initials";
import { requireSessionToken } from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { experienceIds, experiences } from "~/lib/experiences";
import type { ExperienceId } from "~/lib/experiences";
import { UsersFindOneDocument } from "~/queries/users";
import { GroupCreateOneDocument } from "~/queries/groups";
import { OnboardingLayout } from "./classroom.create/_components/onboarding-layout";
import { ClassroomPreviewCard } from "./classroom.create/_components/classroom-preview-card";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const userData = await gqlClient.request(
    UsersFindOneDocument,
    {},
    { "access-token": token },
  );
  const user = userData.UsersFindOne ?? null;
  if (user?.typeObj?.identifier !== "teacher") {
    throw redirect(homePathForIdentifier(user?.typeObj?.identifier));
  }
  return { token, user };
}

type ActionData = { error: string } | undefined;

export async function action({ request }: ActionFunctionArgs) {
  const token = await requireSessionToken(request);
  const formData = await request.formData();
  const nameRaw = formData.get("name");
  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  if (name.length < 1) {
    return { error: "Classroom name is required" };
  }

  const userData = await gqlClient.request(
    UsersFindOneDocument,
    {},
    { "access-token": token },
  );
  const user = userData.UsersFindOne;
  if (!user?._id || !user.organization) {
    return { error: "Missing user context" };
  }

  try {
    await gqlClient.request(
      GroupCreateOneDocument,
      {
        name,
        teacher: user._id,
        platform: env.PLATFORM,
        organization: user.organization,
        curriculums: [],
      },
      { "access-token": token },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create classroom";
    return { error: message };
  }

  throw redirect("/classrooms");
}

const schema = z.object({
  name: z.string().min(1, "Required"),
  studentCount: z.number().int().min(1).max(50),
  experience: z.enum(experienceIds),
});

type FormValues = z.infer<typeof schema>;

export default function ClassroomCreateRoute() {
  const { token } = useLoaderData<typeof loader>();
  const actionData = useActionData() as ActionData;
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const isSubmitting = navigation.state !== "idle";

  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    setToken(token);
  }, [token]);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      studentCount: 10,
      experience: experiences[0].id as ExperienceId,
    },
  });

  const watchedName = watch("name") ?? "";
  const watchedCount = watch("studentCount");
  const watchedExperience = watch("experience");

  const onValid = (values: FormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    void submit(
      {
        name: values.name,
      },
      { method: "post" },
    );
  };

  const initials = getInitials(watchedName.trim());

  return (
    <OnboardingLayout
      title={step === 1 ? "Name your classroom" : "Classroom preferences"}
      currentStep={step}
      totalSteps={2}
      preview={<ClassroomPreviewCard name={watchedName} />}
    >
      <Form method="post" onSubmit={handleSubmit(onValid)} className="space-y-6">
        {step === 1 ? (
          <div className="space-y-6">
            <IconTile size="lg" {...(initials ? { initials } : {})} />
            <Input
              label="Classroom name"
              placeholder="e.g. Mrs. Smith's 3rd Grade"
              autoComplete="off"
              {...(errors.name?.message ? { error: errors.name.message } : {})}
              {...register("name")}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-[14px] text-foreground font-medium">
                  Number of students
                </label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={watchedCount}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isNaN(n)) {
                      setValue("studentCount", Math.max(1, Math.min(50, n)), {
                        shouldValidate: true,
                      });
                    }
                  }}
                  containerClassName="w-24"
                  className="h-10 text-center"
                />
              </div>
              <Slider
                value={watchedCount}
                onValueChange={(n) =>
                  setValue("studentCount", n, { shouldValidate: true })
                }
                min={1}
                max={50}
                aria-label="Number of students"
              />
              <div className="flex items-center -space-x-2 pt-1">
                {Array.from({
                  length: Math.min(5, Math.max(0, watchedCount)),
                }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="w-7 h-7 rounded-full bg-primary/15 border-2 border-white"
                  />
                ))}
                {watchedCount > 5 ? (
                  <span
                    aria-hidden="true"
                    className="ml-2 text-sm text-muted-foreground"
                  >
                    +{watchedCount - 5}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/classrooms")}
              >
                Back
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experiences.map((opt) => {
                const Icon = opt.icon;
                const selected = watchedExperience === opt.id;
                return (
                  <OptionCard
                    key={opt.id}
                    icon={<Icon className="w-6 h-6" />}
                    title={opt.title}
                    subtitle={opt.subtitle}
                    selected={selected}
                    onSelect={() =>
                      setValue("experience", opt.id, { shouldValidate: true })
                    }
                  />
                );
              })}
            </div>
            {errors.experience?.message ? (
              <p className="text-[13px] text-destructive">
                {errors.experience.message}
              </p>
            ) : null}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={isSubmitting}
                className="flex-1"
              >
                Create Classroom
              </Button>
            </div>
          </div>
        )}
      </Form>
    </OnboardingLayout>
  );
}
