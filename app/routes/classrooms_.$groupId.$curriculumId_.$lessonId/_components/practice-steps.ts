// Pure, testable mapping from a class's taps (+ optional pin) to an ordered
// list of "practice steps" the detail route renders. Keeping the tap-type →
// screen mapping here (not inline in the route) makes the rules reviewable in
// one place and lets the route be a thin index-driven renderer.
//
// Tap-type mapping: branch on the resolved `tap.type` identifier — `video` →
// video player, `full-audio`/`5min-audio` → audio player, `ie-journal` →
// JournalScreen. Any unknown non-journal type defaults to the player. Media URL
// = first `tap.videos[]` entry (`videos[0].url`); audio-vs-video derived from
// the resolved type (fallback `videos[0].type`). Journal prompt = `tap.intro`
// (fallback first `extraQuestions[].question`).
//
// IMPORTANT — use the REAL backend identifiers. The source of truth is
// `main.taptype` / `admin/tap-dialog.tsx`: `ie-journal`, `video`, `full-audio`,
// `5min-audio` (NOT the teacher-flow slugs `journal`/`audio`). The branching
// sets below key on these; the legacy slugs are kept only as harmless aliases
// for older data. (See project memory "Admin TapType identifiers".)
//
// Robust tap-type resolution: `tap.type` may hold EITHER the tap-type
// identifier (e.g. "ie-journal"/"full-audio"/"5min-audio"/"video") OR a
// tap-type `_id`. The admin `tap-blocks.tsx` resolves labels against BOTH
// `tt.identifier` and `tt._id`, so we mirror that here: `buildTapTypeResolver`
// produces a Map from BOTH `tt._id → tt.identifier` AND `tt.identifier →
// tt.identifier`, and `resolveTapType` maps a raw `tap.type` to its canonical
// identifier before branching. When the resolver is empty or a type is unknown,
// the raw value is returned unchanged (a no-op when `tap.type` is already an
// identifier), and the existing fallback (infer audio/video from
// `videos[0].type`) still applies.

import type {
  TapFindManyQuery,
  PinFindManyQuery,
  TapTypeFindManyQuery,
} from "~/gql/graphql";
import {
  ACHIEVEMENT_DEFAULTS,
  type AchievementDefaults,
} from "./achievement-defaults";
import type { AudioPref } from "~/lib/audio-preference";

/** A single tap as returned by `TapFindMany` (generated result element type). */
export type PracticeTap = TapFindManyQuery["TapFindMany"][number];
/** A single pin as returned by `PinFindMany` (generated result element type). */
export type PracticePin = PinFindManyQuery["PinFindMany"][number];
/** A single tap-type as returned by `TapTypeFindMany` (generated element type). */
export type PracticeTapType = TapTypeFindManyQuery["TapTypeFindMany"][number];

export type MediaKind = "audio" | "video";

/**
 * A single slide within a slider step. An `image` slide renders `url` as an
 * `<img>`; a `video` slide renders `url` in a `<video>` with an optional
 * `posterUrl`. `posterUrl` is omitted entirely (never set to `undefined`) when
 * absent, per `exactOptionalPropertyTypes`.
 */
export type SliderSlide =
  | { media: "image"; url: string; title: string }
  | { media: "video"; url: string; posterUrl?: string; title: string };

/** Ordered, typed step the practice runner renders one at a time. */
export type PracticeStep =
  | { kind: "player"; media: MediaKind; tap: PracticeTap }
  | { kind: "journal"; tap: PracticeTap }
  | { kind: "slider"; slides: SliderSlide[] }
  | { kind: "achievement"; pin: PracticePin }
  | { kind: "feedback" };

// Backend `TapType.identifier`s, with legacy teacher-flow slugs kept as aliases.
/** Tap-type identifiers that route to the journal screen. */
const JOURNAL_TYPES: ReadonlySet<string> = new Set(["ie-journal", "journal"]);
/** Tap-type identifiers that route to the video player. */
const VIDEO_TYPES: ReadonlySet<string> = new Set(["video"]);
/** Tap-type identifiers that route to the audio player. */
const AUDIO_TYPES: ReadonlySet<string> = new Set([
  "full-audio",
  "5min-audio",
  "audio",
]);
/** Tap-type identifiers that route to the slider (slide-viewer) screen. */
const SLIDER_TYPES: ReadonlySet<string> = new Set(["slider"]);

