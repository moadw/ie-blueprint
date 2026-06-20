interface JourneyProgressProps {
  currentPractice: number;
  totalPractices: number;
  startMonth?: string;
}

const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function JourneyProgress({
  currentPractice,
  totalPractices,
  startMonth = "Aug",
}: JourneyProgressProps) {
  const progressPercent = Math.round((currentPractice / totalPractices) * 100);

  const startIndex = ALL_MONTHS.indexOf(startMonth);
  // 11 months starting from startMonth (typical school year).
  const months: string[] = [];
  for (let i = 0; i < 11; i++) {
    months.push(ALL_MONTHS[(startIndex + i) % 12] ?? "");
  }

  return (
    <div
      className="rounded-[24px] p-5"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "2px solid rgba(255,255,255,0.5)",
        boxShadow:
          "0 8px 32px rgba(40,46,56,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-foreground">
          Core Series Journey
        </h3>
        <span className="text-base font-medium text-muted-foreground">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Month labels */}
      <div className="flex justify-between mb-1.5">
        {months.map((month, i) => (
          <span
            key={month + i}
            className="text-xs text-muted-foreground flex-1 text-center first:text-left last:text-right"
          >
            {month}
          </span>
        ))}
      </div>

      {/* Progress bar container */}
      <div className="relative">
        {/* Track */}
        <div className="h-7 bg-primary/10 rounded-full overflow-hidden">
          {/* Filled progress (static width) */}
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Current position indicator - white dot at end of progress */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm border-2 border-primary" />
            </div>
          </div>
        </div>

        {/* Practice label - positioned below the dot */}
        <div
          className="absolute top-full mt-2"
          style={{
            left: `${progressPercent}%`,
            transform: "translateX(-50%)",
          }}
        >
          <span className="inline-block bg-muted/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground whitespace-nowrap">
            Practice {currentPractice}
          </span>
        </div>
      </div>

      {/* Spacer for the label */}
      <div className="h-8" />
    </div>
  );
}
