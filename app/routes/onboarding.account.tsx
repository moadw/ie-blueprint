import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { OnboardingLayout } from "~/components/layout/onboarding-layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { SearchableSelectOption } from "~/components/ui/searchable-select";
import { setToken } from "~/lib/auth";
import { env } from "~/lib/env";
import { payloadErrorMessage, toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import { UserUpdateOneDocument } from "~/mutations/users";
import { UserDistrictFindOneDocument } from "~/queries/districts";
import { SchoolFindManyDocument } from "~/queries/schools";
import { UsersFindOneDocument } from "~/queries/users";
import { AccountPreviewCard } from "./onboarding.account/_components/account-preview-card";
import { SchoolStep } from "./onboarding.account/_components/school-step";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);

  // CLAUDE.md resilient-loader rule: wrap the data call in `safe()` so a
  // Blueprint 500 renders a soft error card instead of white-screening the
  // whole route via the root ErrorBoundary.
  const userRes = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  const user = userRes.ok ? (userRes.data.UsersFindOne ?? null) : null;

  // District first — its `_id` scopes the school query (and its `name` feeds
  // the step-1 invite chip + step-2 read-only box). Session-scoped, no args.
  const districtRes = await safe(
    gqlClient.request(
      UserDistrictFindOneDocument,
      {},
      { "access-token": token },
    ),
  );
  const district = districtRes.ok
    ? (districtRes.data.UserDistrictFindOne ?? null)
    : null;

  // Then the district's full school catalog. Blueprint `SchoolFindMany` has no
  // substring name search (index-driven), so we fetch all in-district schools
  // and filter by name client-side in the picker (pattern: UserSchoolsDialog).
  const schoolsRes = district?._id
    ? await safe(
        gqlClient.request(
          SchoolFindManyDocument,
          {
            filter: { district: district._id, platform: env.PLATFORM },
            limit: 500,
          },
          { "access-token": token },
        ),
      )
    : null;
  const schools =
    schoolsRes && schoolsRes.ok ? (schoolsRes.data.SchoolFindMany ?? []) : [];

  // `token` is returned for the client-side mutations this route performs
  // (`UserUpdateOne`, `SetUserSchool`), mirroring `classrooms_.create.tsx`.
  return {
    token,
    user,
    district,
    schools,
    error: userRes.error,
    districtError: districtRes.error,
    schoolsError: schoolsRes && !schoolsRes.ok ? schoolsRes.error : null,
  };
}

const schema = z.object({
  name: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

// Role pills — only Educator is enabled (non-editable); the rest are disabled
// "Coming Soon" placeholders, exactly as the prototype's AccountSetup step 1.
const ROLES = [
  { value: "educator", label: "Educator", enabled: true },
  { value: "administrator", label: "Administrator", enabled: false },
  { value: "student", label: "Student", enabled: false },
  { value: "family", label: "Family", enabled: false },
] as const;

export default function OnboardingAccountRoute() {
  const { token, user, district, schools, error, districtError, schoolsError } =
    useLoaderData<typeof loader>();
  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);

  // Map the district's school catalog to picker options (drop null rows and
  // nameless schools). Client-side name filtering happens inside the picker.
  const schoolOptions: SearchableSelectOption[] = schools
    .filter((s): s is NonNullable<typeof s> => s != null)
    .map((s) => ({ value: s._id, label: s.name ?? "" }))
    .filter((s) => s.label.length > 0);

  useEffect(() => {
    setToken(token);
  }, [token]);

  const defaultName = [user?.firstName, user?.lastName]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .trim();

  const { register, handleSubmit, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: defaultName },
  });

  const watchedName = watch("name") ?? "";
  const nameEmpty = watchedName.trim().length === 0;

  const onValid = async (values: FormValues) => {
    if (!user?._id) {
      toast.error("Missing user context");
      return;
    }
    // Split the entered name on the LAST space: everything before is the first
    // name, the remainder the last name (models UserDialog's name handling).
    const trimmed = values.name.trim();
    const lastSpace = trimmed.lastIndexOf(" ");
    const firstName = lastSpace === -1 ? trimmed : trimmed.slice(0, lastSpace);
    const lastName = lastSpace === -1 ? "" : trimmed.slice(lastSpace + 1);

    setSaving(true);
    try {
      const result = await gqlClient.request(
        UserUpdateOneDocument,
        { _id: user._id, record: { firstName, lastName } },
        { "access-token": token },
      );
      // Blueprint mutation payloads surface domain errors on `payload.error`
      // rather than throwing (CLAUDE.md).
      const payloadError = payloadErrorMessage(result.UserUpdateOne);
      if (payloadError) throw new Error(payloadError);
      setStep(2);
    } catch (err) {
      toast.error(toErrorMessage(err, "Failed to save your name"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout
      title={step === 1 ? "Welcome to Inner Explorer" : "Find your school"}
      currentStep={step}
      totalSteps={2}
      preview={<AccountPreviewCard name={watchedName} />}
    >
      {error || !user ? (
        <div className="rounded-[14px] border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-600">
          Couldn't load your account. Please refresh and try again.
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleSubmit(onValid)} className="flex flex-col">
          {/* Invite chip — names the district the teacher is joining. Hidden
              gracefully when the district name is unavailable/errored. */}
          {district?.name ? (
            <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[13px] font-medium text-primary">
              <CircleCheck className="h-3.5 w-3.5" />
              You're joining {district.name}
            </div>
          ) : null}

          <p className="mb-5 text-sm text-muted-foreground sm:text-base lg:mb-6">
            Let's set up your profile
          </p>

          <div className="mb-5 lg:mb-6">
            <Input
              label="Your name"
              placeholder="e.g., Jane Smith"
              autoComplete="name"
              className="rounded-xl"
              {...register("name")}
            />
          </div>

          <div className="mb-6 lg:mb-8">
            <p className="mb-2 text-[14px] font-medium text-foreground">I'm a</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  disabled={!role.enabled}
                  aria-pressed={role.enabled}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium transition-colors sm:px-5 sm:py-2.5 sm:text-sm",
                    role.enabled
                      ? "bg-foreground text-background shadow-sm"
                      : "cursor-not-allowed border border-border/30 bg-card/40 text-muted-foreground/40",
                  )}
                >
                  {role.label}
                  {role.enabled ? "" : " (Coming Soon)"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={nameEmpty || saving}
            >
              Next
            </Button>
          </div>
        </form>
      ) : (
        <SchoolStep
          token={token}
          userId={user._id}
          districtName={district?.name ?? null}
          schools={schoolOptions}
          loadError={districtError ?? schoolsError}
          onBack={() => setStep(1)}
        />
      )}
    </OnboardingLayout>
  );
}
