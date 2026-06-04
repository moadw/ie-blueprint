import { useCallback, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireSessionToken } from "~/lib/session.server";
import { PlayerStage } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/player-stage";
import { JournalScreen } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/journal-screen";
import { MilestoneScreen } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/milestone-screen";
import { FeedbackOverlay } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/feedback-overlay";

type AfterScreen = "journal" | "milestone" | "feedback";
type MediaType = "audio" | "video";
type Stage = "player" | AfterScreen;

const AFTER_VALUES: readonly AfterScreen[] = ["journal", "milestone", "feedback"];
const MEDIA_VALUES: readonly MediaType[] = ["audio", "video"];

/**
 * Auth-shell loader: resolve the session (redirects to /login when absent)
 * and guard the route params. NO domain fetch — the lesson player renders
 * against local fixtures at this stage (see plan Phase 1).
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireSessionToken(request);
  const { groupId, curriculumId, lessonId } = params;
  if (!groupId || !curriculumId || !lessonId) {
    throw new Response("Not Found", { status: 404 });
  }
  return { groupId, curriculumId, lessonId };
}

export default function LessonPlayerRoute() {
  const { groupId, curriculumId } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const afterParam = searchParams.get("after");
  const after: AfterScreen = AFTER_VALUES.includes(afterParam as AfterScreen)
    ? (afterParam as AfterScreen)
    : "journal";

  const mediaParam = searchParams.get("media");
  const media: MediaType = MEDIA_VALUES.includes(mediaParam as MediaType)
    ? (mediaParam as MediaType)
    : "video";

  const [stage, setStage] = useState<Stage>("player");

  const exitToCurriculum = useCallback(() => {
    navigate(`/classrooms/${groupId}/${curriculumId}`);
  }, [navigate, groupId, curriculumId]);

  const handleEnded = useCallback(() => {
    setStage(after);
  }, [after]);

  // Feedback is an overlay: the player stays mounted (paused) behind it.
  const showFeedback = stage === "feedback";
  const showPlayer = stage === "player" || showFeedback;

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      {showPlayer ? (
        <PlayerStage
          media={media}
          showFeedback={showFeedback}
          onExit={exitToCurriculum}
          onEnded={handleEnded}
        />
      ) : null}

      {stage === "journal" ? <JournalScreen onExit={exitToCurriculum} /> : null}
      {stage === "milestone" ? (
        <MilestoneScreen onContinue={exitToCurriculum} />
      ) : null}
      {showFeedback ? <FeedbackOverlay onExit={exitToCurriculum} /> : null}
    </div>
  );
}
