import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireSessionToken } from "~/lib/session.server";
import { MilestoneScreen } from "~/components/lesson/milestone-screen";
import {
  MOCK_MILESTONE,
  SAMPLE_MILESTONE_DAY,
  SAMPLE_VIDEO_URL,
} from "~/components/lesson/fixtures";

/**
 * Auth-shell loader: resolve the session (redirects to /login when absent)
 * and guard the route params. NO domain fetch — the achievement page renders
 * against local fixtures at this stage (see plan Phase 3), so no `safe()`.
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireSessionToken(request);
  const { groupId, curriculumId, lessonId } = params;
  if (!groupId || !curriculumId || !lessonId) {
    throw new Response("Not Found", { status: 404 });
  }
  return { groupId, curriculumId, lessonId };
}

export default function AchievementRoute() {
  const { groupId, curriculumId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const back = () => navigate(`/classrooms/${groupId}/${curriculumId}`);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      <MilestoneScreen
        title={MOCK_MILESTONE.title}
        message={MOCK_MILESTONE.message}
        iconKey={MOCK_MILESTONE.iconKey}
        color={MOCK_MILESTONE.color}
        glowColor={MOCK_MILESTONE.glowColor}
        subtitle={`Day ${SAMPLE_MILESTONE_DAY} Complete`}
        videoUrl={SAMPLE_VIDEO_URL}
        onContinue={back}
      />
    </div>
  );
}
