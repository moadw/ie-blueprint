import { useState } from "react";
import { useSearchParams } from "react-router";
import { Calendar, ChevronDown, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { DateRangePopover } from "./date-range-popover";

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
  const [granularityOpen, setGranularityOpen] = useState(false);

  function applyPrimaryDates(nextStart: string, nextEnd: string) {
    const next = new URLSearchParams(searchParams);
    next.set("start", nextStart);
    next.set("end", nextEnd);
    setSearchParams(next, { replace: true });
  }

  function applyCompareDates(nextStart: string, nextEnd: string) {
    const next = new URLSearchParams(searchParams);
    next.set("compareStart", nextStart);
    next.set("compareEnd", nextEnd);
    setSearchParams(next, { replace: true });
  }

  function applyGranularity(value: "daily" | "weekly" | "monthly") {
    const next = new URLSearchParams(searchParams);
    next.set("granularity", value);
    setSearchParams(next, { replace: true });
    setGranularityOpen(false);
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="font-serif text-5xl text-foreground lg:text-6xl leading-[1.05] tracking-[0.01em]">
        Overview
      </h1>

      <div className="flex flex-wrap items-center gap-2">
        {/* Primary date range pill */}
        <DateRangePopover
          start={startDate}
          end={endDate}
          onApply={applyPrimaryDates}
        >
          <button type="button" className={pillClass}>
            <Calendar size={14} />
            {formatRange(startDate, endDate)}
          </button>
        </DateRangePopover>

        <span className="text-xs text-muted-foreground">compared to</span>

        {/* Compare date range pill */}
        <DateRangePopover
          start={compareStart ?? startDate}
          end={compareEnd ?? endDate}
          onApply={applyCompareDates}
        >
          <button type="button" className={pillClass}>
            <Calendar size={14} />
            {formatRange(compareStart, compareEnd)}
          </button>
        </DateRangePopover>

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
