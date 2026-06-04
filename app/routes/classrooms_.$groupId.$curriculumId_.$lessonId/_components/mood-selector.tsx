import { useState } from "react";

export type MoodValue = "very_bad" | "bad" | "neutral" | "good" | "very_good";

interface MoodOption {
  value: MoodValue;
  emoji: string;
  label: string;
  color: string;
}

// Order is load-bearing: very_bad → bad → neutral → good → very_good.
// `neutral` intentionally reads "Medium" (carried over from the prototype).
const MOOD_OPTIONS: readonly MoodOption[] = [
  { value: "very_bad", emoji: "😢", label: "Very Bad", color: "hsl(0, 70%, 60%)" },
  { value: "bad", emoji: "😔", label: "Bad", color: "hsl(30, 70%, 60%)" },
  { value: "neutral", emoji: "😐", label: "Medium", color: "hsl(45, 85%, 55%)" },
  { value: "good", emoji: "🙂", label: "Good", color: "hsl(100, 60%, 50%)" },
  {
    value: "very_good",
    emoji: "🤗",
    label: "Very Good",
    color: "hsl(160, 60%, 45%)",
  },
];

interface MoodSelectorProps {
  value: MoodValue | null;
  onChange: (value: MoodValue) => void;
}

/**
 * Five-mood selector. Rebuilt from the prototype's `MoodSelector` (visual
 * reference only). The active (or hovered) mood scales up, gets a colored
 * glass ring + glow, and shows its label pill underneath. CSS for the
 * selection feedback (no JS animation lib).
 */
export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const [hovered, setHovered] = useState<MoodValue | null>(null);

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-start justify-center gap-3 px-6 py-4 sm:gap-5"
        style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {MOOD_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const isHovered = hovered === option.value && !isSelected;
          const showLabel = isSelected || isHovered;

          return (
            <div
              key={option.value}
              className="flex w-16 flex-col items-center sm:w-20"
            >
              <button
                type="button"
                onClick={() => onChange(option.value)}
                onMouseEnter={() => setHovered(option.value)}
                onMouseLeave={() => setHovered(null)}
                aria-label={option.label}
                aria-pressed={isSelected}
                className="relative flex h-14 items-center justify-center transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95 sm:h-16"
              >
                {/* Outer glow ring — selected only. */}
                {isSelected ? (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${option.color}40 0%, transparent 70%)`,
                      filter: "blur(8px)",
                      transform: "scale(1.35)",
                    }}
                  />
                ) : null}

                {/* Glass circle */}
                <div
                  className="relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ease-out sm:h-14 sm:w-14"
                  style={{
                    transform: isSelected
                      ? "scale(1.2)"
                      : isHovered
                        ? "scale(1.1)"
                        : "scale(1)",
                    background: isSelected
                      ? `linear-gradient(145deg, ${option.color}30, ${option.color}10)`
                      : isHovered
                        ? "linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))"
                        : "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                    boxShadow: isSelected
                      ? `0 0 30px ${option.color}50, inset 0 1px 0 rgba(255,255,255,0.3)`
                      : "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.1)",
                    border: isSelected
                      ? `2px solid ${option.color}60`
                      : "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <span
                    className="select-none text-2xl transition-all duration-200 sm:text-3xl"
                    style={{
                      filter:
                        isSelected || isHovered ? "grayscale(0)" : "grayscale(0.7)",
                      opacity: isSelected ? 1 : isHovered ? 0.9 : 0.6,
                    }}
                  >
                    {option.emoji}
                  </span>
                </div>
              </button>

              {/* Label pill */}
              <div className="mt-2 flex h-8 items-center justify-center">
                {showLabel ? (
                  <div
                    className="whitespace-nowrap rounded-full px-2.5 py-1"
                    style={{
                      background: "rgba(40, 40, 40, 0.85)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      opacity: isSelected ? 1 : 0.6,
                    }}
                  >
                    <span className="font-sans text-xs font-medium tracking-wide text-white/95">
                      {option.label}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
