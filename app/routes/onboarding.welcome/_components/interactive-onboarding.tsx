import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParticleSystem } from "./use-particle-system";
import type { ParticleMode } from "./use-particle-system";
import { ScreenContent } from "./screen-content";
import { PlayButton } from "./play-button";
import { AnimatedCounter } from "./animated-counter";

interface InteractiveOnboardingProps {
  onComplete: () => void;
}

const SCREEN_MODES: ParticleMode[] = [
  "chaos",
  "slowing",
  "orbiting",
  "forming-number",
  "final-circle",
];

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

const SCREEN_CONTENT = [
  { title: "Your students arrive distracted.", subtitle: "Overwhelmed. Scattered." },
  { title: "What if you could settle the room", subtitle: "in minutes?" },
  { title: "No training required.", subtitle: "Just press play." },
  { title: "Research shows it takes 21 days to build a habit.", subtitle: null },
  { title: null, subtitle: null },
];

export function InteractiveOnboarding({
  onComplete,
}: InteractiveOnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const mode = isCompleting ? "dissolving" : SCREEN_MODES[currentScreen]!;
  const { canvasRef } = useParticleSystem({ mode, screenIndex: currentScreen });

  const handleAdvance = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (isTransitioning || isCompleting) return;
      if (currentScreen === 4) return;

      if (currentScreen < SCREEN_CONTENT.length - 1) {
        setIsTransitioning(true);
        setCurrentScreen((prev) => prev + 1);
        setTimeout(() => setIsTransitioning(false), 600);
      }
    },
    [currentScreen, isTransitioning, isCompleting],
  );

  const handleBegin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isCompleting) return;

      const audio = new Audio("/sounds/reveal.wav");
      audio.volume = 0.5;
      audio.play().catch(() => {});

      window.setTimeout(() => {
        setIsCompleting(true);
        window.setTimeout(() => onComplete(), 220);
      }, 1000);
    },
    [isCompleting, onComplete],
  );

  const handleSkip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onComplete();
    },
    [onComplete],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") &&
        !isCompleting &&
        currentScreen < 4
      ) {
        handleAdvance();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAdvance, currentScreen, isCompleting]);

  const renderScreenContent = () => {
    const content = SCREEN_CONTENT[currentScreen]!;

    if (currentScreen === 3) {
      return (
        <ScreenContent screenIndex={currentScreen}>
          <div className="flex flex-col items-center justify-center gap-16 mt-[20vh]">
            <div className="onboarding-text text-center">
              <h1 className="onboarding-heading">{content.title}</h1>
            </div>
            <div className="flex flex-row items-start justify-center gap-12 md:gap-20">
              <div className="text-center min-w-[100px]">
                <AnimatedCounter target={63} delay={0} />
                <p className="stat-label">fewer incidents</p>
              </div>
              <div className="text-center min-w-[100px]">
                <AnimatedCounter target={43} delay={0.4} />
                <p className="stat-label">less teacher stress</p>
              </div>
              <div className="text-center min-w-[100px]">
                <AnimatedCounter target={27} delay={0.8} />
                <p className="stat-label">better grades</p>
              </div>
            </div>
          </div>
        </ScreenContent>
      );
    }

    if (currentScreen === 2) {
      return (
        <ScreenContent screenIndex={currentScreen}>
          <div className="flex flex-col items-center gap-12">
            <div className="onboarding-text">
              <h1 className="onboarding-heading mb-2">{content.title}</h1>
              <p
                className="text-lg md:text-xl"
                style={{ color: "hsl(0 0% 100% / 0.7)" }}
              >
                {content.subtitle}
              </p>
            </div>
            <PlayButton visible />
          </div>
        </ScreenContent>
      );
    }

    if (currentScreen === 4) {
      return (
        <ScreenContent screenIndex={currentScreen}>
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={false}
            animate={
              isCompleting
                ? { opacity: 0, y: -14, scale: 0.985, filter: "blur(10px)" }
                : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 0.42, ease: SMOOTH_EASE }}
          >
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                border: "1px solid hsl(0 0% 100% / 0.3)",
                backgroundColor: "hsl(0 0% 100% / 0.1)",
                color: "hsl(0 0% 100%)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: SMOOTH_EASE }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </motion.div>

            <motion.button
              onClick={handleBegin}
              className="rounded-full px-10 py-4 text-lg font-semibold shadow-2xl transition-[transform,background-color] duration-300"
              style={{
                backgroundColor: "hsl(0 0% 100%)",
                color: "hsl(150 45% 9%)",
              }}
              disabled={isCompleting}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: SMOOTH_EASE }}
              whileHover={isCompleting ? {} : { scale: 1.03, y: -1 }}
              whileTap={isCompleting ? {} : { scale: 0.985 }}
            >
              Begin 21 Day Quest
            </motion.button>

            <motion.button
              onClick={handleSkip}
              className="text-sm transition-colors"
              style={{ color: "hsl(0 0% 100% / 0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              nah, I'm good
            </motion.button>
          </motion.div>
        </ScreenContent>
      );
    }

    return (
      <ScreenContent screenIndex={currentScreen}>
        <div className="onboarding-text">
          {content.title && (
            <h1 className="onboarding-heading mb-2">{content.title}</h1>
          )}
          {content.subtitle && (
            <p
              className="text-lg md:text-xl"
              style={{ color: "hsl(0 0% 100% / 0.7)" }}
            >
              {content.subtitle}
            </p>
          )}
        </div>
      </ScreenContent>
    );
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-pointer select-none"
      style={{ backgroundColor: "hsl(150 45% 9%)" }}
      onClick={handleAdvance}
      role="button"
      tabIndex={0}
      aria-label={`Screen ${currentScreen + 1} of ${SCREEN_CONTENT.length}. Tap to continue.`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "hsl(150 45% 9%)" }}
      />

      <AnimatePresence mode="wait">{renderScreenContent()}</AnimatePresence>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2"
        initial={false}
        animate={
          isCompleting
            ? { opacity: 0, y: 12, filter: "blur(8px)" }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{ duration: 0.32, ease: SMOOTH_EASE }}
      >
        {SCREEN_CONTENT.map((_, index) => (
          <motion.div
            key={index}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                index === currentScreen
                  ? "hsl(0 0% 100%)"
                  : index < currentScreen
                    ? "hsl(0 0% 100% / 0.5)"
                    : "hsl(0 0% 100% / 0.2)",
              transform: index === currentScreen ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </motion.div>

      {currentScreen < 4 && (
        <div
          className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 text-sm"
          style={{ color: "hsl(0 0% 100% / 0.4)" }}
        >
          Tap anywhere to continue
        </div>
      )}
    </div>
  );
}
