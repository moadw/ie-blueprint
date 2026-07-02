import type { AudioPref } from "~/lib/audio-preference";
import { formatMinutesLabel, type AudioTabOption } from "./card-media";

// Glass recipe reused verbatim from the card status badges
// (`lesson-glass-card.tsx` `current` pill): a neutral grey-frost base, 12px
// backdrop blur, a white hairline border and the same soft inset+drop shadow.
// Exported so step-3's segmented `DurationTabs` variant can adopt the SAME
// recipe in this file without inventing a second glass treatment.
export const PILL_GLASS_STYLE = {
  background: "rgba(82,88,98,0.55)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.18)",
} as const;

// Bottom-center placement over the card cover (mirrors the top-center status
// badge's `absolute left-1/2 … -translate-x-1/2 z-20`). Shared with the tabs
// variant so both sit in the same spot.
export const PILL_POSITION_CLASS =
  "absolute bottom-3 left-1/2 z-20 -translate-x-1/2";

interface DurationPillProps {
  /** Floored minutes to label, e.g. `9` → "9 min". */
  minutes: number;
  /**
   * Surface size. `"md"` (default) matches the slider cover in the prototype's
   * `ThemedGlassCard` (`text-xs`, `px-3 py-1.5`); `"sm"` matches the smaller
   * grid tile in `ThemedPracticesGrid` (`text-[10px]`, `px-2 py-0.5`).
   */
  size?: "sm" | "md";
}

/**
 * Single-label duration pill ("N min") rendered bottom-center over a series
 * card cover. Presentational only; the caller decides when to render it (for
 * `video` / `full-audio` shapes). The two-segment "5 min | 9 min" tabs variant
 * for `both-audios` cards is a sibling export added in step-3, reusing
 * `PILL_GLASS_STYLE` / `PILL_POSITION_CLASS`.
 */
export function DurationPill({ minutes, size = "md" }: DurationPillProps) {
  const pad = size === "sm" ? "px-2 py-0.5" : "px-3 py-1.5";
  const text = size === "sm" ? "text-[10px]" : "text-xs";
  return (
    <div
      className={`${PILL_POSITION_CLASS} rounded-full ${pad}`}
      style={PILL_GLASS_STYLE}
    >
      <span className={`whitespace-nowrap font-medium text-white/90 ${text}`}>
        {formatMinutesLabel(minutes)}
      </span>
    </div>
  );
}

// The active segment's fill: a white-translucent glass pill that pops against
// the dark frost of `PILL_GLASS_STYLE`. Same gradient/inset-highlight recipe as
// the cards' glass surfaces — no second glass treatment invented.
const ACTIVE_SEGMENT_STYLE = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.2) 100%)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.2)",
} as const;

interface DurationTabsProps {
  /** The two segments, left-to-right (e.g. 5-min then full). */
  options: readonly [AudioTabOption, AudioTabOption];
  /** Currently-selected tap type — its segment is highlighted. */
  value: AudioPref;
  /**
   * Fires with a segment's tap type on click. Presentational only — the caller
   * owns persistence (the per-curriculum audio-preference store). The click is
   * `stopPropagation`'d here so it never bubbles to the card's navigate handler.
   */
  onChange: (type: AudioPref) => void;
  /**
   * Surface size — see {@link DurationPillProps.size}. `"sm"` shrinks the
   * segments to the grid tile's `text-[10px]` / `px-2 py-0.5` (container
   * `p-0.5`), matching the prototype's `ThemedPracticesGrid`.
   */
  size?: "sm" | "md";
  /**
   * When `false`, the control is display-only: it still highlights the active
   * segment but does not capture pointer/keyboard events, so a click falls
   * through to the card underneath (e.g. an inactive carousel card that should
   * recenter, not flip the preference). Default `true`.
   */
  interactive?: boolean;
}

/**
 * Two-segment "5 min | 9 min" duration tabs for `both-audios` series cards.
 * Same bottom-center placement + dark glass frost as {@link DurationPill}
 * (shared `PILL_POSITION_CLASS` / `PILL_GLASS_STYLE`); the active segment is a
 * white-translucent pill. Selecting a segment calls `onChange` and does NOT
 * navigate (the click is stopped from bubbling to the card body).
 */
export function DurationTabs({
  options,
  value,
  onChange,
  size = "md",
  interactive = true,
}: DurationTabsProps) {
  const containerPad = size === "sm" ? "p-0.5" : "p-1";
  const segment =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  return (
    <div
      role="group"
      aria-label="Audio length"
      className={`${PILL_POSITION_CLASS} flex items-center gap-0.5 rounded-full ${containerPad}${
        interactive ? "" : " pointer-events-none"
      }`}
      style={PILL_GLASS_STYLE}
    >
      {options.map((option) => {
        const active = option.type === value;
        return (
          <button
            key={option.type}
            type="button"
            aria-pressed={active}
            {...(interactive ? {} : { tabIndex: -1 })}
            onClick={(e) => {
              // Don't let the tap open the practice — the card body wraps this
              // pill in its own navigate `onClick`.
              e.stopPropagation();
              onChange(option.type);
            }}
            className={`whitespace-nowrap rounded-full ${segment} font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              active ? "text-white" : "text-white/60 hover:text-white/90"
            }`}
            style={active ? ACTIVE_SEGMENT_STYLE : undefined}
          >
            {formatMinutesLabel(option.minutes)}
          </button>
        );
      })}
    </div>
  );
}
