import { Link, useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Play } from "lucide-react";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { keepTapForLang, pickLocalized, readLanguage } from "~/lib/language";
import { ClassesFindOneDocument } from "~/queries/classes";
import { TapFindManyDocument, TapTypeFindManyDocument } from "~/queries/taps";
import { SortFindManytapInput } from "~/gql/graphql";
import { SliderStage } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/slider-stage";
import {
  buildSliderStep,
  buildTapTypeResolver,
  isPreviewTap,
} from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/practice-steps";

// Glass pill recipe — the same white-translucent + backdrop-blur + light-border
// treatment used by `slider-stage.tsx`'s Back button (and `player-stage.tsx` /
// `player-controls.tsx`). Reused verbatim so the top-right "Start Lesson With
// Students" action mirrors the Back button's glass exactly.
const GLASS = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
} as const;

/**
 * Educator PREVIEW route loader.
 *
 * NOTE: the `:lessonId` route param carries a **class** `_id`, not a lesson id
 * (the segment name is intentionally NOT renamed — see the main detail route).
 *
 * This route reuses the slider viewer to show ONLY a class's `preview` taps for
 * an educator preview — it writes ZERO progress. Accordingly the loader fetches
 * a DELIBERATELY MINIMAL slice: only the class (for its title), its taps
 * (ordered), and the tap-type catalog (to resolve `tap.type` slug-vs-id). It
 * does NOT fetch group-progress, pin, feedback, or user-likes — none of
 * the completion/analytics machinery of the student lesson applies here.
 *
 * `previewTaps` is the full ordered, non-deleted, language-filtered tap list;
 * the component narrows it to `preview` taps via `isPreviewTap`.
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const { groupId, curriculumId, lessonId } = params;
  if (!groupId || !curriculumId || !lessonId) {
    throw new Response("Not Found", { status: 404 });
  }

  const headers = { "access-token": token };

  // Active language for THIS classroom (per-group cookie) — drives the tap
  // filter + title localization, matching the lesson loader.
  const lang = readLanguage(request.headers.get("Cookie"), groupId);

  if (!env.PLATFORM) {
    return {
      groupId,
      curriculumId,
      lessonId,
      classItem: null,
      previewTaps: [],
      tapTypes: [],
      error: "Platform is not configured. Please contact your administrator.",
    };
  }

  const [classResult, tapsResult, tapTypesResult] = await Promise.all([
    safe(
      // Teacher-safe single-class fetch (`ClassesFindOne` takes `_id` directly).
      gqlClient.request(ClassesFindOneDocument, { _id: lessonId }, headers),
    ),
    safe(
      gqlClient.request(
        TapFindManyDocument,
        {
          filter: { class: lessonId, platform: env.PLATFORM },
          limit: 100,
          sort: SortFindManytapInput.ORDER_ASC,
        },
        headers,
      ),
    ),
    safe(
      // Scope tap-types to this platform (matching the lesson route): the catalog
      // is shared across products; IE owns a small subset. Resolution degrades
      // gracefully via the raw-slug fallback if a type is excluded.
      gqlClient.request(
        TapTypeFindManyDocument,
        { filter: { platform: env.PLATFORM }, limit: 100 },
        headers,
      ),
    ),
  ]);

  // Localize the class title from the per-group language cookie (ES→EN
  // per-field fallback), mirroring the lesson loader.
  const rawClassItem = classResult.ok ? classResult.data.ClassesFindOne : null;
  const classItem = rawClassItem
    ? (() => {
        const { title, description } = pickLocalized(
          rawClassItem,
          rawClassItem.language?.spanish,
          lang,
        );
        return {
          ...rawClassItem,
          title: title ?? rawClassItem.title,
          description: description ?? rawClassItem.description,
        };
      })()
    : null;

  // Soft delete = { deleted: true }; filter client-side, drop opposite-language
  // taps, then order by `order` (matches the lesson loader). The component
  // narrows this to `preview` taps.
  const previewTaps = tapsResult.ok
    ? (tapsResult.data.TapFindMany ?? [])
        .filter((t) => !t.deleted && keepTapForLang(t.language, lang))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const tapTypes = tapTypesResult.ok
    ? (tapTypesResult.data.TapTypeFindMany ?? [])
    : [];

  // Single soft-error signal for the two critical fetches (tap-types degrades
  // silently via the raw-slug fallback, so it never surfaces an error card).
  const error = classResult.error ?? tapsResult.error;

  return { groupId, curriculumId, lessonId, classItem, previewTaps, tapTypes, error };
}

export default function LessonPreviewRoute() {
  const { groupId, curriculumId, lessonId, classItem, previewTaps, tapTypes, error } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const startLesson = () =>
    navigate(`/classrooms/${groupId}/${curriculumId}/${lessonId}`);
  const exitToCurriculum = () =>
    navigate(`/classrooms/${groupId}/${curriculumId}`);

  // Soft inline error card — never white-screen on a backend 500.
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
        <ErrorCard label="preview" message={error} />
      </div>
    );
  }

  const resolver = buildTapTypeResolver(tapTypes);
  const slides =
    buildSliderStep(previewTaps.filter((t) => isPreviewTap(t, resolver)))
      ?.slides ?? [];

  // No preview slides → keep the UI mounted (no hard redirect) and offer a link
  // into the normal lesson instead.
  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden bg-slate-950 px-6 text-center text-white">
        <p className="font-serif text-xl text-white/70">
          This practice doesn&apos;t have an educator preview.
        </p>
        <Link
          to={`/classrooms/${groupId}/${curriculumId}/${lessonId}`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={GLASS}
        >
          <Play className="h-4 w-4" />
          Start Lesson
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      <SliderStage
        slides={slides}
        title={classItem?.title ?? ""}
        subtitle="EDUCATOR PREVIEW"
        headerAction={
          <button
            type="button"
            onClick={startLesson}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={GLASS}
          >
            <Play className="h-4 w-4" />
            <span className="text-sm font-medium">Start Lesson With Students</span>
          </button>
        }
        onExit={exitToCurriculum}
        // NO-PROGRESS CONTRACT: the educator preview NEVER records completion or
        // writes any progress/analytics. Reaching the last slide and advancing
        // past it are deliberate no-ops (unlike the student lesson's SliderStage,
        // which records completion here). Do NOT wire the completion mutation, a
        // group-progress fetch, or practice-completed analytics into this route.
        onReachLastSlide={() => {
          /* no-op: educator preview writes no progress */
        }}
        onAdvancePastEnd={() => {
          /* no-op: stay on the last slide; educator preview never completes */
        }}
      />
    </div>
  );
}

function ErrorCard({ label, message }: { label: string; message: string }) {
  return (
    <div className="max-w-md rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
      <p className="mb-1 text-sm font-medium text-red-700">
        Couldn&apos;t load {label}
      </p>
      <p className="text-xs text-red-600">{message}</p>
    </div>
  );
}
