import { motion } from "framer-motion";

interface PlayButtonProps {
  visible: boolean;
}

export function PlayButton({ visible }: PlayButtonProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-center"
    >
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            left: -20,
            top: -20,
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
        <svg width="80" height="80" viewBox="0 0 80 80" className="relative">
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.path
            d="M32 25 L32 55 L58 40 Z"
            fill="rgba(255, 255, 255, 0.9)"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "40px 40px" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}
