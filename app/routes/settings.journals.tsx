import { BookOpen } from "lucide-react";

import { JournalEntryCard } from "~/routes/settings/_components/journal-entry-card";
import { SectionHeader } from "~/routes/settings/_components/section-header";
import { journalsFixture } from "~/routes/settings/_fixtures";

export default function SettingsJournalsRoute() {
  const entries = journalsFixture;

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="My Journals"
        subtitle="Your personal reflection space for mindfulness practice."
      />

      {entries.length > 0 ? (
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
