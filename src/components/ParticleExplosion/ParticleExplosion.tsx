import React, { useCallback, useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface ParticleExplosionProps {
  colors?: string[];
  count?: number;
  children?: React.ReactNode;
}

const ParticleExplosion: React.FC<ParticleExplosionProps> = ({
  colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#a855f7", "#fff"],
  count = 28,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const counterRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnParticles = useCallback(
    (cx: number, cy: number) => {
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 2 + Math.random() * 5;
        const maxLife = 50 + Math.random() * 40;
        return {
          id: counterRef.current++,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife,
        };
      });
      particlesRef.current = [...particlesRef.current, ...newParticles];
    },
    [colors, count]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      spawnParticles(e.clientX - rect.left, e.clientY - rect.top);
    },
    [spawnParticles]
  );

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += 1;
        const t = p.life / p.maxLife;
        p.alpha = 1 - t;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.98; // drag

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        return p.life < p.maxLife;
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ro = new ResizeObserver(() => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    });
    ro.observe(container);
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer select-none"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />
      {children ?? (
        <div
          className="flex items-center justify-center rounded-2xl px-8 py-6 text-white/70 text-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            minWidth: 240,
            minHeight: 100,
          }}
        >
          Click anywhere to explode ✨
        </div>
      )}
    </div>
  );
};

export default ParticleExplosion;
