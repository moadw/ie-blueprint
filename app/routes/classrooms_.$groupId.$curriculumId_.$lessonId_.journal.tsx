import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireSessionToken } from "~/lib/session.server";
import { JournalScreen } from "~/components/lesson/journal-screen";
import { SAMPLE_VIDEO_URL } from "~/components/lesson/fixtures";

/**
 * Auth-shell loader: resolve the session (redirects to /login when absent)
 * and guard the route params. NO domain fetch — the standalone journal page
 * renders against local fixtures at this stage (see plan Phase 2), so no
 * `safe()` wrapper is needed.
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireSessionToken(request);
  const { groupId, curriculumId, lessonId } = params;
  if (!groupId || !curriculumId || !lessonId) {
    throw new Response("Not Found", { status: 404 });
  }
  return { groupId, curriculumId, lessonId };
}

export default function JournalRoute() {
  const { groupId, curriculumId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const back = () => navigate(`/classrooms/${groupId}/${curriculumId}`);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      <JournalScreen
        prompt={
          <>
            What unique qualities make you, <em>you</em>, and how can you share
            those special gifts with the world today?
          </>
        }
        videoUrl={SAMPLE_VIDEO_URL}
        onSubmit={back}
        onSkip={back}
      />
    </div>
  );
}
