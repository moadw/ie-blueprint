import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { requireSessionToken } from "~/lib/session.server";
import { safe } from "~/lib/safe-loader";
import { TapFindManyDocument, TapTypeFindManyDocument } from "~/queries/taps";
import { SortFindManytapInput } from "~/gql/graphql";
import { JournalScreen } from "~/components/lesson/journal-screen";
import {
  buildTapTypeResolver,
  isJournalTap,
  journalPromptForTap,
} from "./classrooms_.$groupId.$curriculumId_.$lessonId/_components/practice-steps";

/**
 * Standalone journal sub-route loader.
 *
 * NOTE: the `:lessonId` route param carries a **class** `_id`, not a lesson id
 * (the segment name is intentionally NOT renamed — see the main detail route).
 *
 * Mirrors the main detail route's loader: resolve the session, guard the params
 * + `env.PLATFORM`, then fetch the class's taps (ordered) and the tap-type
 * catalog under `safe()`. The catalog drives the slug-vs-id resolver so we can
 * find the FIRST tap whose resolved type is `journal` and derive its prompt.
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
      prompt: "",
      tapsError:
        "Platform is not configured. Please contact your administrator.",
    };
  }

  const [tapsResult, tapTypesResult] = await Promise.all([
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
      // Tap types are a small global enum; keep this unfiltered (matching the
      // main route) so the slug/id resolver map is always populated.
      gqlClient.request(TapTypeFindManyDocument, { limit: 100 }, headers),
    ),
  ]);

  // Soft delete = { deleted: true }; filter client-side then order by `order`.
  const taps = tapsResult.ok
    ? (tapsResult.data.TapFindMany ?? [])
        .filter((t) => !t.deleted)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const tapTypes = tapTypesResult.ok
    ? (tapTypesResult.data.TapTypeFindMany ?? [])
    : [];

  const resolver = buildTapTypeResolver(tapTypes);
  const journalTap = taps.find((t) => isJournalTap(t, resolver));
  const prompt = journalTap ? journalPromptForTap(journalTap) : "";

  return {
    groupId,
    curriculumId,
    lessonId,
    prompt,
    tapsError: tapsResult.error,
  };
}

export default function JournalRoute() {
  const { groupId, curriculumId, prompt, tapsError } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const back = () => navigate(`/classrooms/${groupId}/${curriculumId}`);

  // Soft inline error card — never white-screen on a backend 500.
  if (tapsError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
        <ErrorCard label="journal" message={tapsError} />
      </div>
    );
  }

  // No journal tap on this class → clean empty state.
  if (!prompt) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 px-6 text-center text-white">
        <p className="font-serif text-xl text-white/70">
          This practice doesn&apos;t have a journal prompt.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white">
      <JournalScreen prompt={prompt} onSubmit={back} onSkip={back} />
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
