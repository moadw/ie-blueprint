import { Check } from "lucide-react";
import chainGraphic from "~/assets/chain-graphic.png";

interface WeeklyChainProps {
  completedDays: boolean[];
  currentDayIndex: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function getMessage(completedCount: number, remainingDays: number): string {
  if (completedCount === 5) return "Perfect week! 🎉";
  if (remainingDays === 1) return "Don't break the chain! 1 day to a perfect week.";
  return `Keep going! ${remainingDays} days to complete the week.`;
}

export function WeeklyChain({ completedDays, currentDayIndex }: WeeklyChainProps) {
  const completedCount = completedDays.slice(0, 5).filter(Boolean).length;
  const remainingDays = 5 - completedCount;

  return (
    <div
      className="rounded-[24px] p-6 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "2px solid rgba(255,255,255,0.5)",
        boxShadow:
          "0 8px 32px rgba(40,46,56,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      <h3 className="text-base font-medium text-foreground mb-6">
        This Week's Chain
      </h3>

      {/* Chain container */}
      <div className="relative flex items-center justify-center">
        {/* Full chain running underneath - full width */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none"
          style={{ top: "14px" }}
        >
          <div
            className="w-full h-6"
            style={{
              backgroundImage: `url(${chainGraphic})`,
              backgroundSize: "auto 100%",
              backgroundPosition: "center",
              backgroundRepeat: "repeat-x",
              opacity: 0.3,
              maskImage:
                "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            }}
          />
        </div>

        {/* Days row - on top of chain */}
        <div className="relative flex items-center justify-between w-full max-w-md px-2 z-10">
          {DAYS.map((day, index) => (
            <DayNode
              key={day}
              day={DAYS[index] ?? ""}
              isCompleted={completedDays[index] ?? false}
              isCurrent={index === currentDayIndex}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground font-medium mt-6">
        {getMessage(completedCount, remainingDays)}
      </p>
    </div>
  );
}

interface DayNodeProps {
  day: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

function DayNode({ day, isCompleted, isCurrent }: DayNodeProps) {
  const nodeBackground = isCompleted
    ? "linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, color-mix(in srgb, var(--color-primary) 12%, transparent) 100%)"
    : "rgba(255,255,255,0.65)";

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect for completed days */}
      {isCompleted ? (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-[24px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 30%, transparent) 0%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
      ) : null}

      {/* Glass day node - larger with white outer shadow */}
      <div
        className={`relative w-14 h-14 rounded-[24px] flex items-center justify-center transition-all duration-300 ${
          isCurrent ? "border-2 border-dashed border-muted-foreground/50" : ""
        }`}
        style={{
          background: nodeBackground,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          ...(isCompleted
            ? {
                border:
                  "1.5px solid color-mix(in srgb, var(--color-primary) 35%, transparent)",
              }
            : isCurrent
              ? {}
              : {
                  border:
                    "1.5px solid color-mix(in srgb, var(--color-border) 25%, transparent)",
                }),
          boxShadow:
            "0 0 0 3px rgba(255,255,255,0.7), 0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {isCompleted ? (
          <Check className="w-6 h-6 text-primary" strokeWidth={2.5} />
        ) : isCurrent ? (
          <span className="text-xl text-muted-foreground font-medium">?</span>
        ) : null}
      </div>

      {/* Day label */}
      <span className="text-xs text-muted-foreground mt-2.5 font-medium">
        {day}
      </span>
    </div>
  );
}
