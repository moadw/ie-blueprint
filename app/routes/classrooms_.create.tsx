import { useEffect, useRef, useState } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { deriveCourses } from "~/components/admin/experiences-selector";
import type { CurriculumLite } from "~/components/admin/experiences-selector";
import { setToken } from "~/lib/auth";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { uploadGroupCover } from "~/lib/group-cover";
import { gqlClient } from "~/lib/graphql";
import { getInitials } from "~/lib/initials";
import { hasSeenOnboardingWelcome } from "~/lib/onboarding-welcome";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { homePathForIdentifier } from "~/lib/user";
import { CurriculumCollectionFindManyDocument } from "~/queries/curriculum-collections";
import { CurriculumsFindManyDocument } from "~/queries/curriculums";
import { UserDistrictFindOneDocument } from "~/queries/districts";
import { UsersFindOneDocument } from "~/queries/users";
import { GroupCreateOneDocument } from "~/queries/groups";
import { OnboardingLayout } from "./classrooms_.create/_components/onboarding-layout";
import { ClassroomIconUpload } from "./classrooms_.create/_components/classroom-icon-upload";
import { ClassroomInfoCard } from "./classrooms_.create/_components/classroom-info-card";
import { ClassroomPreviewCard } from "./classrooms_.create/_components/classroom-preview-card";
import { CollectionSelect } from "./classrooms_.create/_components/collection-select";
import { CourseMultiSelect } from "./classrooms_.create/_components/course-multi-select";

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

  const [districtRes, collectionsRes, curriculaRes] = await Promise.all([
    safe(
      gqlClient.request(
        UserDistrictFindOneDocument,
        {},
        { "access-token": token },
      ),
    ),
    safe(
      gqlClient.request(
        CurriculumCollectionFindManyDocument,
        { filter: { platform: env.PLATFORM }, limit: 500 },
        { "access-token": token },
      ),
    ),
    safe(
      gqlClient.request(
        CurriculumsFindManyDocument,
        { filter: { platform: env.PLATFORM }, limit: 500 },
        { "access-token": token },
      ),
    ),
  ]);

  const district = districtRes.ok
    ? (districtRes.data.UserDistrictFindOne ?? null)
    : null;

  const curriculaLite: CurriculumLite[] = (
    curriculaRes.ok ? (curriculaRes.data.CurriculumsFindMany ?? []) : []
  )
    .filter((c) => c != null)
    .map((c) => ({
      _id: c._id,
      title: c.title ?? "Untitled",
      collectionIds: (c.curriculumCollection ?? [])
        .filter((cc) => cc != null)
        .map((cc) => cc._id),
      coverUrl: c.cover?.url ?? null,
    }));

  const collectionById = new Map(
    (collectionsRes.ok ? collectionsRes.data.curriculumCollectionFindMany : [])
      .filter((record) => record.active !== false)
      .map((record) => [record._id, record] as const),
  );

  const collections = (district?.coursesCollections ?? [])
    .filter((id): id is string => typeof id === "string")
    .flatMap((id) => {
      const record = collectionById.get(id);
      if (!record) return []; // stale id — drop silently
      const curriculumIds = deriveCourses([record._id], curriculaLite);
      return [
        {
          _id: record._id,
          name: record.name ?? "Untitled",
          subtitle: record.description ?? record.gradeLevel ?? "",
          slug: record.slug ?? "",
          curriculumIds,
          seriesCount: curriculumIds.length,
        },
      ];
    });

  const curriculumById = new Map(curriculaLite.map((c) => [c._id, c]));
  const fallbackCourses = (district?.courses ?? [])
    .filter((id): id is string => typeof id === "string")
    .flatMap((id) => {
      const curriculum = curriculumById.get(id);
      if (!curriculum) return []; // stale id — drop silently
      return [
        {
          _id: curriculum._id,
          title: curriculum.title,
          coverUrl: curriculum.coverUrl,
        },
      ];
    });

  const mode: "collections" | "courses" =
    collections.length > 0 ? "collections" : "courses";

  const error =
    districtRes.error ??
    (mode === "collections" ? collectionsRes.error : null) ??
    curriculaRes.error ??
    null;

  // Read the once-ever onboarding-welcome cookie SERVER-side and hand the flag
  // to the client so the client-side submit chain can reproduce the
  // onboarding/series navigation branch without a server round-trip (there is
  // no client-side cookie reader in `onboarding-welcome.ts`).
  const hasSeenWelcome = hasSeenOnboardingWelcome(
    request.headers.get("Cookie"),
  );

  return {
    token,
    user,
    mode,
    collections,
    fallbackCourses,
    error,
    hasSeenWelcome,
  };
}

// Classroom-icon pick validation (mirrors the prototype's AvatarUpload).
const ACCEPTED_ICON_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_ICON_SIZE_MB = 5;

const schema = z.object({
  name: z.string().min(1, "Required"),
  studentCount: z.number().int().min(1).max(50),
});

type FormValues = z.infer<typeof schema>;

