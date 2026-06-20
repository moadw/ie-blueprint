import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { ClassesAdminFindOneDocument } from "~/queries/classes";
import { PinFindManyDocument } from "~/queries/pins";
import { MilestoneScreen } from "~/components/lesson/milestone-screen";
import { milestonePropsForPin } from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/practice-steps";

/**
 * Standalone achievement sub-route loader.
 *
 * NOTE: the `:lessonId` route param carries a **class** `_id`, not a lesson id
 * (the segment name is intentionally NOT renamed — see the main detail route).
 *
 * Mirrors the main detail route's loader: resolve the session, guard the params
 * + `env.PLATFORM`, then fetch the class (for its title) and its optional pin
 * under `safe()`. The pin → `MilestoneScreen` mapping is shared with the main
 * route via `milestonePropsForPin`.
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  const { groupId, curriculumId, lessonId } = params;
  if (!groupId || !curriculumId || !lessonId) {
    throw new Response("Not Found", { status: 404 });
  }

  const headers = { "access-token": token };

  if (!env.PLATFORM) {
    return {
      groupId,
      curriculumId,
      lessonId,
      classTitle: null,
      pin: null,
      pinError:
        "Platform is not configured. Please contact your administrator.",
    };
  }

  const [classResult, pinResult] = await Promise.all([
    safe(
      gqlClient.request(
        ClassesAdminFindOneDocument,
        { filter: { _id: lessonId } },
        headers,
      ),
    ),
    safe(
      gqlClient.request(
        PinFindManyDocument,
        { filter: { class: lessonId, platform: env.PLATFORM }, limit: 1 },
        headers,
      ),
    ),
  ]);

  const classTitle = classResult.ok
    ? (classResult.data.ClassesAdminFindOne?.title ?? null)
    : null;

  // 0–1 pin per class; the pin's soft-delete flag is `deletedAt`.
  const pin = pinResult.ok
    ? ((pinResult.data.PinFindMany ?? []).find((p) => !p.deletedAt) ?? null)
    : null;

  return {
    groupId,
    curriculumId,
    lessonId,
    classTitle,
    pin,
    pinError: pinResult.error,
  };
}

export default function AchievementRoute() {
  const { groupId, curriculumId, classTitle, pin, pinError } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const back = () => navigate(`/classrooms/${groupId}/${curriculumId}`);

  // Soft inline error card — never white-screen on a backend 500.
  if (pinError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
        <ErrorCard label="achievement" message={pinError} />
      </div>
    );
  }

  // No pin on this class → clean empty state.
  if (!pin) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 px-6 text-center text-white">
        <p className="font-serif text-xl text-white/70">
          This practice doesn&apos;t have an achievement yet.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      <MilestoneScreen
        {...milestonePropsForPin(pin, classTitle)}
        onContinue={back}
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
