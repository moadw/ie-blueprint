import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Printer,
} from "lucide-react";
import type { SliderSlide } from "./practice-steps";
import type { PrintableSlide } from "~/lib/slides-print";
import {
  exportSlidesPdf,
  openSlidesInNewTab,
  printSlides,
} from "~/lib/slides-print";

// Glass pill / circle recipe — the same white-translucent + backdrop-blur +
// light border treatment used by `player-stage.tsx` / `player-controls.tsx`.
// Transcribed from the prototype's `LessonView` `glass` const (blur 12px);
// `WebkitBackdropFilter` added for Safari (matches PlayerStage's close button).
const GLASS = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
} as const;

// Soft drop shadow + hairline border for the slide card (prototype `:159-163`).
const CARD_STYLE = {
  boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
} as const;

interface SliderStageProps {
  /** Ordered slides for this class (from `buildSliderStep`). */
  slides: SliderSlide[];
  /** Class title shown as the centered serif header. */
  title: string;
  /** Back / Escape (when not in fullscreen) → curriculum. */
  onExit: () => void;
  /** Fired when the last slide is reached → records completion (route). */
  onReachLastSlide: () => void;
  /** Next on the last slide → journal (if any) or exit (route `advance`). */
  onAdvancePastEnd: () => void;
}

/**
 * Map the lesson step model's slides → the export helper's minimal
 * `PrintableSlide[]`. An image slide prints its `url`; a video slide prints its
 * poster (`posterUrl`) when present, else no image (a text placeholder).
 *
 * `PrintableSlide.imageUrl` is optional and `posterUrl` is `string | undefined`,
 * so the video branch MUST omit `imageUrl` when the poster is absent (a
 * conditional spread) — assigning `posterUrl` directly would violate
 * `exactOptionalPropertyTypes`. Mirrors `milestonePropsForPin`'s omit-when-absent
 * pattern in `practice-steps.ts`.
 */
function toPrintable(slides: readonly SliderSlide[]): PrintableSlide[] {
  return slides.map((slide) =>
    slide.media === "image"
      ? { imageUrl: slide.url, title: slide.title }
      : {
          ...(slide.posterUrl ? { imageUrl: slide.posterUrl } : {}),
          title: slide.title,
        },
  );
}

/**
 * Fullscreen slide viewer for a `slider` practice. Renders one slide at a time
 * (image = `<img>`, video = autoplay `<video controls>` — manual advance, no
 * `onEnded` navigation) with the prototype chrome: Back top-left, centered serif
 * title, bottom-center prev/next arrows + clickable dots, bottom-right Export
 * PDF / Print / New Tab, a fullscreen toggle, and keyboard nav.
 *
 * Rebuilt from `ie-prototype/src/pages/LessonView.tsx` (VISUAL REFERENCE ONLY)
 * with our tokens + the shared glass recipe — the prototype JSX is not copied.
 *
 * Forward affordance: the next arrow is ALWAYS rendered (never gated behind
 * `slides.length > 1`) so a single-slide deck followed by a journal still has a
 * visible way forward — on the last slide `goNext` calls `onAdvancePastEnd`
 * (journal/exit) instead of clamping. The multi-dot row is the only element
 * gated on `> 1`.
 *
 * Completion: a `useEffect` keyed on reaching the last slide fires
 * `onReachLastSlide` (the route's `recordCompletion`, idempotent). For a
 * 1-slide deck this fires on mount — intended per plan Decision 2 (marked
 * complete the instant the viewer opens).
 */
