import {
  Award,
  Crown,
  Flame,
  Heart,
  Medal,
  Sparkles,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

// Small icon map (subset of the prototype's). Unknown keys fall back to Trophy.
const MILESTONE_ICONS: Record<string, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  medal: Medal,
  crown: Crown,
  heart: Heart,
  flame: Flame,
  sparkles: Sparkles,
  award: Award,
  target: Target,
};

interface MilestoneBadgeProps {
  iconKey: string;
  title: string;
  subtitle: string;
  /** Gradient seed color for the tile. */
  color: string;
  /** Glow color behind / around the tile. */
  glowColor: string;
}

/**
 * Milestone badge: a `w-44 h-44 rounded-3xl` gradient icon tile with a blurred
 * glow behind it, a `text-4xl font-serif` title, and an uppercase tracked
 * subtitle. Rebuilt from the prototype's `MilestoneBadge` (visual reference
 * only) with a CSS entrance (component-scoped keyframes, never `app.css`).
 */
export function MilestoneBadge({
  iconKey,
  title,
  subtitle,
  color,
  glowColor,
}: MilestoneBadgeProps) {
  const Icon = MILESTONE_ICONS[iconKey] ?? Trophy;

  return (
    <div className="flex flex-col items-center">
      <style>{`
        @keyframes milestone-badge-pop {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes milestone-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Badge tile + glow */}
      <div className="relative mb-8">
        <div
          className="pointer-events-none absolute -inset-8 rounded-3xl"
          style={{
            background: `linear-gradient(145deg, ${color}, ${color}dd)`,
            filter: "blur(50px)",
            opacity: 0.5,
          }}
        />
        <div
          className="relative flex h-44 w-44 items-center justify-center rounded-3xl"
          style={{
            background: `linear-gradient(145deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 40px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.3)`,
            animation: "milestone-badge-pop 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <Icon className="h-20 w-20 text-white drop-shadow-lg" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <h3
        className="mb-3 text-center font-serif text-4xl text-white"
        style={{
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          animation:
            "milestone-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both",
        }}
      >
        {title}
      </h3>

      {/* Subtitle */}
      <p
        className="font-sans text-sm uppercase tracking-widest text-white/70"
        style={{
          animation:
            "milestone-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
