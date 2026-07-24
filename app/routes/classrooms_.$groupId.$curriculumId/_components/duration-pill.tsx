import type { AudioPref } from "~/lib/audio-preference";
import { formatMinutesLabel, type AudioTabOption } from "./card-media";

// Per-surface glass recipes, matched to the (improved) prototype pills:
//  - Slider (`ThemedGlassCard`): white-translucent frost + soft lift.
//  - Grid (`ThemedPracticesGrid`): darker frost, no shadow.
// Exported so the bottom-left media-indicator icons and the card's status badge
// reuse the SAME recipe on each surface — one glass treatment per surface.
export const SLIDER_PILL_GLASS = {
  background: "rgba(255,255,255,0.25)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.1)",
} as const;
export const GRID_PILL_GLASS = {
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.2)",
} as const;
// Lighter grid pill — the prototype's primary ("Start") button in
// `ThemedPracticesGrid` sits on a white-translucent fill (vs the darker
// secondary "View" pill above). Transcribed literally from the prototype.
export const GRID_PILL_GLASS_LIGHT = {
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.3)",
} as const;

/** The frosted-glass recipe for a card surface (`"md"` slider / `"sm"` grid). */
export function pillGlass(size: "sm" | "md") {
  return size === "sm" ? GRID_PILL_GLASS : SLIDER_PILL_GLASS;
}

// Bottom-center placement over the cover (slider sits a touch higher than the
// grid tile), mirroring the prototype's `bottom-4` / `bottom-2`.
function pillPosition(size: "sm" | "md"): string {
  return size === "sm"
    ? "absolute bottom-2 left-1/2 z-10 -translate-x-1/2"
    : "absolute bottom-4 left-1/2 z-20 -translate-x-1/2";
}

/** Container padding around the segment(s). */
function pillPad(size: "sm" | "md"): string {
  return size === "sm" ? "p-0.5" : "p-1";
}

/**
 * One segment's classes. The active segment matches the improved prototype: a
 * solid white pill with dark text on the slider (high contrast), a subtle
 * `bg-white/20` highlight on the grid; inactive segments are transparent with
 * white text.
 */
function segmentClasses(size: "sm" | "md", active: boolean): string {
  const pad = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs";
  const fill = active
    ? size === "sm"
      ? "bg-white/20 text-white/90"
      : "bg-white/50 text-black/80"
    : "text-white/90";
  return `whitespace-nowrap rounded-full font-medium ${pad} ${fill}`;
}

interface DurationPillProps {
  /** Floored minutes to label, e.g. `9` → "9 min". */
  minutes: number;
  /**
   * Surface size. `"md"` (default) is the slider cover (`ThemedGlassCard`);
   * `"sm"` is the smaller grid tile (`ThemedPracticesGrid`).
   */
  size?: "sm" | "md";
}

/**
 * Single-label duration pill ("N min") rendered bottom-center over a series
 * card cover, for `video` / `full-audio` / `5min-audio` shapes. Presentational
 * only. Rendered as a single always-active segment so it matches the
 * prototype's single-variant toggle (a solid pill inside the frosted container).
 */
export function DurationPill({ minutes, size = "md" }: DurationPillProps) {
  return (
    <div
      className={`${pillPosition(size)} flex items-center rounded-full ${pillPad(size)}`}
      style={pillGlass(size)}
    >
      <span className={segmentClasses(size, true)}>
        {formatMinutesLabel(minutes)}
      </span>
    </div>
  );
}

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
  /** Surface size — see {@link DurationPillProps.size}. */
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
 * Same per-surface frosted container + placement as {@link DurationPill}; the
 * active segment is the solid pill from {@link segmentClasses}. Selecting a
 * segment calls `onChange` and does NOT navigate (the click is stopped from
 * bubbling to the card body).
 */
export function DurationTabs({
  options,
  value,
  onChange,
  size = "md",
  interactive = true,
}: DurationTabsProps) {
  return (
    <div
      role="group"
      aria-label="Audio length"
      className={`${pillPosition(size)} flex items-center rounded-full ${pillPad(size)}${
        interactive ? "" : " pointer-events-none"
      }`}
      style={pillGlass(size)}
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
            className={`${segmentClasses(size, active)} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60${
              active ? "" : " hover:text-white"
            }`}
          >
            {formatMinutesLabel(option.minutes)}
          </button>
        );
      })}
    </div>
  );
}
