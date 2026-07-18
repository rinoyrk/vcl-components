import React, { useEffect, useRef, useCallback } from "react";

export interface ConfettiCelebrationProps {
  /** Set to true to trigger a burst */
  trigger?: boolean;
  /** Piece count */
  count?: number;
  /** Canvas size */
  width?: number | string;
  height?: number | string;
  className?: string;
}

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  drot: number;
  w: number;
  h: number;
  color: string;
  alpha: number;
  shape: "rect" | "circle";
}

const COLORS = [
  "#f43f5e", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#06b6d4", "#6366f1", "#a855f7",
  "#ec4899", "#ffffff",
];

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  trigger = false,
  count = 120,
  width = "100%",
  height = 300,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);

  const spawnPieces = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    piecesRef.current = Array.from({ length: count }, () => ({
      x: w * 0.1 + Math.random() * w * 0.8,
      y: -20,
      vx: (Math.random() - 0.5) * 7,
      vy: 2 + Math.random() * 5,
      rot: Math.random() * 360,
      drot: (Math.random() - 0.5) * 8,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  useEffect(() => {
    if (!trigger) return;

    spawnPieces();
    activeRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    cancelAnimationFrame(rafRef.current);

    const loop = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      piecesRef.current = piecesRef.current.filter((p) => p.alpha > 0.02);

      piecesRef.current.forEach((p) => {
        p.vy += 0.18; // gravity
        p.vx *= 0.99; // air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.drot;

        // Start fading when near bottom
        if (p.y > h * 0.75) p.alpha -= 0.015;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      });

      if (piecesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, spawnPieces]);

  return (
    <canvas
      ref={canvasRef}
      className={`block pointer-events-none ${className}`}
      style={{ width, height }}
    />
  );
};

export default ConfettiCelebration;