/**
 * Build a resolver Map from a `TapTypeFindMany` result that maps a raw
 * `tap.type` value to its canonical identifier slug. Mirrors the admin
 * `tap-blocks.tsx` lookup (matches on BOTH `tt._id` and `tt.identifier`) so
 * resolution is correct whether `tap.type` carries a slug or a type `_id`:
 *   - `tt._id` → `tt.identifier`
 *   - `tt.identifier` → `tt.identifier`
 * Entries with no `identifier` are skipped (nothing canonical to resolve to).
 */
export function buildTapTypeResolver(
  tapTypes: readonly PracticeTapType[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const tt of tapTypes) {
    if (!tt.identifier) continue;
    map.set(tt.identifier, tt.identifier);
    if (tt._id) map.set(tt._id, tt.identifier);
  }
  return map;
}

/**
 * Resolve a tap's raw `type` to its canonical identifier slug using the
 * resolver Map. Falls back to the raw `tap.type` (lower-cased for matching)
 * when there is no map entry — a no-op when `tap.type` is already a slug or the
 * map is empty.
 */
export function resolveTapType(
  tap: PracticeTap,
  resolver?: ReadonlyMap<string, string>,
): string | undefined {
  const raw = tap.type ?? undefined;
  if (!raw) return undefined;
  return resolver?.get(raw) ?? raw;
}

/** True when a resolved tap-type slug routes to the journal screen. */
function isJournalType(type: string | undefined): boolean {
  return type != null && JOURNAL_TYPES.has(type);
}

/**
 * True when this tap should render in the journal screen rather than the
 * player. Pass the resolver so a tap whose `type` is a `_id` resolves to its
 * `journal` slug before the check.
 */
export function isJournalTap(
  tap: PracticeTap,
  resolver?: ReadonlyMap<string, string>,
): boolean {
  return isJournalType(resolveTapType(tap, resolver));
}

/**
 * True when this tap should render in the slider (slide-viewer) screen rather
 * than the player/journal. Pass the resolver so a tap whose `type` is a `_id`
 * resolves to its `slider` slug before the check. Exported because the
 * curriculum card indicator (card-media) reuses it to detect slider classes.
 */
export function isSliderTap(
  tap: PracticeTap,
  resolver?: ReadonlyMap<string, string>,
): boolean {
  const type = resolveTapType(tap, resolver);
  return type != null && SLIDER_TYPES.has(type);
}

/**
 * Audio vs video for a player tap. Derived from the resolved `tap.type` slug;
 * when the type is unknown, fall back to the first video entry's `type`,
 * defaulting to `video`.
 */
export function mediaForTap(
  tap: PracticeTap,
  resolver?: ReadonlyMap<string, string>,
): MediaKind {
  const type = resolveTapType(tap, resolver);
  if (type && VIDEO_TYPES.has(type)) return "video";
  if (type && AUDIO_TYPES.has(type)) return "audio";
  // Unknown type: infer from the first video element's declared type.
  const firstVideoType = tap.videos?.[0]?.type ?? undefined;
  if (firstVideoType && firstVideoType.toLowerCase().includes("audio")) {
    return "audio";
  }
  return "video";
}

/**
 * Source URL for a player tap's media. The schema models a tap's media as a
 * `videos[]` array for both audio and video taps; the first entry's `url` is
 * the playable source. Returns `""` when no playable url exists (guarded for
 * `noUncheckedIndexedAccess`); the caller decides how to handle an empty src.
 */
export function mediaUrlForTap(tap: PracticeTap): string {
  return tap.videos?.[0]?.url ?? "";
}

/**
 * The `questions` entity id a journal tap references for its prompt. It lives in
 * `extraQuestions[0].question` (mirrors the admin `tap-blocks.tsx`) and holds an
 * id — NOT the prompt text. Resolve it to a label via `QuestionsFindMany` (see
 * `resolveJournalQuestionLabels`). Returns `null` when the tap has no question.
 */
export function journalQuestionId(tap: PracticeTap): string | null {
  return (
    tap.extraQuestions?.find(
      (q): q is NonNullable<typeof q> => Boolean(q?.question),
    )?.question ?? null
  );
}

/**
 * Display prompt for a journal tap. Prefers the resolved `questions.label` (the
 * real prompt) keyed by the tap's `journalQuestionId`, then any `tap.intro`
 * lead-in. NEVER returns the raw question id: `extraQuestions[].question` holds
 * an id, so surfacing it directly rendered a UUID where the prompt should be.
 * Pass the `questionLabels` map (id → label) resolved in the loader; without it
 * the function falls back to `tap.intro` then `""`.
 */
