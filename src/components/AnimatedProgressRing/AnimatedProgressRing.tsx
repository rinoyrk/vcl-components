import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export interface AnimatedProgressRingProps {
  /** Target percentage, 0–100 */
  value?: number;
  size?: number;
  strokeWidth?: number;
  /** Gradient start color */
  colorFrom?: string;
  /** Gradient end color */
  colorTo?: string;
  /** Show/hide percentage label */
  showLabel?: boolean;
  label?: string;
}

const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  value = 75,
  size = 120,
  strokeWidth = 10,
  colorFrom = "#6366f1",
  colorTo = "#ec4899",
  showLabel = true,
  label,
}) => {
  const gradientId = `ring-gradient-${Math.random().toString(36).slice(2, 8)}`;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });
  const [displayVal, setDisplayVal] = useState(0);
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    motionValue.set(Math.min(100, Math.max(0, value)));
  }, [value, motionValue]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplayVal(Math.round(v));
      setDashOffset(circumference - (v / 100) * circumference);
    });
    return unsub;
  }, [spring, circumference]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        overflow="visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
          <filter id={`glow-${gradientId}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          filter={`url(#glow-${gradientId})`}
          style={{ transition: "stroke-dashoffset 0ms" }}
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-xl leading-none">
            {displayVal}%
          </span>
          {label && (
            <span className="text-white/40 text-xs mt-1 font-medium">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimatedProgressRing;
