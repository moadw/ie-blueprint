// Pure, testable derivation of a per-class "media descriptor" for the series
// cards. Given a class's taps (+ the shared tap-type resolver), it reports the
// card's SHAPE (video-only / full-audio-only / both-audios / none) and the raw
// minutes of each media tap so the card can render a duration pill.
//
// Duration source: `tap.time` read RAW as minutes (Q1 — no normalization;
// correctness is kept at write-time by the admin form). `minutes =
// Math.floor(tap.time ?? 0)`.
//
// Tap-type classification reuses the canonical resolver from the player's
// `practice-steps.ts` (`buildTapTypeResolver` / `resolveTapType`) — the
// backend identifiers `video` / `full-audio` / `5min-audio` live there and
// must NOT be duplicated here.

import type { AudioPref } from "~/lib/audio-preference";
import {
  buildTapTypeResolver,
  isPreviewTap,
  isSliderTap,
  resolveTapType,
  type PracticeTap,
  type PracticeTapType,
} from "~/routes/classrooms_.$groupId.$curriculumId_.$lessonId/_components/practice-steps";

/** The media character of a series card, keyed off its resolved tap types. */
export type CardMediaShape =
  | "video"
  | "full-audio"
  | "5min-audio"
  | "both-audios"
  | "none";

/** Raw minutes for a single media tap (floored `tap.time`). */
export interface MediaDuration {
  minutes: number;
}

/**
 * Compact, serializable descriptor of a class's media taps. `shape` drives
 * which pill (if any) a card renders; the per-tap minutes let the pill (and,
 * from step-3, the two-segment tabs) show the right label. `video` is omitted
 * (not `undefined`) when absent, per `exactOptionalPropertyTypes`.
 */
export interface CardMediaDescriptor {
  shape: CardMediaShape;
  /** An `ie-journal` tap is present (drives the bottom-left journal icon). */
  hasJournal: boolean;
  /**
   * A `slider` tap is present (drives the bottom-left slide-show icon). Slider
   * has no duration, so it never affects `shape` / `primaryDurationMinutes` — a
   * slider-only class stays `shape: "none"` and shows only the icon.
   */
  hasSlider: boolean;
  /**
   * A `preview` (educator-deck) tap is present. Drives the two-button
   * Preview / Start-Lesson treatment on the card in place of the duration pill.
   * Like `slider`, preview taps carry no duration, so this never affects
   * `shape` / `primaryDurationMinutes` — a preview-only class stays
   * `shape: "none"`.
   */
  hasPreview: boolean;
  video?: MediaDuration;
  audios: {
    "full-audio"?: MediaDuration;
    "5min-audio"?: MediaDuration;
  };
}

/** Format a floored-minutes value as the card pill label, e.g. `"9 min"`. */
export function formatMinutesLabel(minutes: number): string {
  return `${minutes} min`;
}

/**
 * The single-label minutes for a card, i.e. what the "N min" pill shows: the
 * video tap's minutes for a `video` shape, the full-audio tap's minutes for a
 * `full-audio` shape, the 5-min-audio tap's minutes for a `5min-audio` shape,
 * and `null` for `both-audios` / `none` (`both-audios` gets the tabs variant;
 * `none` renders no pill).
 */
export function primaryDurationMinutes(
  descriptor: CardMediaDescriptor,
): number | null {
  const minutes =
    descriptor.shape === "video"
      ? descriptor.video?.minutes
      : descriptor.shape === "full-audio"
        ? descriptor.audios["full-audio"]?.minutes
        : descriptor.shape === "5min-audio"
          ? descriptor.audios["5min-audio"]?.minutes
          : null;
  // Treat missing / non-positive minutes (e.g. a legacy tap whose `time` was
  // never written, so `tapMinutes` floored to 0) as "no duration" — the card
  // renders no pill rather than a misleading "0 min" label (Q1 soft-degrade).
  return minutes != null && minutes > 0 ? minutes : null;
}

/** One segment of the both-audios tabs pill: the tap type it selects (the
 *  persisted preference value) plus its floored-minutes label. */
export interface AudioTabOption {
  type: AudioPref;
  minutes: number;
}

/**
 * The two options for a `both-audios` card's tabs pill, left-to-right
 * (5-min then full — matching the "5 min | 9 min" screenshot). Returns `null`
 * for any non-`both-audios` shape (those render the single-label pill or
 * nothing). Minutes are each tap's floored `tap.time`.
 */
