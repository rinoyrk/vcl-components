import React from "react";
import "./GradientText.css";

export interface GradientTextProps {
  children: React.ReactNode;
  /** Gradient colors array (at least 2) */
  colors?: string[];
  /** Animation duration in seconds */
  speed?: number;
  /** Font size tailwind class */
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#6366f1"],
  speed = 4,
  className = "",
  as: Tag = "span",
}) => {
  const gradient = colors.join(", ");

  return (
    // @ts-ignore – dynamic tag
    <Tag
      className={`gradient-text ${className}`}
      style={
        {
          "--gradient": gradient,
          "--gradient-speed": `${speed}s`,
          backgroundImage: `linear-gradient(90deg, ${gradient})`,
          backgroundSize: "300% 100%",
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
};

export default GradientText;
