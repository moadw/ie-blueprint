import { useCallback, useEffect, useRef, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useParams } from "react-router";
import { setToken } from "~/lib/auth";
import { env } from "~/lib/env";
import { setLastCurriculum } from "~/lib/last-curriculum";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { toast } from "~/components/ui/toast";
import { toErrorMessage } from "~/lib/errors";
import { SortFindManyannouncementInput } from "~/gql/graphql";
import {
  GroupFindOneDocument,
  GroupProgressFindOneDocument,
} from "~/queries/groups";
import { CurriculumsFindOneDocument } from "~/queries/curriculums";
import { ClassesByCurriculumFindOneDocument } from "~/queries/classes";
import { TapFindManyDocument, TapTypeFindManyDocument } from "~/queries/taps";
import { UsersFindOneDocument } from "~/queries/users";
import { AnnouncementFindManyDocument } from "~/queries/announcements";
import { MyLikedClassesDocument } from "~/queries/class-likes";
import {
  ClassLikeCreateOneDocument,
  ClassLikeDeleteOneDocument,
} from "~/mutations/class-likes";
import { AnnouncementBar } from "~/components/ui/announcement-bar";
import { isAnnouncementDismissed } from "~/lib/announcement-dismissal";
import {
  deriveCardMediaByClass,
  type CardMediaDescriptor,
} from "./classrooms_.$groupId.$curriculumId/_components/card-media";
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
      mediaByClass: {} as Record<string, CardMediaDescriptor>,
      user: null,
      groupProgress: null,
      likedClassIds: [] as string[],
      groupError: null,
      curriculumError:
        "Platform is not configured. Please contact your administrator.",
      classesError: null,
      groupProgressError: null,
      likedError: null,
    };
  }

  const [
    groupResult,
    curriculumResult,
    classesResult,
    userResult,
    progressResult,
    tapTypesResult,
    announcementResult,
    likedResult,
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
      safe(
        // Platform-scoped tap-type catalog — resolves each tap's `type`
        // slug-vs-id for the per-card media descriptor. Mirrors the player
        // loader; degrades to raw `tap.type` on failure (no error card).
        gqlClient.request(
          TapTypeFindManyDocument,
          { filter: { platform: env.PLATFORM }, limit: 100 },
          headers,
        ),
      ),
      safe(
        // Latest active educator announcement — surfaced as the green bar at
        // the top of the page. GLOBAL: no `platform` filter (announcements
        // have no platform field). A failed fetch degrades to no bar.
        gqlClient.request(
          AnnouncementFindManyDocument,
          {
            filter: { type: "educator", active: true },
            limit: 1,
            sort: SortFindManyannouncementInput.CREATEDAT_DESC,
          },
          headers,
        ),
      ),
      safe(
        // Teacher-global liked-class set (session-scoped; no args). One fetch
        // drives every card's heart fill on this page. Non-critical chrome —
        // a failed fetch degrades to no hearts filled (like `groupProgress`).
        gqlClient.request(MyLikedClassesDocument, {}, headers),
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
  // Latest active educator announcement (global — no platform scope). A
  // failed fetch degrades to null so the green bar simply doesn't render.
  // Dismissal is resolved server-side via cookie so a closed bar never flashes
  // on reload (the server just omits it).
  const announcementRow = announcementResult.ok
    ? (announcementResult.data.AnnouncementFindMany?.[0] ?? null)
    : null;
  const announcement =
    announcementRow &&
    !isAnnouncementDismissed(request.headers.get("Cookie"), announcementRow._id)
      ? announcementRow
      : null;
  // Teacher's liked class ids, flattened to a serializable array (a Set does
  // NOT survive JSON serialization to the client). Degrades to [] on failure.
  const likedClassIds = likedResult.ok
    ? (likedResult.data.MyLikedClasses ?? [])
        .map((l) => l?.class)
        .filter((id): id is string => Boolean(id))
    : [];

  // Per-card media durations (Q1: `tap.time` read raw as minutes). Fetch the
  // curriculum's taps in ONE batched query (`class in [ids]` via the scalar
  // `_operators.class.in`) and group client-side. Wrapped in `safe()` so a
  // failed/empty fetch degrades to no pill — never a crash or error card.
  const classIds = classes
    .map((c) => c._id)
    .filter((id): id is string => Boolean(id));
  const tapTypes = tapTypesResult.ok
    ? (tapTypesResult.data.TapTypeFindMany ?? [])
    : [];
  let mediaByClass: Record<string, CardMediaDescriptor> = {};
  if (classIds.length > 0) {
    const tapsResult = await safe(
      gqlClient.request(
        TapFindManyDocument,
        {
          filter: {
            platform: env.PLATFORM,
            _operators: { class: { in: classIds } },
          },
          limit: 500,
        },
        headers,
      ),
    );
    if (tapsResult.ok) {
      const taps = (tapsResult.data.TapFindMany ?? []).filter(
        (t) => !t.deleted,
      );
      mediaByClass = deriveCardMediaByClass(taps, tapTypes);
    }
  }

  return {
    token,
    group,
    curriculum,
    classes,
    mediaByClass,
    user,
    groupProgress,
    announcement,
    likedClassIds,
    groupError: groupResult.error,
    curriculumError: curriculumResult.error,
    classesError: classesResult.error,
    groupProgressError: progressResult.error,
    announcementError: announcementResult.error,
    likedError: likedResult.error,
  };
}

export default function ClassroomCurriculumRoute() {
  const {
    token,
    group,
    curriculum,
    classes,
    mediaByClass,
    user,
    groupProgress,
    announcement,
    likedClassIds,
    groupError,
    curriculumError,
  } = useLoaderData<typeof loader>();
  const params = useParams();
  const groupId = params.groupId ?? "";
  const curriculumId = params.curriculumId ?? "";

  // Attach each class's media descriptor (shape + durations) so the slider and
  // grid cards can render their bottom-center duration pill. Order + `_id` are
  // preserved, so the hero-background index math over `classes` stays aligned.
  const lessonsWithMedia = classes.map((c) => ({
    ...c,
    media: c._id ? (mediaByClass[c._id] ?? null) : null,
  }));

  useEffect(() => {
    if (token) setToken(token);
  }, [token]);

  // Client-side favorite (heart) state, seeded from the loader's serializable
  // id list. A per-class in-flight guard drops a second toggle on a class while
  // its create/delete is still pending, preventing create/delete races.
  const [likedIds, setLikedIds] = useState(() => new Set(likedClassIds));
  const pendingRef = useRef(new Set<string>());
  const onToggleFavorite = useCallback((classId: string) => {
    if (pendingRef.current.has(classId)) return;
    pendingRef.current.add(classId);
    let wasLiked = false;
    // Optimistic flip. Snapshot `wasLiked` from the freshest state inside the
    // updater so rapid toggles compute against the true prior value.
    setLikedIds((prev) => {
      wasLiked = prev.has(classId);
      const next = new Set(prev);
      if (wasLiked) next.delete(classId);
      else next.add(classId);
      return next;
    });
    // Header-free — `setToken` (above) already primed the client middleware.
    gqlClient
      .request(
        wasLiked ? ClassLikeDeleteOneDocument : ClassLikeCreateOneDocument,
        { class: classId },
      )
      .catch((err) => {
        // Revert the optimistic change and surface the failure.
        setLikedIds((prev) => {
          const next = new Set(prev);
          if (wasLiked) next.add(classId);
          else next.delete(classId);
          return next;
        });
        toast.error(toErrorMessage(err, "Couldn't update favorite"));
      })
      .finally(() => {
        pendingRef.current.delete(classId);
      });
  }, []);

  // Remember the last curriculum viewed for this group so the card selector can
  // reopen it here next time (client-only localStorage; read in classrooms.tsx).
  useEffect(() => {
    if (groupId && curriculumId) setLastCurriculum(groupId, curriculumId);
  }, [groupId, curriculumId]);

  // Track the carousel's centered card so the hero background follows it. The
  // slider reports its index via `onIndexChange`; we seed the same initial
  // index it uses (the current practice / `nextClass`) so the first paint's
  // background already matches the centered card — no Day-1 flash before the
  // slider's mount callback lands. Background = that card's cover, falling back
  // to the curriculum's static image when a cover is missing or index is stale.
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    const nc = groupProgress?.nextClass;
    if (!nc) return 0;
    const idx = classes.findIndex((c) => c._id === nc);
    return idx >= 0 ? idx : 0;
  });
  const curriculumFallbackImage =
    curriculum?.bgImage?.url ?? curriculum?.cover?.url;
  const backgroundImage =
    classes[currentLessonIndex]?.cover?.url ?? curriculumFallbackImage;
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
      {announcement ? (
        <AnnouncementBar
          id={announcement._id}
          message={announcement.message ?? ""}
        />
      ) : null}

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
              lessons={lessonsWithMedia}
              groupId={groupId}
              curriculumId={curriculumId}
              groupProgress={groupProgress}
              likedIds={likedIds}
              onToggleFavorite={onToggleFavorite}
              onIndexChange={setCurrentLessonIndex}
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
                lessons={lessonsWithMedia}
                groupId={groupId}
                curriculumId={curriculumId}
                groupProgress={groupProgress}
                likedIds={likedIds}
                onToggleFavorite={onToggleFavorite}
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
