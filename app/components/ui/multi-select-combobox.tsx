import { useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  /** Optional leading avatar/thumbnail; rendered as a small circle when set. */
  imageUrl?: string | null;
}

export interface MultiSelectComboboxProps {
  options: MultiSelectOption[];
  /** Selected option values, in the order they were added. */
  selected: string[];
  onChange: (next: string[]) => void;
  /** Trigger text (the field always reads as an "add" affordance). */
  placeholder?: string;
  searchPlaceholder?: string;
  /** Dropdown message when there are no options at all. */
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

function OptionAvatar({ url }: { url: string | null | undefined }) {
  if (!url) return null;
  return (
    <img src={url} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
  );
}

/**
 * Searchable multi-select: a select-style trigger opens a popover with a local
 * search filter over an alphabetically-sorted option list; clicking an option
 * adds it and it moves to the removable list rendered below the field. Keeps a
 * plain `string[]` value contract so it drops into existing form state. Radix
 * `Popover` supplies click-outside + Escape dismissal.
 */
export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No options available.",
  disabled = false,
  id,
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const selectedSet = new Set(selected);
  // Alphabetical, minus already-selected, then the local name filter.
  const available = [...options]
    .sort((a, b) => a.label.localeCompare(b.label))
    .filter(
      (opt) =>
        !selectedSet.has(opt.value) &&
        (q === "" || opt.label.toLowerCase().includes(q)),
    );

  // Selected rows follow add-order (the `selected` array order). Fall back to a
  // bare row when an id has no matching option (stale value never disappears).
  const selectedOptions: MultiSelectOption[] = selected.map(
    (value) =>
      options.find((opt) => opt.value === value) ?? {
        value,
        label: value,
        imageUrl: null,
      },
  );

  function add(value: string) {
    if (!selectedSet.has(value)) onChange([...selected, value]);
    // Reset the filter and keep focus so several items can be added in a row.
    setQuery("");
    searchRef.current?.focus();
  }
  function remove(value: string) {
    onChange(selected.filter((v) => v !== value));
  }

  const noResultsText =
    options.length === 0 ? emptyText : q ? "No matches." : "All added.";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="truncate">{placeholder}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          onOpenAutoFocus={(e) => {
            // Focus the search input instead of the content container.
            e.preventDefault();
            searchRef.current?.focus();
          }}
          className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-border bg-card p-0 shadow-lg"
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {available.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                {noResultsText}
              </p>
            ) : (
              available.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => add(opt.value)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none"
                >
                  <OptionAvatar url={opt.imageUrl} />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {selectedOptions.map((opt) => (
            <li
              key={opt.value}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground"
            >
              <OptionAvatar url={opt.imageUrl} />
              <span className="flex-1 truncate">{opt.label}</span>
              <button
                type="button"
                onClick={() => remove(opt.value)}
                aria-label={`Remove ${opt.label}`}
                className="shrink-0 rounded text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
