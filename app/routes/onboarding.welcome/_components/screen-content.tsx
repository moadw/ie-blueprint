import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScreenContentProps {
  children: ReactNode;
  screenIndex: number;
}

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
};

export function ScreenContent({ children, screenIndex }: ScreenContentProps) {
  return (
    <motion.div
      key={screenIndex}
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6"
    >
      {children}
    </motion.div>
  );
}
