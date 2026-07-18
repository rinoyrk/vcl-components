import React, { useCallback, useEffect, useRef } from "react";

export interface LightningHoverProps {
  children?: React.ReactNode;
  color?: string;
  bolts?: number;
}

interface Bolt {
  id: number;
  points: [number, number][];
  alpha: number;
  life: number;
  maxLife: number;
}

function createBolt(sx: number, sy: number, ex: number, ey: number): [number, number][] {
  const steps = 8 + Math.floor(Math.random() * 6);
  const pts: [number, number][] = [[sx, sy]];
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const bx = sx + (ex - sx) * t + (Math.random() - 0.5) * 28;
    const by = sy + (ey - sy) * t + (Math.random() - 0.5) * 20;
    pts.push([bx, by]);
  }
  pts.push([ex, ey]);
  return pts;
}

const LightningHover: React.FC<LightningHoverProps> = ({
  children,
  color = "#a5b4fc",
  bolts = 4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boltsRef = useRef<Bolt[]>([]);
  const rafRef = useRef<number>(0);
  const hoveredRef = useRef(false);
  const spawnTimerRef = useRef<number>(0);
  const counterRef = useRef(0);

  const spawnBolts = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    for (let i = 0; i < bolts; i++) {
      // Random edge-to-edge
      const sx = Math.random() * w;
      const sy = 0;
      const ex = Math.random() * w;
      const ey = h;
      boltsRef.current.push({
        id: counterRef.current++,
        points: createBolt(sx, sy, ex, ey),
        alpha: 0.8 + Math.random() * 0.2,
        life: 0,
        maxLife: 8 + Math.floor(Math.random() * 8),
      });
    }
  }, [bolts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hoveredRef.current) {
        spawnTimerRef.current++;
        if (spawnTimerRef.current % 4 === 0) spawnBolts();
      }

      boltsRef.current = boltsRef.current.filter((bolt) => {
        bolt.life++;
        const t = bolt.life / bolt.maxLife;
        const a = bolt.alpha * (1 - t);

        ctx.save();
        ctx.globalAlpha = a;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 - t;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        bolt.points.forEach(([x, y], i) => {
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Secondary fainter stroke
        ctx.globalAlpha = a * 0.3;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 22;
        ctx.beginPath();
        bolt.points.forEach(([x, y], i) => {
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.restore();

        return bolt.life < bolt.maxLife;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [color, spawnBolts]);

  // Resize
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
      className="relative overflow-hidden"
      onMouseEnter={() => { hoveredRef.current = true; spawnBolts(); }}
      onMouseLeave={() => { hoveredRef.current = false; boltsRef.current = []; }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
      {children ?? (
        <div
          className="px-8 py-5 rounded-2xl text-white font-semibold text-sm cursor-pointer"
          style={{
            background: "rgba(165,180,252,0.08)",
            border: "1px solid rgba(165,180,252,0.25)",
          }}
        >
          ⚡ Hover for lightning
        </div>
      )}
    </div>
  );
};

export default LightningHover;
