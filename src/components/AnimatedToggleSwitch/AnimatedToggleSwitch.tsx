import React, { useState } from "react";
import { motion } from "framer-motion";

export interface AnimatedToggleSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { width: 44, height: 24, knob: 18, iconSize: 10 },
  md: { width: 56, height: 30, knob: 24, iconSize: 13 },
  lg: { width: 72, height: 38, knob: 30, iconSize: 16 },
};

// Sun icon
const SunIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <line
        key={deg}
        x1="12"
        y1="2"
        x2="12"
        y2="5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        transform={`rotate(${deg} 12 12)`}
      />
    ))}
  </svg>
);

// Moon icon
const MoonIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const AnimatedToggleSwitch: React.FC<AnimatedToggleSwitchProps> = ({
  defaultChecked = false,
  onChange,
  size = "md",
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  const { width, height, knob, iconSize } = SIZE_MAP[size];
  const knobPadding = (height - knob) / 2;
  const knobTravel = width - knob - knobPadding * 2;

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <motion.button
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full"
      style={{
        width,
        height,
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: checked
            ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
            : "linear-gradient(135deg, #374151, #1f2937)",
          boxShadow: checked
            ? "0 0 16px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "inset 0 2px 6px rgba(0,0,0,0.4)",
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Knob */}
      <motion.div
        className="absolute top-0 flex items-center justify-center rounded-full shadow-lg"
        style={{
          width: knob,
          height: knob,
          top: knobPadding,
          left: knobPadding,
        }}
        animate={{
          x: checked ? knobTravel : 0,
          background: checked
            ? "linear-gradient(135deg, #fff, #e0e7ff)"
            : "linear-gradient(135deg, #d1d5db, #9ca3af)",
          boxShadow: checked
            ? "0 2px 10px rgba(99,102,241,0.4)"
            : "0 2px 6px rgba(0,0,0,0.35)",
          scale: checked ? [1, 1.15, 1] : [1, 1.15, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 500, damping: 28 },
          scale: { duration: 0.3 },
          background: { duration: 0.3 },
        }}
      >
        <motion.div
          animate={{
            color: checked ? "#6366f1" : "#6b7280",
            rotate: checked ? 0 : 180,
            opacity: 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {checked ? (
            <MoonIcon size={iconSize} />
          ) : (
            <SunIcon size={iconSize} />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default AnimatedToggleSwitch;
