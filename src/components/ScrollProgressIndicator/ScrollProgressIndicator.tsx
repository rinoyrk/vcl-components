import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

type Shape = "line" | "circle" | "pill";

export interface ScrollProgressIndicatorProps {
  shape?: Shape;
  color?: string;
  colorEnd?: string;
  position?: "top" | "bottom";
  size?: number;
}

const LineIndicator: React.FC<{
  progress: number;
  color: string;
  colorEnd: string;
  position: "top" | "bottom";
  size: number;
}> = ({ progress, color, colorEnd, position, size }) => (
  <div
    className="fixed left-0 right-0 z-50 pointer-events-none"
    style={{ [position]: 0, height: size }}
  >
    <motion.div
      className="h-full origin-left"
      style={{
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${color}, ${colorEnd})`,
        boxShadow: `0 0 10px ${color}88`,
      }}
    />
  </div>
);

const CircleIndicator: React.FC<{
  progress: number;
  color: string;
  colorEnd: string;
  size: number;
}> = ({ progress, color, colorEnd, size }) => {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  const gradId = "scroll-ring-grad";

  return (
    <div
      className="fixed bottom-6 right-6 z-50 pointer-events-none"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: "none" }}
      >
        <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  shape = "line",
  color = "#6366f1",
  colorEnd = "#ec4899",
  position = "top",
  size = shape === "circle" ? 52 : 3,
}) => {
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      setProgress(0);
      return;
    }
    setProgress(Math.min(100, (scrollTop / docHeight) * 100));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  if (shape === "circle") {
    return (
      <CircleIndicator
        progress={progress}
        color={color}
        colorEnd={colorEnd}
        size={size || 52}
      />
    );
  }

  return (
    <LineIndicator
      progress={progress}
      color={color}
      colorEnd={colorEnd}
      position={position}
      size={size || 3}
    />
  );
};

export default ScrollProgressIndicator;