export function audioTabOptions(
  descriptor: CardMediaDescriptor,
): [AudioTabOption, AudioTabOption] | null {
  if (descriptor.shape !== "both-audios") return null;
  const five = descriptor.audios["5min-audio"];
  const full = descriptor.audios["full-audio"];
  if (!five || !full) return null;
  return [
    { type: "5min-audio", minutes: five.minutes },
    { type: "full-audio", minutes: full.minutes },
  ];
}

/** Floor a tap's raw `time` (already minutes for correctly-saved taps). */
function tapMinutes(tap: PracticeTap): number {
  return Math.floor(tap.time ?? 0);
}

/**
 * Derive the media descriptor for a SINGLE class's taps. Non-deleted taps are
 * classified by resolved identifier (first of each kind wins); shape follows:
 *   - both `full-audio` and `5min-audio` present → `both-audios`
 *   - `full-audio` only → `full-audio`
 *   - `5min-audio` only → `5min-audio`
 *   - a `video` present (and none of the above) → `video`
 *   - otherwise → `none`
 */
export function deriveCardMedia(
  taps: readonly PracticeTap[],
  resolver?: ReadonlyMap<string, string>,
): CardMediaDescriptor {
  let video: MediaDuration | undefined;
  let fullAudio: MediaDuration | undefined;
  let fiveMinAudio: MediaDuration | undefined;
  let hasJournal = false;
  let hasSlider = false;
  let hasPreview = false;

  for (const tap of taps) {
    if (tap.deleted) continue;
    const type = resolveTapType(tap, resolver);
    if (type === "video") {
      if (!video) video = { minutes: tapMinutes(tap) };
    } else if (type === "full-audio") {
      if (!fullAudio) fullAudio = { minutes: tapMinutes(tap) };
    } else if (type === "5min-audio") {
      if (!fiveMinAudio) fiveMinAudio = { minutes: tapMinutes(tap) };
    } else if (type === "ie-journal" || type === "journal") {
      // Journal tap identifiers (mirrors JOURNAL_TYPES in practice-steps.ts).
      hasJournal = true;
    } else if (isSliderTap(tap, resolver)) {
      // Reuse the player's canonical slider check (step-1) rather than
      // re-inlining the `"slider"` identifier here.
      hasSlider = true;
    } else if (isPreviewTap(tap, resolver)) {
      // Educator-deck preview taps: like slider they carry no duration and
      // never affect `shape` — they drive the card's two-button treatment.
      hasPreview = true;
    }
  }

  const audios: CardMediaDescriptor["audios"] = {};
  if (fullAudio) audios["full-audio"] = fullAudio;
  if (fiveMinAudio) audios["5min-audio"] = fiveMinAudio;

  let shape: CardMediaShape;
  if (fullAudio && fiveMinAudio) shape = "both-audios";
  else if (fullAudio) shape = "full-audio";
  else if (fiveMinAudio) shape = "5min-audio";
  else if (video) shape = "video";
  else shape = "none";

  const descriptor: CardMediaDescriptor = {
    shape,
    audios,
    hasJournal,
    hasSlider,
    hasPreview,
  };
  if (video) descriptor.video = video;
  return descriptor;
}

/**
 * Group a curriculum's taps by class id and derive each class's descriptor.
 * Builds the shared tap-type resolver ONCE from the platform-scoped
 * `TapTypeFindMany` catalog. Returns a plain, serializable record keyed by
 * class id, ready to return from a route loader.
 */
export function deriveCardMediaByClass(
  taps: readonly PracticeTap[],
  tapTypes: readonly PracticeTapType[],
): Record<string, CardMediaDescriptor> {
  const resolver = buildTapTypeResolver(tapTypes);
  const byClass = new Map<string, PracticeTap[]>();
  for (const tap of taps) {
    if (!tap.class || tap.deleted) continue;
    const list = byClass.get(tap.class);
    if (list) list.push(tap);
    else byClass.set(tap.class, [tap]);
  }

  const result: Record<string, CardMediaDescriptor> = {};
  for (const [classId, classTaps] of byClass) {
    result[classId] = deriveCardMedia(classTaps, resolver);
  }
  return result;
}