export function SliderStage({
  slides,
  title,
  onExit,
  onReachLastSlide,
  onAdvancePastEnd,
}: SliderStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lastIndex = slides.length - 1;

  // Latest-value refs so the keydown / completion effects don't have to list the
  // route's (unmemoized) callbacks — or the live index / fullscreen flag — in
  // their dependency arrays. Initialized with the first value, then kept current
  // by the sync effect below (declared first so it commits before the
  // completion effect reads a callback ref).
  const currentIndexRef = useRef(currentIndex);
  const isFullscreenRef = useRef(isFullscreen);
  const onExitRef = useRef(onExit);
  const onReachLastSlideRef = useRef(onReachLastSlide);
  const onAdvancePastEndRef = useRef(onAdvancePastEnd);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    isFullscreenRef.current = isFullscreen;
    onExitRef.current = onExit;
    onReachLastSlideRef.current = onReachLastSlide;
    onAdvancePastEndRef.current = onAdvancePastEnd;
  });

  // Next: advance one slide, or — when already on the last slide — hand off to
  // the route (`onAdvancePastEnd` → journal/exit). Reads the live index via ref
  // so the callback stays stable (no per-render re-bind of the keydown effect).
  const goNext = useCallback(() => {
    const i = currentIndexRef.current;
    if (i >= slides.length - 1) {
      onAdvancePastEndRef.current();
    } else {
      setCurrentIndex(i + 1);
    }
  }, [slides.length]);

  const goPrev = useCallback(() => {
    const i = currentIndexRef.current;
    if (i > 0) setCurrentIndex(i - 1);
  }, []);

  const toggleFullscreen = useCallback(() => setIsFullscreen((v) => !v), []);

  // Keyboard: ←/→/space navigate, `f` toggles fullscreen, `esc` exits
  // fullscreen (if on) else the viewer. Attached once — `goNext`/`goPrev`/
  // `toggleFullscreen` are stable, and the index / fullscreen / callbacks are
  // read via refs.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        if (isFullscreenRef.current) setIsFullscreen(false);
        else onExitRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, toggleFullscreen]);

  // Completion: fire when the last slide is reached (also on mount for a
  // 1-slide deck — Decision 2). The route's `recordCompletion` is ref-guarded,
  // so repeated calls are safe.
  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      onReachLastSlideRef.current();
    }
  }, [currentIndex, slides.length]);

  // Guard for `noUncheckedIndexedAccess`: an out-of-range index renders nothing.
  const slide = slides[currentIndex];
  if (!slide) return null;

  // Slide card grows toward the viewport in fullscreen (prototype `slideMaxH`).
  const slideMaxH = isFullscreen
    ? "max-h-[calc(100vh-3rem)]"
    : "max-h-[calc(100vh-22rem)]";

  const printable = () => toPrintable(slides);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Header — hidden in fullscreen. Back top-LEFT, serif title centered. */}
      {!isFullscreen ? (
        <header className="relative z-20 flex shrink-0 items-center justify-center px-8 pt-12 pb-10">
          <button
            type="button"
            onClick={onExit}
            className="absolute left-8 flex items-center gap-2 rounded-full px-4 py-2 text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={GLASS}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h1 className="text-center font-serif text-2xl text-white md:text-3xl">
            {title}
          </h1>
        </header>
      ) : null}

      {/* Slide area. */}
      <div
        className={`relative z-10 flex min-h-0 flex-1 items-center justify-center transition-all duration-300 ${
          isFullscreen ? "px-4 py-2" : "px-8 py-6"
        }`}
      >
        <div
          className={`relative flex w-full items-center justify-center ${
            isFullscreen ? "max-w-[95vw]" : "max-w-5xl"
          }`}
        >
          {/* Fullscreen-only side arrows. Prev disabled at index 0; next always
              enabled (past the end → onAdvancePastEnd). */}
          {isFullscreen ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                aria-label="Previous slide"
                className="absolute left-0 z-30 flex h-12 w-12 -translate-x-16 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={GLASS}
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next slide"
                className="absolute right-0 z-30 flex h-12 w-12 translate-x-16 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={GLASS}
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </>
          ) : null}

          {/* Slide card. `key={currentIndex}` remounts the media on slide change
              (a new video autoplays; the old one stops). */}
          <div className="relative overflow-hidden rounded-2xl" style={CARD_STYLE}>
            {slide.media === "video" ? (
              <video
                key={currentIndex}
                src={slide.url}
                className={`max-w-full ${slideMaxH} rounded-2xl`}
                autoPlay
                controls
                playsInline
              />
            ) : (
              <img
                key={currentIndex}
                src={slide.url}
                alt={slide.title || `Slide ${currentIndex + 1}`}
                className={`max-w-full ${slideMaxH} rounded-2xl object-contain`}
              />
            )}

            {slide.title ? (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl px-6 py-4"
                style={{
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                }}
              >
                <p className="font-sans text-sm text-white/90">{slide.title}</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-all hover:scale-110 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={GLASS}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom controls — hidden in fullscreen. Arrows always render (forward
          affordance); the multi-dot row only when there's more than one slide. */}
      {!isFullscreen ? (
        <div className="relative z-20 flex h-40 shrink-0 flex-col items-center justify-between pb-6 pt-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
              className="flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={GLASS}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={GLASS}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>

          {slides.length > 1 ? (
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  style={{
                    width: i === currentIndex ? 24 : 8,
                    height: 8,
                    background:
                      i === currentIndex
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.3)",
                  }}
                />
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      ) : null}

      {/* Export actions — fixed bottom-right, dimmed (hover to reveal) in
          fullscreen. */}
      <div
        className={`fixed bottom-6 right-8 z-30 flex items-center gap-2 transition-opacity duration-300 ${
          isFullscreen ? "opacity-40 hover:opacity-100" : "opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => exportSlidesPdf(title, printable())}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={GLASS}
        >
          <Download className="h-3.5 w-3.5" />
          Export PDF
        </button>
        <button
          type="button"
          onClick={() => printSlides(title, printable())}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={GLASS}
        >
          <Printer className="h-3.5 w-3.5" />
          Print
        </button>
        <button
          type="button"
          onClick={() => openSlidesInNewTab(title, printable())}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={GLASS}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          New Tab
        </button>
      </div>
    </div>
  );
}
