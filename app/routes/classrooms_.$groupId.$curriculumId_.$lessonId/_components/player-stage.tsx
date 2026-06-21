import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { X } from "lucide-react";
import glassBackground from "~/assets/glass-background.webp";
import { useHydrated } from "~/hooks/use-hydrated";
import { useMediaPlayer } from "./use-media-player";
import {
  getBackgroundStyle,
  getControlsStyle,
  getOverlayStyle,
  type PlayerPhase,
} from "./player-styles";
import { PlayerControls } from "./player-controls";

interface PlayerStageProps {
  /** Whether to render the video path or the audio (still-background) path. */
  media: "audio" | "video";
  /** Serif title shown above the controls. */
  title: string;
  /** Supporting copy under the title. */
  description: string;
  /** Day badge label, e.g. `Day 3` (rendered uppercased). */
  dayLabel: string;
  /** Grade label shown after the day in the badge, e.g. `Grades 3–5`. */
  gradeLabel: string;
  /** Series / curriculum display name shown below the controls. */
  seriesName: string;
  /** Source URL for the `<video>` / `<audio>` element. */
  mediaUrl: string;
  /** Identifier of the played content (tap `_id`) for the `content_played` event. */
  contentId?: string;
  /** Resolved tap-type slug (e.g. `audio`/`video`) for the `content_played` event. */
  tapType?: string;
  /**
   * Optional background image for the audio (still-background) path. When
   * omitted, the bundled `glass-background.webp` asset is used.
   */
  backgroundImageUrl?: string;
  /** Whether the feedback overlay is showing — the player stays mounted but its chrome hides. */
  showFeedback?: boolean;
  /** Close (X) → curriculum page. */
  onExit: () => void;
  /** Playback finished → parent advances `stage` to `after`. */
  onEnded: () => void;
}

const IDLE_MS = 5000;
const ENTER_DELAY_MS = 100;
const AUTOPLAY_DELAY_MS = 200;
const EXIT_DELAY_MS = 700;

/**
 * Fullscreen lesson player. The media element + auto-play are gated behind
 * `useHydrated()` so the SSR render is inert (no `<video>`/`<audio>` on the
 * server). The background eases in (`entering → ready → exiting`), the chrome
 * auto-hides after 5s of no pointer movement, and real `onEnded` advances the
 * stage. Rebuilt from the prototype's `Practice.tsx` (visual reference only).
 */
export function PlayerStage({
  media,
  title,
  description,
  dayLabel,
  gradeLabel,
  seriesName,
  mediaUrl,
  contentId,
  tapType,
  backgroundImageUrl,
  showFeedback = false,
  onExit,
  onEnded,
}: PlayerStageProps) {
  const hydrated = useHydrated();
  const isVideo = media === "video";

  const [phase, setPhase] = useState<PlayerPhase>("entering");
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAutoPlayedRef = useRef(false);

  const {
    mediaRef,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    progress,
    togglePlayPause,
    skip,
    handleProgressClick,
    setVolume,
    play,
    pause,
    formatTime,
    mediaEventHandlers,
  } = useMediaPlayer({
    volumeStorageKey: "practice-volume",
    onEnded,
    ...(contentId ? { contentId } : {}),
    ...(tapType ? { tapType } : {}),
  });

  // Entrance: flip to `ready` shortly after mount so the CSS transition runs.
  useEffect(() => {
    const timer = setTimeout(() => setPhase("ready"), ENTER_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play once the media is mounted (post-hydration) and we're `ready`.
  useEffect(() => {
    if (!hydrated || phase !== "ready" || hasAutoPlayedRef.current) return;
    const timer = setTimeout(() => {
      if (hasAutoPlayedRef.current || !mediaRef.current) return;
      hasAutoPlayedRef.current = true;
      // Route through the hook's play() so it records play intent (and handles
      // a blocked autoplay). Keeps the wake-from-sleep guard consistent: only
      // intent-bearing play() calls are allowed to start playback.
      play();
    }, AUTOPLAY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hydrated, phase, mediaRef, play]);

  // Idle detection: hide the chrome after 5s of no pointer movement.
  useEffect(() => {
    if (showFeedback) {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsIdle(true), IDLE_MS);
    };

    resetIdleTimer();
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("mousedown", resetIdleTimer);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("mousedown", resetIdleTimer);
    };
  }, [showFeedback]);

  const handleClose = useCallback(() => {
    pause();
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setPhase("exiting");
    setTimeout(onExit, EXIT_DELAY_MS);
  }, [pause, onExit]);

  const styleOptions = { phase, isIdle, showFeedback };
  const chromeVisible = phase === "ready" && !showFeedback;

  return (
    <div className="absolute inset-0">
      {/* Media element — mounts only after hydration so SSR stays inert. */}
      {hydrated && isVideo ? (
        <video
          ref={mediaRef as RefObject<HTMLVideoElement | null>}
          src={mediaUrl}
          preload="auto"
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover transition-all duration-1000 ease-out"
          style={getBackgroundStyle(styleOptions)}
          {...mediaEventHandlers}
        />
      ) : null}
      {hydrated && !isVideo ? (
        <audio
          ref={mediaRef as RefObject<HTMLAudioElement | null>}
          src={mediaUrl}
          preload="auto"
          {...mediaEventHandlers}
        />
      ) : null}

      {/* Static background for the audio path (always rendered, SSR-safe). */}
      {!isVideo ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(${backgroundImageUrl ?? glassBackground})`,
            ...getBackgroundStyle(styleOptions),
          }}
        />
      ) : null}

      {/* Gradient overlay. */}
      <div
        className="absolute inset-0 z-[1] transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.8) 100%)",
          ...getOverlayStyle(styleOptions),
        }}
      />

      {/* Close button. */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close lesson"
        className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          opacity: chromeVisible ? 1 : 0,
          transform: chromeVisible ? "translateX(0)" : "translateX(20px)",
          pointerEvents: showFeedback ? "none" : "auto",
          transitionDelay: "0.2s",
        }}
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Centered content column. */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 transition-all duration-1000 ease-out"
        style={getControlsStyle(styleOptions)}
      >
        {/* Day badge. */}
        <div
          className="mb-6 rounded-full px-4 py-2 transition-all duration-500"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            transitionDelay: "0.1s",
          }}
        >
          <span className="font-sans text-sm tracking-wider text-white/80">
            {dayLabel.toUpperCase()}
            {gradeLabel ? ` • ${gradeLabel}` : ""}
          </span>
        </div>

        {/* Title & description. */}
        <div className="mb-8 max-w-lg text-center">
          <h1
            className="mb-4 font-serif text-4xl text-white drop-shadow-lg md:text-5xl"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
          >
            {title}
          </h1>
          <p className="font-sans text-base text-white/70 md:text-lg">
            {description}
          </p>
        </div>

        {/* Transport controls. */}
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={!hydrated}
          isBuffering={isBuffering}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          progress={progress}
          onTogglePlayPause={togglePlayPause}
          onSkip={skip}
          onVolumeChange={setVolume}
          onProgressClick={handleProgressClick}
          formatTime={formatTime}
        />

        {/* Series name. */}
        <div
          className="mt-6 transition-all duration-500"
          style={{ transitionDelay: "0.25s" }}
        >
          <span className="font-sans text-sm text-white/40">
            {seriesName}
          </span>
        </div>
      </div>

      {/* Ambient glows. */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(circle, rgba(134, 239, 172, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: phase === "ready" ? 1 : 0,
        }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: phase === "ready" ? 1 : 0,
          transitionDelay: "0.3s",
        }}
      />
    </div>
  );
}
