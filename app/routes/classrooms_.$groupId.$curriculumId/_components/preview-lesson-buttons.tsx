import { Eye, Presentation } from "lucide-react";
import {
  GRID_PILL_GLASS,
  GRID_PILL_GLASS_LIGHT,
  SLIDER_PILL_GLASS,
} from "./duration-pill";

interface PreviewLessonButtonsProps {
  /** Opens the no-progress educator preview route for this class. */
  onPreview: () => void;
  /** Opens the normal student lesson player for this class. */
  onStartLesson: () => void;
  /**
   * Surface size — `"md"` (default) is the slider cover, `"sm"` the grid tile.
   * Matches the duration pill's per-surface glass + placement so the buttons
   * sit exactly where the "N min" pill would.
   */
  size?: "sm" | "md";
}

const btnBase =
  "whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

/**
 * Two-button treatment shown bottom-center over a series card cover for classes
 * that carry `preview` (educator-deck) taps, in place of the duration pill.
 * Presentational only — the caller wires each button to a navigate. Clicks
 * `stopPropagation` so they never bubble to the card body's own navigate
 * handler.
 *
 * Two surface treatments, matched to the prototype:
 *  - `"sm"` (grid tile, `ThemedPracticesGrid`): two SEPARATE pills with icons —
 *    `Eye` "View" (dark glass) + `Presentation` "Start" (light glass).
 *  - `"md"` (slider cover, `ThemedGlassCard`): one segmented glass container
 *    with "Preview" / "Start Lesson".
 */
export function PreviewLessonButtons({
  onPreview,
  onStartLesson,
  size = "md",
}: PreviewLessonButtonsProps) {
  const preview = (e: React.MouseEvent) => {
    // Don't let the tap open the lesson — the card body wraps these buttons in
    // its own navigate `onClick`.
    e.stopPropagation();
    onPreview();
  };
  const start = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartLesson();
  };

  // Grid tile: two independent icon pills (prototype `ThemedPracticesGrid`).
  if (size === "sm") {
    return (
      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1">
        <button
          type="button"
          onClick={preview}
          style={GRID_PILL_GLASS}
          className={`${btnBase} px-2 py-0.5 text-[10px] text-white/90 hover:text-white`}
        >
          <Eye className="-mt-px mr-0.5 inline h-2.5 w-2.5" />
          View
        </button>
        <button
          type="button"
          onClick={start}
          style={GRID_PILL_GLASS_LIGHT}
          className={`${btnBase} px-2 py-0.5 text-[10px] text-white/95 hover:text-white`}
        >
          <Presentation className="-mt-px mr-0.5 inline h-2.5 w-2.5" />
          Start
        </button>
      </div>
    );
  }

  // Slider cover: segmented glass container with full labels.
  return (
    <div
      className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full p-1"
      style={SLIDER_PILL_GLASS}
    >
      <button
        type="button"
        onClick={preview}
        className={`${btnBase} px-3 py-1.5 text-xs text-white/90 hover:text-white`}
      >
        Preview
      </button>
      <button
        type="button"
        onClick={start}
        className={`${btnBase} bg-white/50 px-3 py-1.5 text-xs text-black/80`}
      >
        Start Lesson
      </button>
    </div>
  );
}
