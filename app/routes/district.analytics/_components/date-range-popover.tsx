import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface DateRangePopoverProps {
  start: string;
  end: string;
  onApply: (start: string, end: string) => void;
  children: React.ReactNode;
}

function parseDate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function addMonths(d: Date, n: number): Date {
  const next = new Date(d);
  next.setMonth(next.getMonth() + n);
  return next;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime() && !isSameDay(a, b);
}

function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime() && !isSameDay(a, b);
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DateRangePopover({
  start,
  end,
  onApply,
  children,
}: DateRangePopoverProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(parseDate(start)));
  const [draftStart, setDraftStart] = useState<Date | null>(parseDate(start));
  const [draftEnd, setDraftEnd] = useState<Date | null>(parseDate(end));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setDraftStart(parseDate(start));
      setDraftEnd(parseDate(end));
      setHoverDate(null);
      setCurrentMonth(startOfMonth(parseDate(start)));
    }
  };

  const handleDayClick = (day: Date) => {
    if (!draftStart || (draftStart && draftEnd) || isBefore(day, draftStart)) {
      setDraftStart(day);
      setDraftEnd(null);
      setHoverDate(null);
      return;
    }

    if (isAfter(day, draftStart) || isSameDay(day, draftStart)) {
      setDraftEnd(day);
      setHoverDate(null);
    }
  };

  const handleDayHover = (day: Date) => {
    if (draftStart && !draftEnd) {
      setHoverDate(day);
    }
  };

  const handleApply = () => {
    if (draftStart && draftEnd) {
      onApply(formatDate(draftStart), formatDate(draftEnd));
      setOpen(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = addDays(monthStart, -monthStart.getDay());
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(addDays(calendarStart, i));
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[320px] bg-card border border-border rounded-xl shadow-lg p-4">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="inline-flex items-center justify-center h-7 w-7 rounded-full text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-foreground">
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="inline-flex items-center justify-center h-7 w-7 rounded-full text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="h-8 flex items-center justify-center text-[11px] font-medium text-muted-foreground"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day) => {
              const inCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isStart = draftStart ? isSameDay(day, draftStart) : false;
              const isEnd = draftEnd ? isSameDay(day, draftEnd) : false;
              const inSelectedRange =
                draftStart && draftEnd
                  ? (isAfter(day, draftStart) || isSameDay(day, draftStart)) &&
                    (isBefore(day, draftEnd) || isSameDay(day, draftEnd))
                  : false;
              const inHoverRange =
                draftStart && !draftEnd && hoverDate
                  ? (isAfter(day, draftStart) || isSameDay(day, draftStart)) &&
                    (isBefore(day, hoverDate) || isSameDay(day, hoverDate))
                  : false;

              const isEndpoint = isStart || isEnd;
              const isRangeFill = (inSelectedRange || inHoverRange) && !isEndpoint;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => handleDayHover(day)}
                  onMouseLeave={() => setHoverDate(null)}
                  className={[
                    "h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors",
                    !inCurrentMonth && "text-muted-foreground/40",
                    inCurrentMonth && !isEndpoint && !isRangeFill && "text-foreground hover:bg-muted",
                    isEndpoint && "bg-primary text-primary-foreground font-medium",
                    isRangeFill && "bg-primary/10 text-foreground rounded-none",
                  ].join(" ")}
                  style={{
                    borderTopLeftRadius: isStart ? undefined : isRangeFill ? 0 : undefined,
                    borderBottomLeftRadius: isStart ? undefined : isRangeFill ? 0 : undefined,
                    borderTopRightRadius: isEnd ? undefined : isRangeFill ? 0 : undefined,
                    borderBottomRightRadius: isEnd ? undefined : isRangeFill ? 0 : undefined,
                  }}
                  aria-label={formatDate(day)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Apply */}
          <button
            type="button"
            disabled={!draftStart || !draftEnd}
            onClick={handleApply}
            className="mt-1 w-full rounded-full bg-foreground text-background px-4 py-2 text-xs font-medium hover:bg-foreground/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePopover;
