import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { LessonGlassCard } from "./lesson-glass-card";

export interface SliderLesson {
  _id?: string | null;
  title?: string | null;
  description?: string | null;
  order?: number | null;
  cover?: { url?: string | null } | null;
}

interface CurriculumSliderProps {
  lessons: SliderLesson[];
  groupId: string;
  curriculumId: string;
}

// Glass-theme arrow token literals (prototype `PlayerThemeContext.glass`).
const ARROW_BG =
  "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)";
const ARROW_BORDER = "1px solid rgba(255, 255, 255, 0.15)";
const ARROW_SHADOW =
  "inset 0 0.5px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(0, 0, 0, 0.2)";

// 800ms lockout matches the 0.6s coverflow transition (+ a little slack), the
// same value the prototype's carousel uses.
const ANIMATION_LOCKOUT_MS = 800;
const SWIPE_THRESHOLD_PX = 50;

function getCSSVar(name: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value ? parseFloat(value) : fallback;
}

/**
 * Coverflow transform math ported verbatim from the prototype's
 * `getCardStyle`. `diff` is normalized into `[-half, +half]`, which is what
 * gives the slider its infinite wrap with no cloned slides.
 */
function getCardStyle(
  index: number,
  currentIndex: number,
  totalSlides: number,
  arcRadius: number,
  angleSpread: number,
  scaleAdjacent: number,
): CSSProperties {
  let diff = index - currentIndex;
  const half = totalSlides / 2;
  while (diff > half) diff -= totalSlides;
  while (diff < -half) diff += totalSlides;

  const absPos = Math.abs(diff);
  const isCenter = absPos < 0.01;

  const visibleRange = 2.5;
  if (absPos > visibleRange) {
    const offscreenX = diff > 0 ? 800 : -800;
    const offscreenY = 500;
    const offscreenRotation = diff > 0 ? 35 : -35;
    return {
      transform: `translateX(${offscreenX}px) translateY(${offscreenY}px) scale(0.4) rotateZ(${offscreenRotation}deg)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none",
      transition: "none",
    };
  }

  const angle = diff * angleSpread;
  const radians = (angle * Math.PI) / 180;

  const x = Math.sin(radians) * arcRadius;
  const y = absPos * absPos * 65;
  const scale = isCenter
    ? 0.92
    : Math.max(scaleAdjacent - absPos * 0.06, 0.48);
  const opacity = absPos > 1.5 ? Math.max(0.5 - (absPos - 1.5) * 0.5, 0) : 1;
  const zIndex = Math.round(30 - absPos * 5);
  const rotateZ = diff * 12;

  return {
    transform: `translateX(${x}px) translateY(${y}px) scale(${scale}) rotateZ(${rotateZ}deg)`,
    opacity,
    zIndex,
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  };
}

export function CurriculumSlider({
  lessons,
  groupId,
  curriculumId,
}: CurriculumSliderProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState({
    arcRadius: 600,
    angleSpread: 18,
    scaleAdjacent: 0.68,
  });

  // First paint snaps into place (transition disabled) until the first RAF,
  // then transitions are enabled so subsequent moves animate.
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Recompute arc radius from the viewport width + the active breakpoint's
  // CSS vars, debounced on resize (prototype mechanics).
  useEffect(() => {
    let timeoutId: number;

    const updateParams = () => {
      const viewportWidth = window.innerWidth;
      const angleSpread = getCSSVar("--carousel-angle-spread", 18);
      const scaleAdjacent = getCSSVar("--carousel-scale-adjacent", 0.68);

      const angle2Radians = (2 * angleSpread * Math.PI) / 180;
      const sinAngle2 = Math.sin(angle2Radians);
      const calculatedRadius = (viewportWidth * 0.52) / sinAngle2;
      const arcRadius = Math.max(400, Math.min(calculatedRadius, 2000));

      setParams({ arcRadius, angleSpread, scaleAdjacent });
    };

    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateParams, 150);
    };

    updateParams();
    window.addEventListener("resize", debouncedUpdate);
    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  const goToPrev = useCallback(() => {
    if (isAnimating || lessons.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev <= 0 ? lessons.length - 1 : prev - 1));
    window.setTimeout(() => setIsAnimating(false), ANIMATION_LOCKOUT_MS);
  }, [isAnimating, lessons.length]);

  const goToNext = useCallback(() => {
    if (isAnimating || lessons.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev >= lessons.length - 1 ? 0 : prev + 1));
    window.setTimeout(() => setIsAnimating(false), ANIMATION_LOCKOUT_MS);
  }, [isAnimating, lessons.length]);

  const goToIndex = useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      window.setTimeout(() => setIsAnimating(false), ANIMATION_LOCKOUT_MS);
    },
    [isAnimating, currentIndex],
  );

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (touchStartX.current === null || !isSwiping.current) {
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }
      const touch = e.changedTouches[0];
      const deltaX = touch ? touch.clientX - touchStartX.current : 0;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
        if (deltaX > 0) goToPrev();
        else goToNext();
      }
      touchStartX.current = null;
      touchStartY.current = null;
      isSwiping.current = false;
    },
    [goToPrev, goToNext],
  );

  if (lessons.length === 0) return null;

  const currentLesson = lessons[currentIndex];

  return (
    <div
      className="flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D coverflow stage */}
      <div
        className="relative flex w-full touch-pan-y items-start justify-center pt-2 sm:pt-4"
        style={{
          perspective: "1800px",
          height: "var(--carousel-container-height, 420px)",
        }}
      >
        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            width: "var(--carousel-card-width, 280px)",
            height: "var(--carousel-card-height, 360px)",
          }}
        >
          {lessons.map((lesson, index) => {
            const baseStyle = getCardStyle(
              index,
              currentIndex,
              lessons.length,
              params.arcRadius,
              params.angleSpread,
              params.scaleAdjacent,
            );
            const style: CSSProperties = isReady
              ? baseStyle
              : { ...baseStyle, transition: "none" };
            const isActive = index === currentIndex;

            return (
              <div
                key={lesson._id ?? index}
                onClick={() => {
                  if (isActive) {
                    // The active (centered) card opens the practice detail
                    // route for that class id; inactive cards just recenter.
                    if (lesson._id)
                      navigate(
                        `/classrooms/${groupId}/${curriculumId}/${lesson._id}`,
                      );
                  } else {
                    goToIndex(index);
                  }
                }}
                className="absolute left-1/2 top-0 cursor-pointer"
                style={{
                  ...style,
                  width: "var(--carousel-card-width, 280px)",
                  height: "var(--carousel-card-height, 360px)",
                  marginLeft: "calc(var(--carousel-card-width, 280px) / -2)",
                  pointerEvents: style.opacity === 0 ? "none" : "auto",
                }}
              >
                {/* Day label — lives inside the transformed wrapper so it
                    scales/tilts with its card; the active card's label is
                    taller + larger (prototype ThemedCardCarouselPlayer day
                    label + `.day-label-animate` in index.css). */}
                <div
                  className="relative mb-2 text-center text-white drop-shadow-lg"
                  style={{
                    height: isActive
                      ? "clamp(3rem, 6vh, 4rem)"
                      : "clamp(1.5rem, 3vh, 2rem)",
                    transition: "height 0.8s ease",
                  }}
                >
                  <div
                    key={isActive ? `day-${currentIndex}` : undefined}
                    className={`absolute inset-0 flex items-center justify-center font-serif italic${
                      isActive ? " day-label-animate" : ""
                    }`}
                    style={{
                      fontSize: isActive
                        ? "clamp(2rem, 4vw, 3rem)"
                        : "clamp(1rem, 2vw, 1.5rem)",
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      transition: "font-size 0.4s ease",
                    }}
                  >
                    Day {lesson.order ?? index + 1}
                  </div>
                </div>

                <LessonGlassCard
                  image={lesson.cover?.url}
                  title={lesson.title ?? ""}
                  isActive={isActive}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Day label + title/description + arrows */}
      <div
        className="relative z-10 flex flex-1 items-center justify-center"
        style={{ minHeight: "clamp(120px, 18vh, 180px)" }}
      >
        <div className="mx-auto grid w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Left arrow */}
          <div className="hidden justify-end pr-6 md:flex lg:pr-10">
            <button
              type="button"
              onClick={goToPrev}
              disabled={isAnimating}
              aria-label="Previous lesson"
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:h-14 lg:w-14"
              style={{
                background: ARROW_BG,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: ARROW_BORDER,
                boxShadow: ARROW_SHADOW,
              }}
            >
              <ChevronLeft className="h-5 w-5 text-white/80 lg:h-6 lg:w-6" />
            </button>
          </div>

          {/* Center content */}
          <div className="flex w-[280px] flex-col items-center gap-2 sm:w-[360px] sm:gap-3 md:w-[420px] lg:w-[480px]">
            <h2 className="line-clamp-2 w-full text-center font-serif text-lg text-white drop-shadow-lg sm:text-xl md:text-2xl lg:text-3xl">
              {currentLesson?.title}
            </h2>
            <p className="line-clamp-3 w-full text-center font-sans text-xs leading-relaxed text-white/70 sm:text-sm md:text-base">
              {currentLesson?.description ||
                "A mindfulness practice to help you find calm and focus."}
            </p>
          </div>

          {/* Right arrow */}
          <div className="hidden justify-start pl-6 md:flex lg:pl-10">
            <button
              type="button"
              onClick={goToNext}
              disabled={isAnimating}
              aria-label="Next lesson"
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:h-14 lg:w-14"
              style={{
                background: ARROW_BG,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: ARROW_BORDER,
                boxShadow: ARROW_SHADOW,
              }}
            >
              <ChevronRight className="h-5 w-5 text-white/80 lg:h-6 lg:w-6" />
            </button>
          </div>
        </div>

        {/* Mobile arrows — centered below the text */}
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={goToPrev}
            disabled={isAnimating}
            aria-label="Previous lesson"
            className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{
              background: ARROW_BG,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: ARROW_BORDER,
              boxShadow: ARROW_SHADOW,
            }}
          >
            <ChevronLeft className="h-5 w-5 text-white/80" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            disabled={isAnimating}
            aria-label="Next lesson"
            className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{
              background: ARROW_BG,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: ARROW_BORDER,
              boxShadow: ARROW_SHADOW,
            }}
          >
            <ChevronRight className="h-5 w-5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Responsive coverflow card-size table (prototype index.css:44-116),
          scoped here so the global stylesheet stays single-owner. */}
      <style>{`
        :root {
          --carousel-card-width: 240px;
          --carousel-card-height: 320px;
          --carousel-container-height: 380px;
          --carousel-angle-spread: 22;
          --carousel-scale-adjacent: 0.78;
        }
        @media (min-width: 640px) {
          :root {
            --carousel-card-width: 260px;
            --carousel-card-height: 360px;
            --carousel-container-height: 420px;
            --carousel-angle-spread: 20;
            --carousel-scale-adjacent: 0.76;
          }
        }
        @media (min-width: 768px) {
          :root {
            --carousel-card-width: 280px;
            --carousel-card-height: 400px;
            --carousel-container-height: 460px;
            --carousel-angle-spread: 18;
            --carousel-scale-adjacent: 0.74;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --carousel-card-width: 300px;
            --carousel-card-height: 420px;
            --carousel-container-height: 480px;
            --carousel-angle-spread: 17;
            --carousel-scale-adjacent: 0.72;
          }
        }
        @media (min-width: 1280px) {
          :root {
            --carousel-card-width: 320px;
            --carousel-card-height: 450px;
            --carousel-container-height: 510px;
            --carousel-angle-spread: 16;
            --carousel-scale-adjacent: 0.70;
          }
        }
        @media (min-width: 1536px) {
          :root {
            --carousel-card-width: 340px;
            --carousel-card-height: 480px;
            --carousel-container-height: 540px;
            --carousel-angle-spread: 15;
            --carousel-scale-adjacent: 0.68;
          }
        }
        @media (min-width: 1920px) {
          :root {
            --carousel-card-width: 360px;
            --carousel-card-height: 520px;
            --carousel-container-height: 580px;
            --carousel-angle-spread: 14;
            --carousel-scale-adjacent: 0.66;
          }
        }

        /* Active Day-label fade-in (prototype index.css \`.day-label-animate\`). */
        .day-label-animate {
          animation: day-fade-in 0.4s ease-out;
        }
        @keyframes day-fade-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
