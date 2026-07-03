import { BookOpen, Film } from "lucide-react";
import { GRID_PILL_GLASS, SLIDER_PILL_GLASS } from "./duration-pill";

interface MediaIndicatorIconsProps {
  /** A `video` tap is present in the practice. */
  hasVideo: boolean;
  /** An `ie-journal` tap is present in the practice. */
  hasJournal: boolean;
  /**
   * Surface size — `"md"` slider (`w-8` badge / `w-3.5` icon), `"sm"` grid
   * (`w-6` / `w-3`). Reuses the card's per-surface glass so the icons match the
   * duration pill on the same surface.
   */
  size?: "sm" | "md";
}

/**
 * Bottom-left cluster of media-indicator icons on a series card: a `Film` badge
 * when the practice includes a video, a `BookOpen` badge when it includes a
 * journal prompt — matching the prototype's `ThemedGlassCard` /
 * `ThemedPracticesGrid`. Renders nothing when the practice has neither. Each
 * badge `stopPropagation`s so a tap reveals its `title` tooltip without opening
 * the card, and carries the same tooltip copy as the prototype.
 */
export function MediaIndicatorIcons({
  hasVideo,
  hasJournal,
  size = "md",
}: MediaIndicatorIconsProps) {
  if (!hasVideo && !hasJournal) return null;
  const glass = size === "sm" ? GRID_PILL_GLASS : SLIDER_PILL_GLASS;
  const wrapper =
    size === "sm"
      ? "absolute bottom-2 left-2 z-10 flex items-center gap-1"
      : "absolute bottom-4 left-4 z-20 flex items-center gap-1.5";
  const badge =
    size === "sm"
      ? "flex h-6 w-6 cursor-default items-center justify-center rounded-full"
      : "flex h-8 w-8 cursor-default items-center justify-center rounded-full";
  const icon =
    size === "sm" ? "h-3 w-3 text-white/90" : "h-3.5 w-3.5 text-white/90";
  return (
    <div className={wrapper}>
      {hasVideo ? (
        <div
          className={badge}
          style={glass}
          title="This practice includes video"
          onClick={(e) => e.stopPropagation()}
        >
          <Film className={icon} />
        </div>
      ) : null}
      {hasJournal ? (
        <div
          className={badge}
          style={glass}
          title="This practice includes a journal prompt"
          onClick={(e) => e.stopPropagation()}
        >
          <BookOpen className={icon} />
        </div>
      ) : null}
    </div>
  );
}
