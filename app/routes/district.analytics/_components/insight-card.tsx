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
  const slide = insights[active];

  const handleSwipe = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const el = e.currentTarget;
    const onUp = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (dx < -40) setActive((i) => Math.min(i + 1, insights.length - 1));
      if (dx > 40) setActive((i) => Math.max(i - 1, 0));
      el.releasePointerCapture(ev.pointerId);
      el.removeEventListener("pointerup", onUp);
    };
    el.setPointerCapture(e.pointerId);
    el.addEventListener("pointerup", onUp);
  }, [insights.length]);

  if (!slide) {
    return (
      <div className="bg-white rounded-[24px] border border-border shadow-xs p-5 flex flex-col h-full">
        <p className="text-sm text-muted-foreground">No insights available.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[24px] p-5 flex flex-col h-full relative overflow-hidden select-none touch-none"
      style={{
        background:
          "linear-gradient(155deg, hsl(30 40% 55%) 0%, var(--color-primary) 50%, hsl(200 40% 55%) 100%)",
      }}
      onPointerDown={handleSwipe}
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

        <div className="mt-auto flex flex-col gap-2">
          <span className="font-serif text-6xl font-bold text-white leading-none transition-opacity duration-300">
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
                onClick={() => setActive(i)}
                className="flex-1 h-[4px] rounded-full transition-all duration-500 ease-out"
                style={{
                  backgroundColor:
                    i === active ? "hsl(0 0% 100% / 0.9)" : "hsl(0 0% 0% / 0.25)",
                }}
                aria-label={`Go to insight ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightCard;