export function journalPromptForTap(
  tap: PracticeTap,
  questionLabels?: Readonly<Record<string, string>>,
): string {
  const qid = journalQuestionId(tap);
  if (qid && questionLabels?.[qid]) return questionLabels[qid];
  if (tap.intro) return tap.intro;
  return "";
}

/** `MilestoneScreen` props derived from a pin + class title. */
export interface MilestoneProps extends AchievementDefaults {
  title: string;
  subtitle: string;
  videoUrl?: string;
  imageUrl?: string;
}

/**
 * Map an `achievement` step's pin → `MilestoneScreen` props. The pin supplies
 * the title (`pin.label`), its badge **image** (`pin.cover`), and an OPTIONAL
 * celebration **video** (`pin.video`); the icon/colors fall back to
 * `ACHIEVEMENT_DEFAULTS` only when the pin has no cover image. `subtitle` is the
 * class title, falling back to "Practice Complete".
 *
 * IMPORTANT — the two media fields are distinct and must not be crossed:
 *   - `pin.cover` → `imageUrl`: the uploaded badge artwork, rendered as an
 *     `<img>` on the milestone tile (the generic trophy icon is only the
 *     no-image fallback).
 *   - `pin.video` → `videoUrl`: the optional celebration video that plays as
 *     the immersive background. ONLY this feeds the `<video>` element.
 * Feeding the cover image into `<video>` (an earlier fallback) hung the
 * transition — an image never fires `loadeddata`/`ended` — blanking the screen.
 *
 * `videoUrl` / `imageUrl` are omitted entirely (not set to `undefined`) when
 * absent, per `exactOptionalPropertyTypes`. A missing `videoUrl` takes the
 * `ImmersiveVideoTransition` no-video path (straight to content).
 */
export function milestonePropsForPin(
  pin: PracticePin,
  classTitle: string | null | undefined,
): MilestoneProps {
  const videoUrl = pin.video?.url ?? undefined;
  const imageUrl = pin.cover?.url ?? undefined;
  const base: MilestoneProps = {
    ...ACHIEVEMENT_DEFAULTS,
    title: pin.label ?? "",
    subtitle: classTitle ?? "Practice Complete",
    ...(imageUrl ? { imageUrl } : {}),
  };
  return videoUrl ? { ...base, videoUrl } : base;
}

/**
 * The distinguishable audio-length identifier for a tap, or `null` when the tap
 * is not an audio tap OR is a legacy generic `"audio"` (which can't be told
 * apart as 5-min vs full). Branches on {@link resolveTapType} — NOT
 * {@link mediaForTap}, which collapses both audio lengths into `"audio"` and so
 * cannot distinguish `5min-audio` from `full-audio`. Because
 * `AudioPref = "full-audio" | "5min-audio"`, the matched slug IS the narrowed
 * union.
 */
function resolvedAudioLength(
  tap: PracticeTap,
  resolver?: ReadonlyMap<string, string>,
): AudioPref | null {
  const type = resolveTapType(tap, resolver);
  return type === "full-audio" || type === "5min-audio" ? type : null;
}

/**
 * Enforce a SINGLE audio when a practice contains BOTH a `full-audio` and a
 * `5min-audio` tap: keep the `preferred` length and drop the other. When only
 * one audio length is present (or none at all), the taps are returned unchanged
 * — so a missing preferred length naturally falls back to whatever audio does
 * exist. `video`, `ie-journal`, and legacy generic `"audio"` taps are never
 * touched, and the original order is preserved.
 *
 * Branches on {@link resolveTapType} (via {@link resolvedAudioLength}), never
 * {@link mediaForTap}, so the two audio lengths stay distinguishable. Threaded
 * into {@link buildPracticeSteps} by the player route so the resulting
 * `PracticeStep[]` holds at most one audio `player` step for a both-audios class.
 */
export function selectAudioTaps(
  taps: readonly PracticeTap[],
  preferred: AudioPref,
  resolver?: ReadonlyMap<string, string>,
): PracticeTap[] {
  let hasFull = false;
  let hasFive = false;
  for (const tap of taps) {
    const length = resolvedAudioLength(tap, resolver);
    if (length === "full-audio") hasFull = true;
    else if (length === "5min-audio") hasFive = true;
  }
  // Only enforce single-audio when BOTH lengths are present; otherwise the
  // existing single-audio / video-only / journal shapes pass through untouched
  // (this is also the fallback path when the preferred length is absent).
  if (!(hasFull && hasFive)) return [...taps];
  // Both present → the preferred length is guaranteed present and wins; drop
  // every distinguishable audio tap of the other length. Also keep only the
  // FIRST tap of the preferred length so the result holds at most one audio
  // `player` step even when a class has duplicate same-length taps (matches
  // `deriveCardMedia`'s first-of-each-kind rule). Non-audio (and legacy generic
  // `"audio"`) taps pass through, preserving order.
  let keptPreferred = false;
  return taps.filter((tap) => {
    const length = resolvedAudioLength(tap, resolver);
    if (length === null) return true;
    if (length !== preferred) return false;
    if (keptPreferred) return false;
    keptPreferred = true;
    return true;
  });
}

