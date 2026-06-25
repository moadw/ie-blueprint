import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useHydrated } from "~/hooks/use-hydrated";

type TransitionPhase = "entering" | "playing" | "ending" | "content";

interface ImmersiveVideoTransitionProps {
  /** Optional video URL. When absent, the component skips straight to `content`. */
  videoUrl?: string | undefined;
  /** Ambient glow colors `[primary, secondary]`. */
  glowColors?: [string, string];
  /** Delay (ms) before the entrance → playing/content transition begins. */
  entranceDelay?: number;
  /** Duration (ms) of the `ending` → `content` blur transition (video path only). */
  endingDuration?: number;
  /** Content rendered once the `content` phase begins. */
  children: ReactNode;
}

const DEFAULT_GLOW: [string, string] = [
  "rgba(134, 239, 172, 0.12)",
  "rgba(96, 165, 250, 0.12)",
];

/**
 * Shared immersive background for the post-playback screens (journal +
 * milestone). Rebuilt from the prototype's `ImmersiveVideoTransition`
 * (visual reference only) with CSS transitions instead of a JS animation lib.
 *
 * The key principle is "never go dark": a warm gradient base + two radial
 * tints stay lit throughout, an optional `<video>` (hydration-gated so SSR
 * stays inert) eases in over them, a darkening overlay + vignette deepen for
 * text readability in the `content` phase, and two ambient glows breathe in.
 * The content layer fades + rises in once `phase === "content"`.
 */
export function ImmersiveVideoTransition({
  videoUrl,
  glowColors = DEFAULT_GLOW,
  entranceDelay = 300,
  endingDuration = 1200,
  children,
}: ImmersiveVideoTransitionProps) {
  const hydrated = useHydrated();
  const hasVideo = !!videoUrl;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<TransitionPhase>("entering");
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Entrance → playing (video) or straight to content (no video). When the
  // media element hasn't mounted yet (pre-hydration), fall back to content so
  // the screen is never stuck on an inert entrance frame.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasVideo && hydrated && videoRef.current) {
        setPhase("playing");
        videoRef.current.play().catch(() => {
          // Autoplay blocked or playback rejected: there's no `ended` event
          // coming, so reveal the content instead of stranding the viewer on
          // the ambient background forever.
          setPhase("content");
        });
      } else {
        setPhase("content");
      }
    }, entranceDelay);
    return () => clearTimeout(timer);
  }, [hasVideo, hydrated, entranceDelay]);

  const handleVideoEnded = () => {
    setPhase("ending");
    const timer = setTimeout(() => setPhase("content"), endingDuration);
    return () => clearTimeout(timer);
  };

  const videoStyle = getVideoStyle(phase, videoLoaded);
  const contentVisible = phase === "content";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base layer — warm gradient, never dark slate. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(215, 30%, 18%) 0%, hsl(220, 35%, 14%) 50%, hsl(225, 40%, 12%) 100%)",
        }}
      />

      {/* Secondary warm radials — depth without darkness. */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(100, 140, 180, 0.15) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 70% 80%, rgba(120, 100, 160, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Video layer — mounts only after hydration so SSR stays inert. */}
      {hasVideo && hydrated ? (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={handleVideoEnded}
          onError={() => {
            // Unsupported / broken source (e.g. an image URL mistakenly passed
            // as a video) never fires `ended`. Skip to content so the milestone
            // still appears rather than leaving a blank ambient screen.
            setPhase("content");
          }}
          className="absolute inset-0 z-[2] h-full w-full object-cover"
          style={{
            transitionProperty: "opacity, filter, transform",
            transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
            transitionDuration: `${getTransitionDuration(phase)}ms`,
            ...videoStyle,
          }}
        />
      ) : null}

      {/* Darkening overlay — deepens during the content phase for readability. */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(180deg, rgba(10, 15, 30, 0.3) 0%, rgba(10, 15, 30, 0.7) 100%)",
          opacity: phase === "content" ? 0.45 : phase === "ending" ? 0.15 : 0,
          transition: `opacity ${phase === "ending" ? 2500 : 1500}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        }}
      />

      {/* Soft vignette — gentle framing. */}
      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          boxShadow: "inset 0 0 120px 40px rgba(0, 0, 0, 0.35)",
          opacity: phase === "content" ? 0.6 : 0.3,
          transition: "opacity 2000ms ease-out",
        }}
      />

      {/* Ambient glows. */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 z-[5] h-[500px] w-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColors[0]} 0%, transparent 65%)`,
          filter: "blur(80px)",
          opacity: phase === "content" ? 0.8 : phase === "ending" ? 0.6 : 0.4,
          transform: phase === "content" ? "scale(1.15)" : "scale(1)",
          transition:
            "opacity 2500ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 2500ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 z-[5] h-[400px] w-[400px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColors[1]} 0%, transparent 65%)`,
          filter: "blur(70px)",
          opacity: phase === "content" ? 0.7 : phase === "ending" ? 0.5 : 0.3,
          transform: phase === "content" ? "scale(1.1)" : "scale(1)",
          transition:
            "opacity 2500ms cubic-bezier(0.25, 0.1, 0.25, 1) 200ms, transform 2500ms cubic-bezier(0.25, 0.1, 0.25, 1) 200ms",
        }}
      />

      {/* Content layer — fades + rises in over the ambient layer. */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(16px)",
          transition:
            "opacity 1200ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 1200ms cubic-bezier(0.25, 0.1, 0.25, 1)",
          pointerEvents: contentVisible ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Video opacity/blur/scale per phase — bright on entrance, gently dimmed for content. */
function getVideoStyle(
  phase: TransitionPhase,
  videoLoaded: boolean,
): CSSProperties {
  switch (phase) {
    case "entering":
      return {
        opacity: videoLoaded ? 0.7 : 0,
        filter: "blur(8px) brightness(1.15)",
        transform: "scale(1.05)",
      };
    case "playing":
      return {
        opacity: 1,
        filter: "blur(0px) brightness(1)",
        transform: "scale(1)",
      };
    case "ending":
      return {
        opacity: 0.9,
        filter: "blur(12px) brightness(1.08)",
        transform: "scale(1.02)",
      };
    case "content":
      return {
        opacity: 0.5,
        filter: "blur(32px) brightness(0.9) saturate(1.1)",
        transform: "scale(1.08)",
      };
  }
}

/** Transition duration (ms) per phase — extra-long ending for a luxurious feel. */
function getTransitionDuration(phase: TransitionPhase): number {
  switch (phase) {
    case "entering":
      return 800;
    case "playing":
      return 1200;
    case "ending":
      return 2500;
    case "content":
      return 1800;
  }
}
