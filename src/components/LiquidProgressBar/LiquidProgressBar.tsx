import React, { useId } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export interface LiquidProgressBarProps {
  /** 0 – 100 */
  value?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  className?: string;
}

const LiquidProgressBar: React.FC<LiquidProgressBarProps> = ({
  value = 60,
  height = 36,
  color = "#7c3aed",
  backgroundColor = "rgba(30,20,60,0.6)",
  showLabel = true,
  className = "",
}) => {
  const id = useId().replace(/:/g, "");
  const springVal = useSpring(value, { stiffness: 60, damping: 18 });
  const pct = useTransform(springVal, [0, 100], ["0%", "100%"]);

  const W = 300;
  const H = height;

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ height, background: backgroundColor, maxWidth: 400 }}
    >
      {/* SVG fill */}
      <svg
        className="absolute inset-0"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <clipPath id={`clip-${id}`}>
            <motion.rect height={H} width={pct as any} x="0" y="0" rx="0" />
          </clipPath>
        </defs>

        {/* Solid fill behind wave */}
        <motion.rect
          x="0"
          y="0"
          height={H}
          width={pct as any}
          fill={color}
          opacity={0.35}
        />

        {/* Wave layer 1 */}
        <motion.g clipPath={`url(#clip-${id})`}>
          <motion.path
            d={`M0 ${H * 0.5} Q${W * 0.25} ${H * 0.15} ${W * 0.5} ${H * 0.5} Q${W * 0.75} ${H * 0.85} ${W} ${H * 0.5} L${W} ${H} L0 ${H} Z`}
            fill={color}
            opacity={0.9}
            animate={{ x: [0, -W * 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d={`M0 ${H * 0.55} Q${W * 0.25} ${H * 0.1} ${W * 0.5} ${H * 0.55} Q${W * 0.75} ${H * 0.9} ${W} ${H * 0.55} L${W} ${H} L0 ${H} Z`}
            fill={`${color}bb`}
            animate={{ x: [W * 0.5, 0, W * 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.g>
      </svg>

      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.span
            className="text-white text-sm font-semibold drop-shadow"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      )}
    </div>
  );
};

export default LiquidProgressBar;
