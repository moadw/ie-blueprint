import { useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  /** Currently-selected value, or null when nothing is chosen. */
  value: string | null;
  onChange: (value: string) => void;
  /** Trigger text shown when nothing is selected. */
  placeholder?: string;
  searchPlaceholder?: string;
  /** Dropdown message shown when there are no options at all. */
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * Searchable single-select combobox: a select-style trigger opens a popover
 * with a local, alphabetically-sorted, client-side `.includes()` name filter
 * over the options; clicking one sets the value and closes the popover. The
 * single-value sibling of `MultiSelectCombobox` — same Radix `Popover` + plain
 * filtered `<input>` recipe (no `cmdk` dependency), just one selected value
 * instead of a removable list. Backs the onboarding school picker and is
 * reusable for any "search one of many" field.
 */
export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No options available.",
  disabled = false,
  id,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  // Alphabetical, then the local name filter.
  const filtered = [...options]
    .sort((a, b) => a.label.localeCompare(b.label))
    .filter((opt) => q === "" || opt.label.toLowerCase().includes(q));

  const selectedOption = options.find((opt) => opt.value === value) ?? null;

  function select(next: string) {
    onChange(next);
    setQuery("");
    setOpen(false);
  }

  const noResultsText = options.length === 0 ? emptyText : "No matches.";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            "flex h-[52px] w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60",
            selectedOption ? "text-foreground" : "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
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
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {noResultsText}
            </p>
          ) : (
            filtered.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => select(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none",
                    active && "bg-muted",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {active ? (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
