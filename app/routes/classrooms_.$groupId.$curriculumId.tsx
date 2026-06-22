import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useParams } from "react-router";
import { setToken } from "~/lib/auth";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import {
  GroupFindOneDocument,
  GroupProgressFindOneDocument,
} from "~/queries/groups";
import { CurriculumsFindOneDocument } from "~/queries/curriculums";
import { ClassesByCurriculumFindOneDocument } from "~/queries/classes";
import { UsersFindOneDocument } from "~/queries/users";
import { CurriculumBackground } from "./classrooms_.$groupId.$curriculumId/_components/curriculum-background";
import { CurriculumSlider } from "./classrooms_.$groupId.$curriculumId/_components/curriculum-slider";
import { ClassroomHeader } from "./classrooms_.$groupId.$curriculumId/_components/classroom-header";
import {
  CurriculumSidebar,
  CurriculumTabs,
} from "./classrooms_.$groupId.$curriculumId/_components/curriculum-sidebar";
import type { SidebarCurriculum } from "./classrooms_.$groupId.$curriculumId/_components/curriculum-sidebar";
import { LessonGrid } from "./classrooms_.$groupId.$curriculumId/_components/lesson-grid";
import { SettingsButton } from "./classrooms_.$groupId.$curriculumId/_components/settings-button";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { groupId, curriculumId } = params;
  if (!groupId) throw new Response("Group id required", { status: 400 });
  if (!curriculumId)
    throw new Response("Curriculum id required", { status: 400 });

  const token = await requireSessionToken(request);
  const headers = { "access-token": token };

  if (!env.PLATFORM) {
    return {
      token,
      group: null,
      curriculum: null,
      classes: [],
      user: null,
      groupProgress: null,
      groupError: null,
      curriculumError:
        "Platform is not configured. Please contact your administrator.",
      classesError: null,
      groupProgressError: null,
    };
  }

  const [
    groupResult,
    curriculumResult,
    classesResult,
    userResult,
    progressResult,
  ] = await Promise.all([
      safe(
        gqlClient.request(
          GroupFindOneDocument,
          { filter: { _id: groupId } },
          headers,
        ),
      ),
      safe(
        gqlClient.request(
          CurriculumsFindOneDocument,
          { filter: { _id: curriculumId, platform: env.PLATFORM } },
          headers,
        ),
      ),
      safe(
        // Teacher-safe endpoint (the admin `ClassesAdminFindMany` is role-gated).
        // Returns the curriculum's classes as an array; takes only `curriculum`,
        // so deleted-filtering and order-sorting happen client-side below.
        gqlClient.request(
          ClassesByCurriculumFindOneDocument,
          { curriculum: curriculumId },
          headers,
        ),
      ),
      safe(gqlClient.request(UsersFindOneDocument, {}, headers)),
      safe(
        // Single shared fetch driving both the header progress bar and the
        // per-card Watched/Current badges. Both params are validated above
        // (the route 400s without either), so the mandatory-both-params rule
        // for the groupprogress filter holds.
        gqlClient.request(
          GroupProgressFindOneDocument,
          { filter: { group: groupId, curriculum: curriculumId } },
          headers,
        ),
      ),
    ]);

  const group = groupResult.ok ? groupResult.data.GroupFindOne : null;
  const curriculum = curriculumResult.ok
    ? curriculumResult.data.CurriculumsFindOne
    : null;
  const classes = classesResult.ok
    ? (classesResult.data.ClassesByCurriculumFindOne ?? [])
        .filter((c): c is NonNullable<typeof c> => c != null && !c.deleted)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  // The header user is non-critical chrome — a failed fetch degrades the menu
  // to a generic "Account" label rather than surfacing an error card.
  const user = userResult.ok ? userResult.data.UsersFindOne : null;
  // Progress is non-critical chrome too — a failed/null fetch degrades the
  // bar + badges to absent (per resilient-loader convention), never a crash.
  const groupProgress = progressResult.ok
    ? progressResult.data.GroupProgressFindOne
    : null;

  return {
    token,
    group,
    curriculum,
    classes,
    user,
    groupProgress,
    groupError: groupResult.error,
    curriculumError: curriculumResult.error,
    classesError: classesResult.error,
    groupProgressError: progressResult.error,
  };
}

