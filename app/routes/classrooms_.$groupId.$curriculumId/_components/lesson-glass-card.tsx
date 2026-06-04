interface LessonGlassCardProps {
  image: string | null | undefined;
  title: string;
  isActive: boolean;
}

// Glass-theme token literals ported verbatim from the prototype's
// `PlayerThemeContext` (glass) + `ThemedGlassCard` (research §2).
const CARD_BG_ACTIVE =
  "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%)";
const CARD_BG_INACTIVE =
  "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)";
const CARD_BORDER_ACTIVE = "2px solid rgba(255, 255, 255, 0.35)";
const CARD_BORDER_INACTIVE = "1.5px solid rgba(255, 255, 255, 0.15)";
const CARD_SHADOW_ACTIVE =
  "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.08), 0 0 60px rgba(255,255,255,0.05)";
const CARD_SHADOW_INACTIVE =
  "inset 0 0.5px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0, 0, 0, 0.2)";

/**
 * Slider-variant glass card (active/inactive states). No completion/duration
 * pills — `lesson` carries no such data (research §2). The shimmer keyframe is
 * scoped to this component rather than `app/styles/app.css` so parallel tracks
 * never collide on the shared stylesheet (root.md single-owner-globals rule).
 */
export function LessonGlassCard({
  image,
  title,
  isActive,
}: LessonGlassCardProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-3xl"
      style={{
        background: isActive ? CARD_BG_ACTIVE : CARD_BG_INACTIVE,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: isActive ? CARD_BORDER_ACTIVE : CARD_BORDER_INACTIVE,
        boxShadow: isActive ? CARD_SHADOW_ACTIVE : CARD_SHADOW_INACTIVE,
        transition: "all 0.5s ease",
      }}
    >
      {/* Top hairline highlight */}
      <div
        className="pointer-events-none absolute left-4 right-4 top-0 z-20 h-px rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />

      {/* Shimmer sweep on the active card */}
      {isActive ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.08) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "lessonCardShimmer 8s ease-in-out infinite",
          }}
        />
      ) : null}

      {image ? (
        <img
          src={image}
          alt={title}
          loading={isActive ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover transition-all duration-500"
          style={{ filter: isActive ? "blur(0px)" : "blur(2px)" }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/5 px-4 text-center font-serif text-lg text-white/70">
          {title}
        </div>
      )}

      <style>{`
        @keyframes lessonCardShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
