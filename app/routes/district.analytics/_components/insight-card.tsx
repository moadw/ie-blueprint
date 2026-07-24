import { useCallback, useState } from "react";
import { Lightbulb } from "lucide-react";
import type { AnalyticsDashboardData } from "~/lib/district-analytics.server";

interface InsightCardProps {
  insights: AnalyticsDashboardData["insights"];
}

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

const NOISE_FINE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)' opacity='0.3'/%3E%3C/svg%3E")`;

export function InsightCard({ insights }: InsightCardProps) {
  const [active, setActive] = useState(0);
  // `insights` is now variable-length (0–3); clamp the stored index so a shrinking
  // list (e.g. after a filter change) never points past the end and wrongly shows
  // the empty state. Derived, so there's no stale-render flash.
  const clampedActive = Math.min(active, Math.max(insights.length - 1, 0));
  const slide = insights[clampedActive];
  // No insights yet (empty range / not enough activity) → keep the same gradient
  // card chrome but swap in the "Still learning" holding state instead of a bare
  // white card, so the analytics grid stays visually cohesive.
  const isEmpty = !slide;

  const handleSwipe = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // A press that starts on an indicator dot is a tab click, not a swipe — let it
    // through so the button's onClick fires. (We intentionally do NOT capture the
    // pointer on the card: pointer capture swallows the child buttons' click events,
    // which is what made the dots look clickable but do nothing.)
    if ((e.target as HTMLElement).closest("[data-insight-dot]")) return;
    const startX = e.clientX;
    const onUp = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (dx < -40) setActive(Math.min(clampedActive + 1, insights.length - 1));
      if (dx > 40) setActive(Math.max(clampedActive - 1, 0));
      window.removeEventListener("pointerup", onUp);
    };
    // Listen on window so the swipe still completes if the pointer leaves the card.
    window.addEventListener("pointerup", onUp);
  }, [clampedActive, insights.length]);

  return (
    <div
      className="rounded-[24px] p-5 flex flex-col h-full relative overflow-hidden select-none touch-none"
      style={{
        background: `linear-gradient(155deg,
          hsl(25, 50%, 62%) 0%,
          hsl(30, 40%, 55%) 18%,
          hsl(35, 28%, 50%) 32%,
          hsl(45, 20%, 52%) 45%,
          hsl(60, 18%, 58%) 55%,
          hsl(120, 12%, 55%) 65%,
          hsl(170, 20%, 55%) 78%,
          hsl(190, 25%, 58%) 88%,
          hsl(200, 18%, 52%) 100%
        )`,
      }}
      onPointerDown={isEmpty ? undefined : handleSwipe}
    >
      {/* Grain overlay - coarse */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: NOISE_SVG,
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />
      {/* Grain overlay - fine */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: NOISE_FINE,
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <div className="relative z-[2] flex flex-col h-full">
        <div className="flex justify-start mb-4">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-lg bg-white/20 border border-white/30 hover:bg-white/30 transition-colors pointer-events-auto"
          >
            <Lightbulb size={13} />
            Insights
          </button>
        </div>

        {isEmpty ? (
          <div className="mt-auto flex flex-col gap-2">
            <span className="text-2xl font-bold text-white leading-[1.05]">
              Still learning
            </span>
            <p className="text-white font-medium text-sm leading-snug max-w-[22rem]">
              Check back in 60 days to see if there are enough insights.
            </p>

            {/* Decorative slider indicators (no slides to page through yet) */}
            <div className="mt-4 flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-[4px] rounded-full"
                  style={{
                    backgroundColor:
                      i === 0 ? "hsl(0 0% 100% / 0.9)" : "hsl(0 0% 0% / 0.25)",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-2">
            <span className="font-display text-6xl font-bold text-white leading-none transition-opacity duration-300">
              {slide.stat}
            </span>
            <p className="text-white font-semibold text-sm leading-snug transition-opacity duration-300">
              {slide.title}
            </p>

            {/* Slider indicators */}
            <div className="mt-4 flex items-center gap-2 pointer-events-auto">
              {insights.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  data-insight-dot
                  onClick={() => setActive(i)}
                  className="flex-1 h-[4px] rounded-full transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor:
                      i === clampedActive ? "hsl(0 0% 100% / 0.9)" : "hsl(0 0% 0% / 0.25)",
                  }}
                  aria-label={`Go to insight ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightCard;