export default function ClassroomCurriculumRoute() {
  const {
    token,
    group,
    curriculum,
    classes,
    user,
    groupProgress,
    groupError,
    curriculumError,
  } = useLoaderData<typeof loader>();
  const params = useParams();
  const groupId = params.groupId ?? "";
  const curriculumId = params.curriculumId ?? "";

  useEffect(() => {
    if (token) setToken(token);
  }, [token]);

  const backgroundImage = curriculum?.bgImage?.url ?? curriculum?.cover?.url;
  // A failed classes fetch is NOT surfaced as a top error card — it falls
  // through to the "No practices…" empty state below (per product: the empty
  // copy is enough, no red banner above the header). Only the page-level
  // group/curriculum failures warrant a card.
  const hasErrors = Boolean(groupError || curriculumError);
  const sidebarCurriculums: SidebarCurriculum[] = (
    group?.curriculumsObj ?? []
  ).filter((c): c is SidebarCurriculum => Boolean(c?._id));

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {hasErrors ? (
        <div className="space-y-3 px-4 py-6 sm:px-6">
          {groupError ? (
            <ErrorCard label="classroom" message={groupError} />
          ) : null}
          {curriculumError ? (
            <ErrorCard label="curriculum" message={curriculumError} />
          ) : null}
        </div>
      ) : null}

      {/* Hero — blurred curriculum background + glass header + slider */}
      <section className="relative flex h-[100dvh] flex-col overflow-hidden text-white">
        <CurriculumBackground imageUrl={backgroundImage} />

        <ClassroomHeader
          group={group}
          groupId={groupId}
          curriculumId={curriculumId}
          user={user}
          groupProgress={groupProgress}
          curriculumTitle={curriculum?.title}
          totalClasses={classes.length}
        />

        <main className="relative z-10 flex flex-1 flex-col items-center pt-[clamp(0.5rem,2vh,1.5rem)]">
          {classes.length > 0 ? (
            <CurriculumSlider
              key={curriculum?._id}
              lessons={classes}
              groupId={groupId}
              curriculumId={curriculumId}
              groupProgress={groupProgress}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 text-center">
              <p className="font-serif text-xl text-white/70">
                No practices in this curriculum yet.
              </p>
            </div>
          )}
        </main>
      </section>

      {/* All lessons — sticky left nav + responsive lesson grid */}
      <section
        id="all-lessons"
        className="relative z-10 min-h-screen bg-zinc-900"
      >
        <CurriculumTabs
          curriculums={sidebarCurriculums}
          groupId={groupId}
          curriculumId={curriculumId}
        />

        <div className="flex">
          <CurriculumSidebar
            curriculums={sidebarCurriculums}
            groupId={groupId}
            curriculumId={curriculumId}
          />

          <main className="flex-1 px-4 py-6 lg:px-12 lg:py-12">
            <div className="mb-6 lg:mb-8">
              <h2 className="mb-2 font-serif text-2xl text-white lg:text-4xl">
                {curriculum?.title ?? "All Lessons"}
              </h2>
              <p className="font-sans text-sm text-zinc-400 lg:text-base">
                Explore every lesson in this curriculum.
              </p>
            </div>

            {classes.length > 0 ? (
              <LessonGrid
                lessons={classes}
                groupId={groupId}
                curriculumId={curriculumId}
                groupProgress={groupProgress}
              />
            ) : (
              <p className="font-serif text-base text-zinc-400">
                No practices in this curriculum yet.
              </p>
            )}
          </main>
        </div>
      </section>

      <SettingsButton />
    </div>
  );
}

function ErrorCard({ label, message }: { label: string; message: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
      <p className="mb-1 text-sm font-medium text-red-700">
        Couldn't load {label}
      </p>
      <p className="text-xs text-red-600">{message}</p>
    </div>
  );
}
