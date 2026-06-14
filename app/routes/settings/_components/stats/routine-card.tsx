interface RoutineCardProps {
  averageDaysPerWeek: number;
  maxDays?: number;
}

export function RoutineCard({ averageDaysPerWeek, maxDays = 5 }: RoutineCardProps) {
  const percentage = Math.round((averageDaysPerWeek / maxDays) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getRoutineLabel = (): string => {
    if (percentage >= 80) return "Strong Routine";
    if (percentage >= 60) return "Building Consistency";
    if (percentage >= 40) return "Getting Started";
    return "Room to Grow";
  };

  const getEncouragement = (): string => {
    const remaining = maxDays - averageDaysPerWeek;
    if (remaining <= 0) return "You've mastered daily practice! Keep it up.";
    if (remaining === 1) return "Just 1 more day per week to reach daily practice.";
    return `Just ${remaining} more days per week to reach daily practice.`;
  };

  return (
    <div
      className="rounded-[24px] p-6"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "2px solid rgba(255,255,255,0.5)",
        boxShadow:
          "0 8px 32px rgba(40,46,56,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      <div className="flex items-start gap-5">
        {/* Circular progress (static offset) */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-serif font-medium text-primary">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          <h3 className="text-lg font-serif text-foreground mb-1">
            {getRoutineLabel()}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Practicing {averageDaysPerWeek} days/week on average
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Research shows daily practice leads to 43% less teacher stress.
            You're building something meaningful—
            {getEncouragement().toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
