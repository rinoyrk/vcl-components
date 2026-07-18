import React, { useEffect, useRef, useCallback } from "react";

export interface FireCursorTrailProps {
  /** Parent element to attach the trail to – defaults to document.body */
  containerRef?: React.RefObject<HTMLElement>;
  colors?: string[];
  particleCount?: number;
  /** Lifetime in frames */
  lifetime?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const FireCursorTrail: React.FC<FireCursorTrailProps> = ({
  containerRef,
  colors = ["#ff6d00", "#ff9a00", "#ffd000", "#ff3c00", "#fff4c2"],
  particleCount = 6,
  lifetime = 38,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const counterRef = useRef(0);

  const spawnAt = useCallback(
    (x: number, y: number) => {
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.4;
        const ml = lifetime * (0.7 + Math.random() * 0.6);
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed * 0.5,
          vy: Math.sin(angle) * speed - speed * 1.2, // mostly upward
          life: 0,
          maxLife: ml,
          size: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    },
    [colors, particleCount, lifetime]
  );

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Spawn at current cursor
      spawnAt(mouseRef.current.x, mouseRef.current.y);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += 1;
        const t = p.life / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.06; // rise
        p.vx *= 0.97;
        const alpha = Math.max(0, 1 - t);
        const r = p.size * (1 - t * 0.7);

        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = r * 3;
        ctx.fill();
        ctx.restore();
        return p.life < p.maxLife;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnAt]);

  // Mouse tracking and canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const target = containerRef?.current ?? document.body;

    const resize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    const el = containerRef?.current ?? canvas.parentElement ?? document;
    el.addEventListener("mousemove", onMove as EventListener);
    const onLeave = () => { mouseRef.current = { x: -999, y: -999 }; };
    el.addEventListener("mouseleave", onLeave);

    return () => {
      ro.disconnect();
      el.removeEventListener("mousemove", onMove as EventListener);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default FireCursorTrail;
