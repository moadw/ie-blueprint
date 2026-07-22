import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import type {
  DistrictSearchOption,
  DistrictSearchResourceData,
} from "~/routes/resources.district-search";

export type { DistrictSearchOption } from "~/routes/resources.district-search";

export interface DistrictComboboxProps {
  /** Currently-selected district, or null when nothing is chosen. */
  value: DistrictSearchOption | null;
  onChange: (value: DistrictSearchOption | null) => void;
  /** Trigger text shown when nothing is selected. */
  placeholder?: string;
  searchPlaceholder?: string;
  /**
   * When true, a reset row (labelled `clearLabel`) sits atop the list and lets
   * the user return to the "nothing selected" state — used for filters where
   * empty means "all districts". Without it there is no way to deselect.
   */
  allowClear?: boolean;
  clearLabel?: string;
  /** Page size for the autocomplete (server default is 10). */
  limit?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

const RESOURCE_URL = "/resources/district-search";

/**
 * Async single-select district picker: a select-style trigger opens a popover
 * with a debounced, server-side, name-ordered search over ALL districts (via
 * the `/resources/district-search` resource route + `DistrictSearch`), not just
 * a preloaded page. Shows the first `limit` alphabetically on open, then
 * fuzzy-matches as the user types. Reuses the same Popover + filtered-input
 * recipe as `SearchableSelect`, but fetches its options instead of taking them
 * as a prop — so callers never have to load the full district list. Reusable
 * anywhere a district needs picking (user filter, user create/edit, …).
 */
export function DistrictCombobox({
  value,
  onChange,
  placeholder = "Select district",
  searchPlaceholder = "Search districts…",
  allowClear = false,
  clearLabel = "All districts",
  limit = 10,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel,
}: DistrictComboboxProps) {
  const fetcher = useFetcher<DistrictSearchResourceData>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  // `fetcher.load`'s identity is not guaranteed stable across renders; hold it
  // in a ref so the debounced effect below depends only on open/query and never
  // re-fires into a load loop when `fetcher.data` updates.
  const loadRef = useRef(fetcher.load);
  loadRef.current = fetcher.load;

  // (Re)load whenever the popover is open and the query changes. Empty query
  // loads immediately (first page on open); typing is debounced.
  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    const params = new URLSearchParams({ limit: String(limit) });
    if (trimmed) params.set("q", trimmed);
    const handle = setTimeout(
      () => loadRef.current(`${RESOURCE_URL}?${params.toString()}`),
      trimmed ? 250 : 0,
    );
    return () => clearTimeout(handle);
  }, [open, query, limit]);

  const districts = fetcher.data?.districts ?? [];
  const loading = fetcher.state !== "idle";
  const loadedOnce = fetcher.data !== undefined;

  function select(next: DistrictSearchOption | null) {
    onChange(next);
    setQuery("");
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60",
            value ? "text-foreground" : "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {value ? value.name || "Unnamed district" : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          searchRef.current?.focus();
        }}
        className="w-[var(--radix-popover-trigger-width)] min-w-[220px] overflow-hidden rounded-xl border border-border bg-card p-0 shadow-lg"
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
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : null}
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {allowClear ? (
            <button
              type="button"
              onClick={() => select(null)}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted focus:bg-muted focus:outline-none",
                value === null && "bg-muted",
              )}
            >
              <span className="flex items-center gap-2">
                <X className="h-3.5 w-3.5 shrink-0" />
                {clearLabel}
              </span>
              {value === null ? (
                <Check className="h-4 w-4 shrink-0 text-primary" />
              ) : null}
            </button>
          ) : null}

          {districts.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {!loadedOnce || loading
                ? "Loading…"
                : query.trim()
                  ? "No matches."
                  : "No districts available."}
            </p>
          ) : (
            districts.map((d) => {
              const active = value?._id === d._id;
              return (
                <button
                  key={d._id}
                  type="button"
                  onClick={() => select(d)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none",
                    active && "bg-muted",
                  )}
                >
                  <span className="min-w-0 truncate">
                    {d.name || "Unnamed district"}
                    {d.state ? (
                      <span className="text-muted-foreground"> · {d.state}</span>
                    ) : null}
                  </span>
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
