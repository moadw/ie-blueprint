import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { BookOpen } from "lucide-react";

import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { requireSessionToken } from "~/lib/session.server";
import { SortFindManyjournalsInput } from "~/gql/graphql";
import type { JournalsFindManyQuery } from "~/gql/graphql";
import { JournalsFindManyDocument } from "~/queries/journals";
import { UsersFindOneDocument } from "~/queries/users";
import { JournalEntryCard } from "~/routes/settings/_components/journal-entry-card";
import { SectionHeader } from "~/routes/settings/_components/section-header";
import type { JournalEntry } from "~/routes/settings/_fixtures";

type JournalRecord = JournalsFindManyQuery["JournalsFindMany"][number];

// Format a journal `createdAt` into the card's display string, e.g.
// "Jun 10, 2026". The backend may hand back epoch millis as a plain-digit
// string (same coercion as relative-time.ts), so convert those to Number
// before constructing the Date.
function formatJournalDate(value: unknown): string {
  if (value == null) return "";
  const input =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  const date = new Date(input as string | number);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Map a Blueprint `journals` record onto the card's view model. `title` is
// intentionally omitted — the journal record carries no denormalized practice
// title (only class/lesson ids), and resolving those is out of scope here.
// Optional props are spread in conditionally to satisfy
// `exactOptionalPropertyTypes` (never set to `undefined`).
function toEntry(journal: JournalRecord): JournalEntry {
  const image = journal.documents?.find(
    (doc): doc is NonNullable<typeof doc> =>
      doc?.type === "image" && !!doc.url,
  );
  return {
    id: journal._id,
    date: formatJournalDate(journal.createdAt),
    content: journal.body ?? "",
    ...(journal.question ? { prompt: journal.question } : {}),
    ...(image?.url ? { imageUrl: image.url } : {}),
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);

  // Resolve the signed-in teacher's id — journals are filtered by their
  // dedicated `teacher` field, which holds this user id.
  const userResult = await safe(
    gqlClient.request(UsersFindOneDocument, {}, { "access-token": token }),
  );
  if (!userResult.ok) {
    return { entries: [] as JournalEntry[], error: userResult.error };
  }

  const user = userResult.data.UsersFindOne;
  if (!user?._id) {
    return {
      entries: [] as JournalEntry[],
      error: "Couldn't identify the signed-in teacher.",
    };
  }

  const journalsResult = await safe(
    gqlClient.request(
      JournalsFindManyDocument,
      {
        filter: { teacher: user._id },
        sort: SortFindManyjournalsInput._ID_DESC,
        limit: 100,
      },
      { "access-token": token },
    ),
  );

  const entries = journalsResult.ok
    ? journalsResult.data.JournalsFindMany.map(toEntry)
    : [];

  return { entries, error: journalsResult.ok ? null : journalsResult.error };
}

export default function SettingsJournalsRoute() {
  const { entries, error } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="My Journals"
        subtitle="Your personal reflection space for mindfulness practice."
      />

      {error ? (
        <div className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/70 px-6 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load your journals
          </p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      ) : entries.length > 0 ? (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-[24px] bg-muted flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No journal entries yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start capturing your thoughts and reflections after completing
            practices.
          </p>
        </div>
      )}
    </div>
  );
}
