import React from "react";
import "./PuzzleLoader.css";

export interface PuzzleLoaderProps {
  size?: number;
  color?: string;
  colorB?: string;
}

const PuzzleLoader: React.FC<PuzzleLoaderProps> = ({
  size = 80,
  color = "#6366f1",
  colorB = "#ec4899",
}) => {
  const s = size / 3;

  const pieces = [
    { id: "tl", x: 0, y: 0, delay: 0, from: "-120% -120%" },
    { id: "tm", x: s, y: 0, delay: 0.1, from: "0 -120%" },
    { id: "tr", x: s * 2, y: 0, delay: 0.2, from: "120% -120%" },
    { id: "ml", x: 0, y: s, delay: 0.15, from: "-120% 0" },
    { id: "mm", x: s, y: s, delay: 0.25, from: "0 0" },
    { id: "mr", x: s * 2, y: s, delay: 0.3, from: "120% 0" },
    { id: "bl", x: 0, y: s * 2, delay: 0.2, from: "-120% 120%" },
    { id: "bm", x: s, y: s * 2, delay: 0.35, from: "0 120%" },
    { id: "br", x: s * 2, y: s * 2, delay: 0.4, from: "120% 120%" },
  ];

  return (
    <div
      className="puzzle-root"
      style={{ width: size, height: size, position: "relative" }}
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="puzzle-piece"
          style={
            {
              position: "absolute",
              left: p.x,
              top: p.y,
              width: s - 2,
              height: s - 2,
              borderRadius: s * 0.18,
              background:
                p.id === "mm"
                  ? `linear-gradient(135deg, ${color}, ${colorB})`
                  : p.x === s && p.y === 0
                  ? colorB
                  : p.x === 0 && p.y === s
                  ? colorB
                  : `${color}${p.id.includes("r") || p.id.includes("b") ? "bb" : "dd"}`,
              "--from": p.from,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default PuzzleLoader;
