import React, { useState } from "react";
import { motion } from "framer-motion";

export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  /** "hover" (default) | "click" */
  trigger?: "hover" | "click";
  /** Card width */
  width?: number | string;
  /** Card height */
  height?: number | string;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  trigger = "hover",
  width = 260,
  height = 360,
  className = "",
}) => {
  const [flipped, setFlipped] = useState(false);

  const isFlipped = trigger === "click" ? flipped : undefined;

  const hoverProps =
    trigger === "hover"
      ? { whileHover: { rotateY: 180 } }
      : {};

  const clickProps =
    trigger === "click"
      ? { onClick: () => setFlipped((f) => !f), animate: { rotateY: flipped ? 180 : 0 } }
      : {};

  return (
    <div
      className={`relative cursor-pointer select-none ${className}`}
      style={{ width, height, perspective: 1000 }}
    >
      <motion.div
        {...hoverProps}
        {...clickProps}
        initial={{ rotateY: 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", position: "relative" }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
          }}
        >
          {front}
        </div>
        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 16,
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;