export default function ClassroomCreateRoute() {
  const {
    token,
    user,
    mode,
    collections,
    fallbackCourses,
    error,
    hasSeenWelcome,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(collections[0]?._id ?? null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Classroom-icon pick: the File is held for the Phase 3 upload chain;
  // `coverPreview` is an object URL rendered instantly in the tile.
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  // Track the live object URL so we can revoke the previous one on replace and
  // on unmount (avoids leaking blob URLs).
  const objectUrlRef = useRef<string | null>(null);

  const handleIconPick = (file: File) => {
    if (!ACCEPTED_ICON_TYPES.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_ICON_SIZE_MB * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setCoverPreview(url);
    setCoverFile(file);
  };

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const toggleCourse = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const selectedCollection =
    collections.find((c) => c._id === selectedCollectionId) ?? null;
  const canCreate =
    mode === "collections"
      ? (selectedCollection?.curriculumIds.length ?? 0) > 0
      : selectedCourses.length > 0;

  useEffect(() => {
    setToken(token);
  }, [token]);

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
    },
  });

  const watchedName = watch("name") ?? "";
  const watchedCount = watch("studentCount");

  const onValid = async (values: FormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    const curriculums =
      mode === "collections"
        ? (selectedCollection?.curriculumIds ?? [])
        : selectedCourses;
    if (curriculums.length === 0) return; // belt-and-braces; button is disabled anyway
    if (!user?._id || !user.organization) {
      toast.error("Missing user context");
      return;
    }

    setSubmitting(true);
    try {
      // Client-side create (token was set on mount via setToken, so gqlClient
      // attaches `access-token`). Same variables the retired server action sent.
      const created = (
        await gqlClient.request(
          GroupCreateOneDocument,
          {
            name: values.name.trim(),
            teacher: user._id,
            platform: env.PLATFORM,
            organization: user.organization,
            curriculums,
          },
          { "access-token": token },
        )
      ).GroupCreateOne;

      const first = created?.curriculums?.[0];
      // Defensive: the create flow guards `curriculums.length === 0` before the
      // mutation, so a created group always has ≥1 curriculum — but fall back to
      // the list if the payload is somehow missing an id or curriculum.
      if (!created?._id || !first) {
        navigate("/classrooms");
        return;
      }

      // Best-effort cover upload: a failure toasts but MUST still navigate.
      if (coverFile) {
        try {
          await uploadGroupCover(created._id, coverFile);
        } catch (err) {
          toast.error(toErrorMessage(err, "Cover upload failed"));
        }
      }

      const seriesPath = `/classrooms/${created._id}/${first}`;
      // First-time creators (no seen-cookie) go through the welcome slider,
      // which sets the cookie and lands them on the series view; everyone else
      // goes straight to the series.
      if (hasSeenWelcome) {
        navigate(seriesPath);
      } else {
        navigate(
          `/onboarding/welcome?group=${created._id}&curriculum=${first}`,
        );
      }
    } catch (e) {
      toast.error(toErrorMessage(e, "Failed to create classroom"));
    } finally {
      // Navigation unmounts the route on success; this only matters on failure.
      setSubmitting(false);
    }
  };

  const initials = getInitials(watchedName.trim());

  return (
    <OnboardingLayout
      title={step === 1 ? "Name your classroom" : "Classroom preferences"}
      currentStep={step}
      totalSteps={2}
      preview={
        <div className="flex w-[340px] flex-col gap-6">
          <ClassroomInfoCard />
          <ClassroomPreviewCard name={watchedName} studentCount={watchedCount} />
        </div>
      }
    >
      <form onSubmit={handleSubmit(onValid)} className="space-y-6">
        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-foreground">
                Classroom icon
              </label>
              <ClassroomIconUpload
                initials={initials}
                previewUrl={coverPreview}
                onPick={handleIconPick}
              />
            </div>
            <Input
              label="Classroom name"
              placeholder="e.g. Mrs. Smith's 3rd Grade"
              autoComplete="off"
              {...(errors.name?.message ? { error: errors.name.message } : {})}
              {...register("name")}
            />
            <div className="space-y-3">
              <label className="block text-[14px] text-foreground font-medium">
                How many students?
              </label>
              <Slider
                value={watchedCount}
                onValueChange={(n) =>
                  setValue("studentCount", n, { shouldValidate: true })
                }
                min={1}
                max={50}
                aria-label="How many students?"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={watchedCount}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (!Number.isNaN(n)) {
                        setValue(
                          "studentCount",
                          Math.max(1, Math.min(50, n)),
                          { shouldValidate: true },
                        );
                      }
                    }}
                    containerClassName="w-20"
                    className="h-9 px-3 text-center text-sm"
                  />
                  <span className="text-sm text-muted-foreground">students</span>
                </div>
                <div className="flex items-center -space-x-2">
                  {Array.from({
                    length: Math.min(5, Math.max(0, watchedCount)),
                  }).map((_, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-muted sm:h-8 sm:w-8"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                    </span>
                  ))}
                  {watchedCount > 5 ? (
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary/10 text-[10px] font-medium text-primary sm:h-8 sm:w-8 sm:text-[11px]"
                    >
                      +{watchedCount - 5}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/classrooms")}
                className="bg-transparent border-primary text-primary hover:bg-primary/5"
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {error ? (
              <div className="rounded-[14px] border border-dashed border-red-300 bg-red-50 p-3 text-sm text-red-600">
                Couldn't load your district's experiences. Try again later.
              </div>
            ) : mode === "collections" ? (
              <div className="space-y-3">
                <p className="text-[14px] text-foreground font-medium">
                  Select experience:
                </p>
                <CollectionSelect
                  collections={collections}
                  selectedId={selectedCollectionId}
                  onSelect={setSelectedCollectionId}
                />
              </div>
            ) : fallbackCourses.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[14px] text-foreground font-medium">
                  Select courses:
                </p>
                <CourseMultiSelect
                  courses={fallbackCourses}
                  selected={selectedCourses}
                  onToggle={toggleCourse}
                />
              </div>
            ) : (
              <div className="rounded-[14px] border border-border bg-card p-3 text-sm text-muted-foreground">
                No experiences are available for your district yet. Contact
                your administrator.
              </div>
            )}
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
                loading={submitting}
                disabled={!canCreate || submitting}
                className="flex-1"
              >
                Create Classroom
              </Button>
            </div>
          </div>
        )}
      </form>
    </OnboardingLayout>
  );
}
