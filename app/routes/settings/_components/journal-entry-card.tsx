import { useState } from "react";
import { Calendar, Image as ImageIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import type { JournalEntry } from "~/routes/settings/_fixtures";

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group rounded-xl border bg-card p-4 transition-all cursor-pointer hover:shadow-sm",
        expanded && "ring-2 ring-primary/20",
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex gap-4">
        {/* Cover thumbnail */}
        {entry.coverImageUrl && (
          <div className="w-16 h-16 rounded-[16px] overflow-hidden flex-shrink-0">
            <img
              src={entry.coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Calendar className="h-3 w-3" />
            <span>{entry.date}</span>
            {entry.imageUrl && (
              <>
                <span>•</span>
                <ImageIcon className="h-3 w-3" />
              </>
            )}
          </div>

          {/* Practice title */}
          {entry.title && (
            <h4 className="font-medium text-foreground mb-1 truncate">
              {entry.title}
            </h4>
          )}

          {/* Prompt */}
          {entry.prompt && (
            <p className="text-sm text-muted-foreground italic mb-2">
              "{entry.prompt}"
            </p>
          )}

          {/* Content preview / full */}
          {expanded ? (
            <div className="space-y-3">
              <p className="text-sm text-foreground whitespace-pre-line">
                {entry.content}
              </p>
              {entry.imageUrl && (
                <img
                  src={entry.imageUrl}
                  alt="Journal attachment"
                  className="rounded-[16px] max-h-64 object-cover"
                />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {entry.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
