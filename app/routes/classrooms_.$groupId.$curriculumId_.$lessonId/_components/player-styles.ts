import type { CSSProperties } from "react";

// Ported from `ie-prototype/src/lib/practiceStyles.ts`. Phase- and idle-driven
// inline styles for the fullscreen player: the background eases in from a
// blurred/scaled state, the chrome fades on idle, and the gradient overlay
// deepens when idle. CSS transitions (declared on the elements themselves)
// animate between the values these return.

export type PlayerPhase = "entering" | "ready" | "exiting";

interface PlayerStyleOptions {
  phase: PlayerPhase;
  isIdle: boolean;
  showFeedback: boolean;
}

/** Background (video/still) blur + scale by phase and idle state. */
export function getBackgroundStyle({
  phase,
  isIdle,
}: Pick<PlayerStyleOptions, "phase" | "isIdle">): CSSProperties {
  if (phase === "ready" && isIdle) {
    return { filter: "blur(0px) saturate(1.3)", transform: "scale(1)" };
  }
  switch (phase) {
    case "entering":
      return { filter: "blur(25px) saturate(1.1)", transform: "scale(1.15)" };
    case "ready":
      return { filter: "blur(8px) saturate(1.2)", transform: "scale(1.05)" };
    case "exiting":
      return { filter: "blur(25px) saturate(1.1)", transform: "scale(1.15)" };
  }
}

/** Chrome (centered content column) opacity + transform. Hidden on idle/feedback. */
export function getControlsStyle({
  phase,
  isIdle,
  showFeedback,
}: PlayerStyleOptions): CSSProperties {
  if (showFeedback || (phase === "ready" && isIdle)) {
    return {
      opacity: 0,
      transform: "translateY(20px) scale(0.98)",
      pointerEvents: "none",
    };
  }
  switch (phase) {
    case "entering":
      return { opacity: 0, transform: "translateY(40px) scale(0.95)" };
    case "ready":
      return { opacity: 1, transform: "translateY(0) scale(1)" };
    case "exiting":
      return { opacity: 0, transform: "translateY(40px) scale(0.95)" };
  }
}

/** Gradient overlay opacity + (when idle) a deeper vignette. */
export function getOverlayStyle({
  phase,
  isIdle,
}: Pick<PlayerStyleOptions, "phase" | "isIdle">): CSSProperties {
  if (phase === "ready" && isIdle) {
    return {
      opacity: 1,
      background:
        "radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.7) 100%)",
    };
  }
  switch (phase) {
    case "entering":
      return { opacity: 0 };
    case "ready":
      return { opacity: 1 };
    case "exiting":
      return { opacity: 0 };
  }
}
