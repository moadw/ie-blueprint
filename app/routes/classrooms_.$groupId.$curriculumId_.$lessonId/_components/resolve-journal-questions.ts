// Server-side resolver for journal prompts. A journal tap stores its prompt as
// a `questions` entity id in `extraQuestions[0].question` (NOT the prompt text),
// so the player has to look the id up to show the real question. Kept out of the
// pure `practice-steps.ts` mapping because it performs network calls.

import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { QuestionsFindManyDocument } from "~/queries/questions";
import { isJournalTap, journalQuestionId } from "./practice-steps";
import type { PracticeTap } from "./practice-steps";

/**
 * Resolve the `questions.label` text for every journal tap's prompt id. Mirrors
 * the admin `tap-blocks.tsx`: look each id up by EXACT id (`{ filter: { _id } }`,
 * one request per id) rather than a `filter: {}` scan, which has no limit and
 * can silently miss records. Lookups run in parallel under `safe()` so a backend
 * 500 degrades to "unresolved" instead of throwing.
 *
 * Returns an id → label map; ids that fail to resolve are omitted, so the caller
 * (`journalPromptForTap`) falls back to `tap.intro` / empty rather than a UUID.
 */
export async function resolveJournalQuestionLabels(
  taps: readonly PracticeTap[],
  resolver: ReadonlyMap<string, string>,
  headers: Record<string, string>,
): Promise<Record<string, string>> {
  const ids = Array.from(
    new Set(
      taps
        .filter((t) => isJournalTap(t, resolver))
        .map((t) => journalQuestionId(t))
        .filter((id): id is string => id != null),
    ),
  );
  if (ids.length === 0) return {};

  const results = await Promise.all(
    ids.map(async (id) => {
      const result = await safe(
        gqlClient.request(
          QuestionsFindManyDocument,
          { filter: { _id: id } },
          headers,
        ),
      );
      const label = result.ok
        ? (result.data.QuestionsFindMany?.[0]?.label ?? null)
        : null;
      return { id, label };
    }),
  );

  const labels: Record<string, string> = {};
  for (const { id, label } of results) {
    if (label != null) labels[id] = label;
  }
  return labels;
}
