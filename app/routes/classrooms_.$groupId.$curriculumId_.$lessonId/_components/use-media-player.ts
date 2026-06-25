import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, RefObject } from "react";
import { trackContentPlayed } from "~/lib/analytics";

// Ported from `ie-prototype/src/hooks/useMediaPlayer.ts` — rebuilt for this
// codebase (React 19 ref typing, SSR-guarded localStorage). Drives a single
// <video> or <audio> element: play/pause, ±15s skip, click-to-seek, volume
// (0–100, persisted), buffering state, and mm:ss formatting. Emits a
// `content_played` Amplitude event with real listened seconds on natural stop
// boundaries (pause / end / unmount). Otherwise UI only — no backend.

/**
 * Max plausible forward jump (seconds) between two `timeupdate` ticks that
 * still counts as real-time playback. `timeupdate` fires ~4×/sec, so genuine
 * progress per tick is well under a second; anything larger is a seek/scrub and
 * is excluded from the accumulated listened time. Generous enough to tolerate a
 * stalled/background tab without crediting a real seek.
 */
const MAX_FORWARD_STEP_S = 2;

interface UseMediaPlayerOptions {
  /** Called when the media finishes playing. */
  onEnded?: () => void;
  /** Initial volume (0–100). Overrides any persisted value. */
  initialVolume?: number;
  /** localStorage key for persisting volume. */
  volumeStorageKey?: string;
  /** Identifier of the played content (the tap `_id`) for `content_played`. */
  contentId?: string;
  /** Resolved tap-type slug (e.g. `audio`/`video`) for `content_played`. */
  tapType?: string;
}

export interface UseMediaPlayerReturn {
  /** Ref to attach to the <audio> or <video> element. */
  mediaRef: RefObject<HTMLMediaElement | null>;
  /** Whether the media is currently playing. */
  isPlaying: boolean;
  /** Whether the media is buffering. */
  isBuffering: boolean;
  /** Current playback time in seconds. */
  currentTime: number;
  /** Total duration in seconds. */
  duration: number;
  /** Current volume (0–100). */
  volume: number;
  /** Progress percentage (0–100). */
  progress: number;
  /** Toggle play/pause. */
  togglePlayPause: () => void;
  /** Skip forward (+) or backward (−) by seconds. */
  skip: (seconds: number) => void;
  /** Seek to a specific time (seconds). */
  seekTo: (time: number) => void;
  /** Handle a click on the progress bar (seeks to the clicked position). */
  handleProgressClick: (e: MouseEvent<HTMLDivElement>) => void;
  /** Set volume (0–100). */
  setVolume: (volume: number) => void;
  /** Pause the media. */
  pause: () => void;
  /** Play the media. */
  play: () => void;
  /** Format seconds as mm:ss. */
  formatTime: (seconds: number) => string;
  /** Event handlers to spread onto the media element. */
  mediaEventHandlers: {
    onTimeUpdate: () => void;
    onLoadedMetadata: () => void;
    onEnded: () => void;
    onError: () => void;
    onWaiting: () => void;
    onPlay: () => void;
    onPlaying: () => void;
    onPause: () => void;
  };
}

const DEFAULT_VOLUME = 75;

