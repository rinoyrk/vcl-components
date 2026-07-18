import React from "react";
import "./WaveDivider.css";

export interface WaveDividerProps {
  colorTop?: string;
  colorBottom?: string;
  amplitude?: number; // 1 = normal, 2 = double
  speed?: "slow" | "normal" | "fast";
  flip?: boolean;
}

const SPEED_MAP = { slow: "8s", normal: "5s", fast: "3s" };

const WaveDivider: React.FC<WaveDividerProps> = ({
  colorTop = "transparent",
  colorBottom = "#07070f",
  amplitude = 1,
  speed = "normal",
  flip = false,
}) => {
  const h = 64 * amplitude;
  const dur = SPEED_MAP[speed];

  return (
    <div
      className="wave-divider-root"
      style={{
        height: h,
        background: colorTop,
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    >
      <svg
        className="wave-svg"
        viewBox={`0 0 1200 ${h}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: h }}
      >
        {/* Layer 1 — back wave */}
        <path
          className="wave-path wave-path--back"
          style={{ fill: `${colorBottom}99`, animationDuration: dur }}
          d={`M0,${h * 0.6} C200,${h * 1.1} 400,${h * 0.1} 600,${h * 0.6} C800,${h * 1.1} 1000,${h * 0.1} 1200,${h * 0.6} L1200,${h} L0,${h} Z`}
        />
        {/* Layer 2 — front wave */}
        <path
          className="wave-path wave-path--front"
          style={{ fill: colorBottom, animationDuration: `calc(${dur} * 0.7)` }}
          d={`M0,${h * 0.75} C150,${h * 0.25} 350,${h * 1.05} 600,${h * 0.65} C850,${h * 0.25} 1050,${h * 1.05} 1200,${h * 0.75} L1200,${h} L0,${h} Z`}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
