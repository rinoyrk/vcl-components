import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PaintBrushRevealProps {
  /** Content revealed under the brush stroke */
  children: React.ReactNode;
  /** Colour of the brush stroke overlay that wipes away */
  brushColor?: string;
  /** Duration in seconds */
  duration?: number;
  /** Re-play key — change to replay */
  playKey?: string | number;
  className?: string;
}

const PaintBrushReveal: React.FC<PaintBrushRevealProps> = ({
  children,
  brushColor = "#7c3aed",
  duration = 1.1,
  playKey = 0,
  className = "",
}) => {
  const [phase, setPhase] = useState<"cover" | "reveal">("cover");

  // Reset on playKey change
  useEffect(() => {
    setPhase("cover");
    const t = setTimeout(() => setPhase("reveal"), 200);
    return () => clearTimeout(t);
  }, [playKey]);

  // SVG brush stroke path — irregular brushstroke shape
  const stroke =
    "M -10,55 C 5,35 10,15 40,25 C 80,38 120,10 160,20 C 200,30 240,12 280,22 C 320,32 340,45 310,65 C 290,75 250,85 210,78 C 170,70 130,88 90,80 C 50,72 10,80 -10,65 Z";

  return (
    <div className={`relative overflow-hidden inline-block ${className}`}>
      {/* Actual content */}
      <div>{children}</div>

      {/* Paint overlay that sweeps away */}
      <AnimatePresence>
        {phase === "cover" && (
          <motion.div
            key="brush"
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: 10 }}
          >
            <svg
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <motion.path
                d={stroke}
                fill={brushColor}
                initial={{ scaleX: 0, originX: "0%" }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0, originX: "100%" }}
                transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaintBrushReveal;