export function useMediaPlayer({
  onEnded,
  initialVolume,
  volumeStorageKey = "audio-player-volume",
  contentId,
  tapType,
}: UseMediaPlayerOptions = {}): UseMediaPlayerReturn {
  const mediaRef = useRef<HTMLMediaElement | null>(null);

  // Initialize volume from localStorage (SSR-guarded) or default.
  const [volume, setVolumeState] = useState(() => {
    if (initialVolume !== undefined) return initialVolume;
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(volumeStorageKey);
      return saved ? Number(saved) : DEFAULT_VOLUME;
    }
    return DEFAULT_VOLUME;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Whether the user/page actually intends playback. Mutated ONLY by the
  // explicit play()/pause() controls and natural end — never by media events.
  // Used to reject playback the browser starts on its own (notably auto-resume
  // when the machine wakes from sleep): the user paused, so it stays paused
  // until they press play again.
  const intendedPlayingRef = useRef(false);

  // Listened-time accounting for the `content_played` event.
  //  - `lastTimeRef`: the previous `timeupdate` position, used to derive the
  //    per-tick delta. `null` means "no baseline yet" (just started/seeked).
  //  - `playedSinceEmitRef`: accumulated real-time forward playback (seconds)
  //    since the last emit. Seek jumps (large/negative deltas) are excluded.
  const lastTimeRef = useRef<number | null>(null);
  const playedSinceEmitRef = useRef(0);

  // Keep the latest content identifiers in refs so the unmount cleanup (which
  // runs once, with empty deps) reads current values rather than stale ones.
  const contentIdRef = useRef(contentId);
  const tapTypeRef = useRef(tapType);
  useEffect(() => {
    contentIdRef.current = contentId;
    tapTypeRef.current = tapType;
  }, [contentId, tapType]);

  // Emit the accumulated listened seconds (if any) and reset the accumulator.
  // Called on natural stop boundaries (pause / end / unmount) — never per
  // `timeupdate`. `trackContentPlayed` itself no-ops on SSR / uninitialized /
  // sub-1s, so this is safe to call unconditionally.
  const emitPlayed = useCallback(() => {
    const seconds = playedSinceEmitRef.current;
    playedSinceEmitRef.current = 0;
    lastTimeRef.current = null;
    if (seconds <= 0) return;
    const props: { seconds: number; contentId?: string; tapType?: string } = {
      seconds,
    };
    if (contentIdRef.current) props.contentId = contentIdRef.current;
    if (tapTypeRef.current) props.tapType = tapTypeRef.current;
    trackContentPlayed(props);
  }, []);

  // Sync volume to the media element and persist it.
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = volume / 100;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(volumeStorageKey, String(volume));
    }
  }, [volume, volumeStorageKey]);

  // Flush any listened time on unmount (e.g. navigating away mid-play before a
  // pause/end fires). `emitPlayedRef` keeps the cleanup reading the latest
  // closure while the effect itself runs only once.
  const emitPlayedRef = useRef(emitPlayed);
  emitPlayedRef.current = emitPlayed;
  useEffect(() => {
    return () => {
      emitPlayedRef.current();
    };
  }, []);

  // Media event handlers.
  const handleTimeUpdate = useCallback(() => {
    if (!mediaRef.current) return;
    const now = mediaRef.current.currentTime;
    setCurrentTime(now);

    // Accumulate only real forward playback. A negative delta (rewind/seek
    // back) or a forward jump larger than one plausible tick (skip / scrub /
    // click-to-seek) is a seek, not listening — reset the baseline without
    // crediting it. The first tick after start/seek (`null` baseline) only
    // establishes the baseline.
    const last = lastTimeRef.current;
    if (last !== null) {
      const delta = now - last;
      if (delta > 0 && delta <= MAX_FORWARD_STEP_S) {
        playedSinceEmitRef.current += delta;
      }
    }
    lastTimeRef.current = now;
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
      mediaRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleEnded = useCallback(() => {
    intendedPlayingRef.current = false;
    setIsPlaying(false);
    emitPlayed(); // flush listened time before resetting position to 0
    setCurrentTime(0);
    onEnded?.();
  }, [onEnded, emitPlayed]);

  const handleWaiting = useCallback(() => setIsBuffering(true), []);

  // A media load/playback error is terminal — advance the runner rather than
  // hang on an unplayable source (defensive: the tap-type fix removes the known
  // empty-src journal case, leaving only genuinely broken URLs). `error` and
  // `ended` are mutually exclusive, so this never double-advances.
  const handleError = useCallback(() => {
    intendedPlayingRef.current = false;
    setIsPlaying(false);
    setIsBuffering(false);
    onEnded?.();
  }, [onEnded]);

  // Playback began. If it started without an explicit play() recording intent
  // (e.g. the browser auto-resuming after the machine wakes), re-pause so a
  // user-paused track never resumes on its own.
  const handlePlay = useCallback(() => {
    if (!intendedPlayingRef.current) mediaRef.current?.pause();
  }, []);
  const handlePlaying = useCallback(() => {
    if (!intendedPlayingRef.current) {
      mediaRef.current?.pause();
      return;
    }
    setIsBuffering(false);
    setIsPlaying(true);
  }, []);
  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // Natural stop boundary — flush the listened delta. `handleEnded` fires its
    // own `emitPlayed` and resets the accumulator first, so the `pause` the
    // browser raises right after `ended` finds nothing left to emit (no double
    // count).
    emitPlayed();
  }, [emitPlayed]);

  // Playback controls.
  const play = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    intendedPlayingRef.current = true;
    setIsPlaying(true);
    void el.play().catch(() => {
      // Playback blocked (e.g. browser autoplay policy) — reflect reality so
      // the controls show "play" and the intent flag doesn't lie.
      intendedPlayingRef.current = false;
      setIsPlaying(false);
    });
  }, []);

  const pause = useCallback(() => {
    intendedPlayingRef.current = false;
    if (mediaRef.current) {
      mediaRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const skip = useCallback(
    (seconds: number) => {
      if (!mediaRef.current) return;
      mediaRef.current.currentTime = Math.max(
        0,
        Math.min(mediaRef.current.currentTime + seconds, duration),
      );
    },
    [duration],
  );

  const seekTo = useCallback(
    (time: number) => {
      if (!mediaRef.current) return;
      mediaRef.current.currentTime = Math.max(0, Math.min(time, duration));
    },
    [duration],
  );

  const handleProgressClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!mediaRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      mediaRef.current.currentTime = percent * duration;
    },
    [duration],
  );

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(100, newVolume)));
  }, []);

  const formatTime = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    mediaRef,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    progress,
    togglePlayPause,
    skip,
    seekTo,
    handleProgressClick,
    setVolume,
    pause,
    play,
    formatTime,
    mediaEventHandlers: {
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleLoadedMetadata,
      onEnded: handleEnded,
      onError: handleError,
      onWaiting: handleWaiting,
      onPlay: handlePlay,
      onPlaying: handlePlaying,
      onPause: handlePause,
    },
  };
}
