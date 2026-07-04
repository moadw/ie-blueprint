import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedCounter({
  target,
  suffix = "%",
  duration = 1.5,
  delay = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const countRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * target);

      if (currentValue !== countRef.current) {
        countRef.current = currentValue;
        setCount(currentValue);
      }

      if (now < endTime) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [started, target, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="text-5xl md:text-6xl font-bold tabular-nums"
      style={{
        color: "hsl(0 0% 100%)",
        textShadow: "0 0 40px rgba(255, 255, 255, 0.3)",
      }}
    >
      {count}
      {suffix}
    </motion.span>
  );
}
