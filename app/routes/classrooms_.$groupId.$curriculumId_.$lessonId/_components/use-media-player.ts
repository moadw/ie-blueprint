import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, RefObject } from "react";

// Ported from `ie-prototype/src/hooks/useMediaPlayer.ts` — rebuilt for this
// codebase (React 19 ref typing, SSR-guarded localStorage). Drives a single
// <video> or <audio> element: play/pause, ±15s skip, click-to-seek, volume
// (0–100, persisted), buffering state, and mm:ss formatting. UI only — no
// backend.

interface UseMediaPlayerOptions {
  /** Called when the media finishes playing. */
  onEnded?: () => void;
  /** Initial volume (0–100). Overrides any persisted value. */
  initialVolume?: number;
  /** localStorage key for persisting volume. */
  volumeStorageKey?: string;
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
    onWaiting: () => void;
    onPlaying: () => void;
    onPause: () => void;
  };
}

const DEFAULT_VOLUME = 75;

export function useMediaPlayer({
  onEnded,
  initialVolume,
  volumeStorageKey = "audio-player-volume",
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

  // Sync volume to the media element and persist it.
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = volume / 100;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(volumeStorageKey, String(volume));
    }
  }, [volume, volumeStorageKey]);

  // Media event handlers.
  const handleTimeUpdate = useCallback(() => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
      mediaRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    onEnded?.();
  }, [onEnded]);

  const handleWaiting = useCallback(() => setIsBuffering(true), []);
  const handlePlaying = useCallback(() => {
    setIsBuffering(false);
    setIsPlaying(true);
  }, []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

  // Playback controls.
  const play = useCallback(() => {
    if (mediaRef.current) {
      void mediaRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
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
      onWaiting: handleWaiting,
      onPlaying: handlePlaying,
      onPause: handlePause,
    },
  };
}
