import { Check } from "lucide-react";

export type LessonCardStatus = "watched" | "current" | "none";

interface LessonGlassCardProps {
  image: string | null | undefined;
  title: string;
  isActive: boolean;
  status: LessonCardStatus;
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
  status,
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

      {/* Status badge (top-center). Ported from the prototype
          `ThemedGlassCard`. Watched wins if both somehow apply; `current`
          shows on any `nextClass` card regardless of `isActive` (intentional
          divergence from the prototype, which gates Current on the active
          card). */}
      {status === "watched" ? (
        <div
          className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(134,239,172,0.35) 0%, rgba(74,222,128,0.25) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(134,239,172,0.4)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(74,222,128,0.2)",
          }}
        >
          <div
            className="flex h-4 w-4 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(134,239,172,0.8) 0%, rgba(74,222,128,0.9) 100%)",
              boxShadow: "0 0 8px rgba(134,239,172,0.5)",
            }}
          >
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wide text-white/90">
            Watched
          </span>
        </div>
      ) : status === "current" ? (
        <div
          className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full px-3 py-1.5"
          style={{
            // Explicit grey tint (not the prototype's literal `rgba(255,255,255,
            // 0.25)`). The prototype's white-translucent pill only READS grey
            // because `backdrop-filter` frosts the dark card-top behind it; over
            // a lighter cover image it renders near-white. A neutral grey base
            // matches the prototype's RENDERED look on any image (fidelity rule:
            // match the RGB it renders). Blur stays for the glass frost.
            background: "rgba(82,88,98,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.18)",
          }}
        >
          <span className="text-xs font-medium uppercase tracking-wide text-white/90">
            Current
          </span>
        </div>
      ) : null}

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
