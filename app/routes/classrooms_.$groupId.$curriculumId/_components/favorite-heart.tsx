import { Heart } from "lucide-react";
import { GRID_PILL_GLASS, SLIDER_PILL_GLASS } from "./duration-pill";

interface FavoriteHeartProps {
  /** Whether this class is currently favorited (drives the rose fill). */
  liked: boolean;
  /** Fires on tap (after `stopPropagation`) — the caller owns the mutation. */
  onToggle: () => void;
  /**
   * Which card surface this heart sits on. `"slider"` = the light-glass active
   * carousel card (`w-8`/`w-3.5`); `"grid"` = the darker-glass grid tile
   * (`w-6`/`w-3`). Reuses the sibling `duration-pill` glass recipe per surface.
   */
  variant: "slider" | "grid";
  /** Extra classes merged onto the button (e.g. positioning helpers). */
  className?: string;
  /** When true, the tap is ignored (in-flight guard); still focusable/hoverable. */
  disabled?: boolean;
}

// Per-surface sizing + glass recipe. Glass literals are the SAME ones the
// bottom-row duration pill uses on each surface — one glass treatment per
// surface (CLAUDE.md), never a second bespoke recipe.
const VARIANT = {
  slider: { button: "w-8 h-8", icon: "w-3.5 h-3.5", glass: SLIDER_PILL_GLASS },
  grid: { button: "w-6 h-6", icon: "w-3 h-3", glass: GRID_PILL_GLASS },
} as const;

/**
 * Circular glass favorite (heart) toggle rendered bottom-right over a class
 * card cover. Filled rose when favorited, hollow white otherwise. The click is
 * `stopPropagation`'d so it never bubbles to the card's navigate handler.
 * Route-private (its only callers are the two card surfaces here, and it
 * imports the route-private `duration-pill` glass tokens).
 */
export function FavoriteHeart({
  liked,
  onToggle,
  variant,
  className,
  disabled,
}: FavoriteHeartProps) {
  const v = VARIANT[variant];
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        // Card wrappers own a navigating onClick — never let the tap bubble.
        e.stopPropagation();
        if (!disabled) onToggle();
      }}
      style={v.glass}
      className={`${v.button} flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50${
        className ? ` ${className}` : ""
      }`}
    >
      <Heart
        className={`${v.icon} transition-colors duration-200 ${
          liked ? "text-rose-400 fill-rose-400" : "text-white/60"
        }`}
      />
    </button>
  );
}
