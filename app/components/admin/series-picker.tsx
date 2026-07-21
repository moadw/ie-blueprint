import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

/** A series (curriculum) option the picker can render and select. */
export interface SeriesOption {
  _id: string;
  title: string;
  description?: string | null;
}

export interface SeriesPickerProps {
  /**
   * Options to choose from. The caller is responsible for ordering (Phase 3
   * pre-sorts A–Z by title); the picker preserves the incoming order and only
   * re-applies the local text filter on top of it.
   */
  options: SeriesOption[];
  /** Controlled selection — the `_id` of the selected option, or `null`. */
  value: string | null;
  /** Emits the `_id` of a newly selected option. */
  onChange: (id: string) => void;
  /** Show a loading state instead of the list (data still in flight). */
  loading?: boolean;
  /** Disable interaction (e.g. while a parent save is in flight). */
  disabled?: boolean;
  className?: string;
}

/**
 * Controlled, searchable single-select list of series (curriculums).
 *
 * Purely driven by props — it never fetches. A text field filters the injected
 * `options` locally (case-insensitive over title + description); the scrollable
 * list renders one focusable row per match, each showing the title (medium) and
 * an ellipsised one-line description, with the selected row highlighted.
 */
export function SeriesPicker({
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
  className,
}: SeriesPickerProps) {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (q === "") return options;
    return options.filter((option) => {
      const title = option.title.toLowerCase();
      const description = (option.description ?? "").toLowerCase();
      return title.includes(q) || description.includes(q);
    });
  }, [options, trimmedQuery]);

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        type="text"
        placeholder="Search series…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={disabled || loading}
        aria-label="Search series"
      />

      <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border bg-card p-1">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading series…
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-2.5 py-6 text-center text-sm text-muted-foreground">
            {trimmedQuery === ""
              ? "No series available"
              : `No series match "${trimmedQuery}"`}
          </p>
        ) : (
          filtered.map((option) => {
            const selected = option._id === value;
            return (
              <button
                key={option._id}
                type="button"
                onClick={() => onChange(option._id)}
                disabled={disabled}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  selected && "bg-muted",
                )}
              >
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  {selected ? (
                    <Check
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-medium text-foreground">
                    {option.title}
                  </span>
                  {option.description ? (
                    <span className="text-muted-foreground">
                      {" — "}
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SeriesPicker;
