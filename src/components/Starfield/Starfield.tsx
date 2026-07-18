import React, { useEffect, useRef, useCallback } from "react";

export interface StarfieldProps {
  starCount?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  /** 0-1 twinkle phase */
  phase: number;
}

const Starfield: React.FC<StarfieldProps> = ({
  starCount = 200,
  speed = 0.5,
  className = "",
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const initStars = useCallback((w: number, h: number) => {
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * w * 2,
      y: (Math.random() - 0.5) * h * 2,
      z: Math.random() * w,
      pz: 0,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [starCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars(canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const loop = () => {
      const { width: w, height: h } = canvas;
      const cx = w / 2;
      const cy = h / 2;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.fillStyle = "rgba(5,5,15,0.25)";
      ctx.fillRect(0, 0, w, h);

      starsRef.current.forEach((star) => {
        star.pz = star.z;
        star.z -= speed + (mx / w - 0.5) * 1.2;
        star.phase += 0.02;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * w * 2;
          star.y = (Math.random() - 0.5) * h * 2;
          star.z = w;
          star.pz = w;
        }

        const sx = (star.x / star.z) * w + cx;
        const sy = (star.y / star.z) * h + cy;
        const px = (star.x / star.pz) * w + cx;
        const py = (star.y / star.pz) * h + cy;

        const size = Math.max(0.2, (1 - star.z / w) * 2.5);
        const twinkle = 0.5 + 0.5 * Math.sin(star.phase);
        const alpha = ((1 - star.z / w) * 0.9 + 0.1) * twinkle;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        ctx.restore();
      });

      // Mouse-based parallax dust
      const driftX = (mx / w - 0.5) * 20;
      const driftY = (my / h - 0.5) * 12;
      ctx.save();
      ctx.translate(driftX * 0.05, driftY * 0.05);
      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", onMove);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [initStars, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{ background: "#05050f", ...style }}
    />
  );
};

export default Starfield;
