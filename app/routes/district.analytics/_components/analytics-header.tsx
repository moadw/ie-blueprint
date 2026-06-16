import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Calendar, ChevronDown, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export interface AnalyticsHeaderProps {
  startDate: string;
  endDate: string;
  granularity: "daily" | "weekly" | "monthly";
  compareStart?: string;
  compareEnd?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

function parseLocalDate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}

function formatShortDate(s: string): string {
  return dateFormatter.format(parseLocalDate(s));
}

function formatRange(start?: string, end?: string): string {
  if (!start || !end) return "Select dates";
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const pillClass =
  "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted";

export function AnalyticsHeader({
  startDate,
  endDate,
  granularity,
  compareStart,
  compareEnd,
}: AnalyticsHeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [dateOpen, setDateOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [granularityOpen, setGranularityOpen] = useState(false);

  const [draftStart, setDraftStart] = useState(startDate);
  const [draftEnd, setDraftEnd] = useState(endDate);
  const [draftCompareStart, setDraftCompareStart] = useState(compareStart ?? "");
  const [draftCompareEnd, setDraftCompareEnd] = useState(compareEnd ?? "");

  useEffect(() => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
    setDraftCompareStart(compareStart ?? "");
    setDraftCompareEnd(compareEnd ?? "");
  }, [startDate, endDate, compareStart, compareEnd]);

  function applyPrimaryDates() {
    const next = new URLSearchParams(searchParams);
    next.set("start", draftStart);
    next.set("end", draftEnd);
    setSearchParams(next, { replace: true });
    setDateOpen(false);
  }

  function applyCompareDates() {
    const next = new URLSearchParams(searchParams);
    if (draftCompareStart) {
      next.set("compareStart", draftCompareStart);
    } else {
      next.delete("compareStart");
    }
    if (draftCompareEnd) {
      next.set("compareEnd", draftCompareEnd);
    } else {
      next.delete("compareEnd");
    }
    setSearchParams(next, { replace: true });
    setCompareOpen(false);
  }

  function applyGranularity(value: "daily" | "weekly" | "monthly") {
    const next = new URLSearchParams(searchParams);
    next.set("granularity", value);
    setSearchParams(next, { replace: true });
    setGranularityOpen(false);
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="font-serif text-4xl text-foreground lg:text-5xl">Overview</h1>

      <div className="flex flex-wrap items-center gap-2">
        {/* Primary date range pill */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <button type="button" className={pillClass}>
              <Calendar size={14} />
              {formatRange(startDate, endDate)}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto bg-card border border-border rounded-xl shadow-lg p-4">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-muted-foreground">Date range</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={draftStart}
                  onChange={(e) => setDraftStart(e.target.value)}
                  className="h-9 px-2 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-muted-foreground">→</span>
                <input
                  type="date"
                  value={draftEnd}
                  onChange={(e) => setDraftEnd(e.target.value)}
                  className="h-9 px-2 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="button"
                onClick={applyPrimaryDates}
                className="self-end rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-medium hover:bg-foreground/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <span className="text-xs text-muted-foreground">compared to</span>

        {/* Compare date range pill */}
        <Popover open={compareOpen} onOpenChange={setCompareOpen}>
          <PopoverTrigger asChild>
            <button type="button" className={pillClass}>
              <Calendar size={14} />
              {formatRange(compareStart, compareEnd)}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto bg-card border border-border rounded-xl shadow-lg p-4">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-muted-foreground">Compared to</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={draftCompareStart}
                  onChange={(e) => setDraftCompareStart(e.target.value)}
                  className="h-9 px-2 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-muted-foreground">→</span>
                <input
                  type="date"
                  value={draftCompareEnd}
                  onChange={(e) => setDraftCompareEnd(e.target.value)}
                  className="h-9 px-2 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="button"
                onClick={applyCompareDates}
                className="self-end rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-medium hover:bg-foreground/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Granularity pill */}
        <Popover open={granularityOpen} onOpenChange={setGranularityOpen}>
          <PopoverTrigger asChild>
            <button type="button" className={pillClass}>
              {capitalize(granularity)}
              <ChevronDown size={14} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-card border border-border rounded-xl shadow-lg p-1">
            <div className="flex flex-col">
              {(["daily", "weekly", "monthly"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => applyGranularity(value)}
                  className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    granularity === value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {capitalize(value)}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Add widget (deferred) */}
        <button
          type="button"
          disabled
          title="Add widget — coming soon"
          className={`${pillClass} disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-card`}
        >
          <Plus size={14} />
          Add widget
        </button>
      </div>
    </div>
  );
}

export default AnalyticsHeader;
