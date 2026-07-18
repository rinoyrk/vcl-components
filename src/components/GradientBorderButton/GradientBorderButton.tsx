import React from "react";
import { motion } from "framer-motion";
import "./GradientBorderButton.css";

export interface GradientBorderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  /** Gradient colors: [from, via, to] */
  colors?: [string, string, string];
  className?: string;
  disabled?: boolean;
}

const GradientBorderButton: React.FC<GradientBorderButtonProps> = ({
  children,
  onClick,
  colors = ["#6366f1", "#ec4899", "#f59e0b"],
  className = "",
  disabled = false,
}) => {
  const [c1, c2, c3] = colors;

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`gradient-border-btn relative group ${className}`}
      style={
        {
          "--c1": c1,
          "--c2": c2,
          "--c3": c3,
        } as React.CSSProperties
      }
    >
      {/* Spinning gradient border */}
      <span className="gradient-border-btn__track" aria-hidden="true" />

      {/* Inner fill */}
      <span className="gradient-border-btn__inner">
        <span className="gradient-border-btn__shimmer" aria-hidden="true" />
        <span className="relative z-10 font-semibold tracking-wide text-white">
          {children}
        </span>
      </span>
    </motion.button>
  );
};

export default GradientBorderButton;
