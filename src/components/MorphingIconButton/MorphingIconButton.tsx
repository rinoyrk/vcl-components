import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type IconState = "menu" | "close";

export interface MorphingIconButtonProps {
  defaultState?: IconState;
  onChange?: (state: IconState) => void;
  size?: number;
  color?: string;
}

const PATHS: Record<IconState, string[]> = {
  menu: [
    "M3 6h18",
    "M3 12h18",
    "M3 18h18",
  ],
  close: [
    "M6 6l12 12",
    "M12 12",  // hidden middle line
    "M18 6L6 18",
  ],
};

const MorphingIconButton: React.FC<MorphingIconButtonProps> = ({
  defaultState = "menu",
  onChange,
  size = 44,
  color = "#6366f1",
}) => {
  const [state, setState] = useState<IconState>(defaultState);

  const toggle = () => {
    const next: IconState = state === "menu" ? "close" : "menu";
    setState(next);
    onChange?.(next);
  };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      style={{
        width: size,
        height: size,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer",
      }}
      aria-label={state === "menu" ? "Open menu" : "Close menu"}
      aria-expanded={state === "close"}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        overflow="visible"
      >
        {/* Top line */}
        <motion.line
          x1="3"
          y1={state === "close" ? 6 : 6}
          x2="21"
          y2={state === "close" ? 18 : 6}
          animate={{
            y1: state === "close" ? 6 : 6,
            y2: state === "close" ? 18 : 6,
            x1: state === "close" ? 6 : 3,
            x2: state === "close" ? 18 : 21,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Middle line */}
        <motion.line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          animate={{
            opacity: state === "close" ? 0 : 1,
            scaleX: state === "close" ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* Bottom line */}
        <motion.line
          x1="3"
          y1={state === "close" ? 18 : 18}
          x2="21"
          y2={state === "close" ? 6 : 18}
          animate={{
            y1: state === "close" ? 18 : 18,
            y2: state === "close" ? 6 : 18,
            x1: state === "close" ? 6 : 3,
            x2: state === "close" ? 18 : 21,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>

      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0 }}
          className="sr-only"
        >
          {state}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default MorphingIconButton;
