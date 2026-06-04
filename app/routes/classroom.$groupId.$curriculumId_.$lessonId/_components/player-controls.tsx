import type { MouseEvent } from "react";
import { Loader2, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";

// Glass transport controls for the fullscreen lesson player. Rebuilt from
// scratch against the prototype's `PracticeControls` (visual reference only):
// progress scrub + click-to-seek, ±15s skip, play/pause (buffering spinner),
// and a volume slider. Literal glass values are transcribed deliberately
// (white-translucent gradient + backdrop-blur + soft shadow).

interface PlayerControlsProps {
  isPlaying: boolean;
  /** Disables play/pause (e.g. media still loading). */
  isLoading: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  /** 0–100. */
  volume: number;
  /** 0–100. */
  progress: number;
  onTogglePlayPause: () => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onProgressClick: (e: MouseEvent<HTMLDivElement>) => void;
  formatTime: (seconds: number) => string;
}

export function PlayerControls({
  isPlaying,
  isLoading,
  isBuffering,
  currentTime,
  duration,
  volume,
  progress,
  onTogglePlayPause,
  onSkip,
  onVolumeChange,
  onProgressClick,
  formatTime,
}: PlayerControlsProps) {
  return (
    <div
      className="w-full max-w-md rounded-3xl p-8 transition-all duration-500"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px rgba(255,255,255,0.05)",
        transitionDelay: "0.15s",
      }}
    >
      {/* Scoped styling for the native range thumb (prototype leaned on global CSS). */}
      <style>{`
        .lesson-volume {
          -webkit-appearance: none;
          appearance: none;
        }
        .lesson-volume::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          cursor: pointer;
        }
        .lesson-volume::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border: none;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          cursor: pointer;
        }
      `}</style>

      {/* Progress Bar */}
      <div className="mb-6">
        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(currentTime)}
          tabIndex={0}
          className="h-2 w-full cursor-pointer overflow-hidden rounded-full"
          style={{ background: "rgba(255, 255, 255, 0.15)" }}
          onClick={onProgressClick}
        >
          <div
            className="h-full rounded-full transition-[width] duration-100"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, rgba(134, 239, 172, 0.8), rgba(74, 222, 128, 0.9))",
              boxShadow: "0 0 10px rgba(134, 239, 172, 0.5)",
            }}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <span className="font-sans text-xs text-white/50">
            {formatTime(currentTime)}
          </span>
          <span className="font-sans text-xs text-white/50">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Playback Buttons */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onSkip(-15)}
          aria-label="Skip back 15 seconds"
          className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <SkipBack className="h-5 w-5 text-white" />
        </button>

        <button
          type="button"
          onClick={onTogglePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {isLoading || isBuffering ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          ) : isPlaying ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="ml-1 h-8 w-8 text-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSkip(15)}
          aria-label="Skip forward 15 seconds"
          className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <SkipForward className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center gap-3">
        <Volume2 className="h-4 w-4 text-white/50" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="Volume"
          className="lesson-volume h-1 w-32 cursor-pointer appearance-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            background: `linear-gradient(to right, rgba(134, 239, 172, 0.8) ${volume}%, rgba(255,255,255,0.15) ${volume}%)`,
          }}
        />
      </div>
    </div>
  );
}