/**
 * Map a single slider tap to a slide. Prefers an IMAGE slide from
 * `tap.cover.url`; otherwise falls back to a VIDEO slide from the first
 * `videos[]` entry, whose poster prefers the video thumbnail then the cover
 * image. `title` uses `tap.title` (falling back to `""`). Returns `null` when
 * the tap has neither a cover-image url nor a playable video url (guarded for
 * `noUncheckedIndexedAccess`). `posterUrl` is omitted entirely (never set to
 * `undefined`) when absent, per `exactOptionalPropertyTypes`.
 */
export function slideForTap(tap: PracticeTap): SliderSlide | null {
  const title = tap.title ?? "";
  const coverUrl = tap.cover?.url ?? undefined;
  if (coverUrl) {
    return { media: "image", url: coverUrl, title };
  }
  const videoUrl = tap.videos?.[0]?.url ?? undefined;
  if (videoUrl) {
    const posterUrl = tap.videos?.[0]?.thumbnail?.url ?? tap.cover?.url ?? undefined;
    return posterUrl
      ? { media: "video", url: videoUrl, posterUrl, title }
      : { media: "video", url: videoUrl, title };
  }
  return null;
}

/**
 * Collapse a class's slider taps into a SINGLE slider step holding the ordered
 * slides. Each tap maps through {@link slideForTap}; taps that yield no slide
 * (no cover image and no video url) are dropped. Returns `null` when no tap
 * produces a slide, so the caller can skip inserting an empty slider step.
 */
export function buildSliderStep(
  sliderTaps: readonly PracticeTap[],
): Extract<PracticeStep, { kind: "slider" }> | null {
  const slides: SliderSlide[] = [];
  for (const tap of sliderTaps) {
    const slide = slideForTap(tap);
    if (slide) slides.push(slide);
  }
  return slides.length > 0 ? { kind: "slider", slides } : null;
}

/**
 * Build the ordered step list for a class. Steps follow a FIXED canonical order
 * by KIND, regardless of each tap's `order`:
 *   media (player) → slider → journal → feedback → achievement (pin)
 * Within the media and journal groups the taps keep their relative order (the
 * caller pre-sorts by `order`). Pass the tap-type `resolver` so taps whose
 * `type` is a `_id` resolve to their canonical slug before branching (no-op
 * when `tap.type` is already a slug or the map empty).
 *
 * Slider taps are special-cased: ALL of a class's slider taps collapse into a
 * SINGLE `slider` step (ordered slides).
 *
 * The two closing steps are optional: `includeFeedback` (gated by the caller on
 * "no existing feedback for this user + practice") pushes a `{ kind: "feedback" }`
 * step, and a non-deleted `pin` pushes an `achievement` step after it — so when
 * both exist feedback shows first and the pin is last.
 */
export function buildPracticeSteps(
  taps: readonly PracticeTap[],
  pin: PracticePin | null,
  resolver?: ReadonlyMap<string, string>,
  includeFeedback = false,
): PracticeStep[] {
  const steps: PracticeStep[] = [];

  // 1. Media (player) taps — anything that isn't a slider or journal. Relative
  //    order preserved (taps arrive pre-sorted by `order`).
  for (const tap of taps) {
    if (isSliderTap(tap, resolver) || isJournalTap(tap, resolver)) continue;
    steps.push({ kind: "player", media: mediaForTap(tap, resolver), tap });
  }

  // 2. Slider — ALL slider taps collapsed into a single ordered step.
  const sliderStep = buildSliderStep(
    taps.filter((t) => isSliderTap(t, resolver)),
  );
  if (sliderStep) steps.push(sliderStep);

  // 3. Journal taps — relative order preserved.
  for (const tap of taps) {
    if (isJournalTap(tap, resolver)) steps.push({ kind: "journal", tap });
  }

  // 4. Closing steps: feedback first, then the achievement (pin) — so when both
  //    exist the pin is the final celebratory beat after feedback.
  if (includeFeedback) {
    steps.push({ kind: "feedback" });
  }
  if (pin) {
    steps.push({ kind: "achievement", pin });
  }
  return steps;
}
