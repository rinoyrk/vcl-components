import React, { useRef, useCallback } from "react";

export interface IceCrackEffectProps {
  children?: React.ReactNode;
  /** Number of crack lines per click */
  crackCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface Crack {
  id: number;
  segments: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  opacity: number;
}

let UID = 0;

function buildCrack(
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
  segs: Array<{ x1: number; y1: number; x2: number; y2: number }>
) {
  if (depth === 0 || length < 4) return;
  const rad = (angle * Math.PI) / 180;
  const x2 = x + Math.cos(rad) * length;
  const y2 = y + Math.sin(rad) * length;
  segs.push({ x1: x, y1: y, x2, y2 });

  const branches = depth > 2 ? 2 : 1;
  for (let b = 0; b < branches; b++) {
    const spread = 25 + Math.random() * 30;
    const dir = b === 0 ? 1 : -1;
    buildCrack(x2, y2, angle + dir * spread, length * 0.65, depth - 1, segs);
  }
}

const IceCrackEffect: React.FC<IceCrackEffectProps> = ({
  children,
  crackCount = 6,
  className = "",
  style,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cracksRef = useRef<Crack[]>([]);

  const redraw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // Clear
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    cracksRef.current.forEach((crack) => {
      crack.segments.forEach((seg) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(seg.x1));
        line.setAttribute("y1", String(seg.y1));
        line.setAttribute("x2", String(seg.x2));
        line.setAttribute("y2", String(seg.y2));
        line.setAttribute("stroke", `rgba(180,220,255,${crack.opacity})`);
        line.setAttribute("stroke-width", "1.2");
        line.setAttribute("stroke-linecap", "round");
        svg.appendChild(line);
      });
    });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      for (let i = 0; i < crackCount; i++) {
        const angle = (360 / crackCount) * i + (Math.random() - 0.5) * 20;
        const segs: Crack["segments"] = [];
        buildCrack(cx, cy, angle, 40 + Math.random() * 30, 4, segs);
        const crack: Crack = { id: UID++, segments: segs, opacity: 0.9 };
        cracksRef.current.push(crack);

        // Fade out
        const start = performance.now();
        const fade = () => {
          const elapsed = performance.now() - start;
          crack.opacity = Math.max(0, 0.9 - elapsed / 1800);
          redraw();
          if (crack.opacity > 0) requestAnimationFrame(fade);
          else {
            cracksRef.current = cracksRef.current.filter((c) => c.id !== crack.id);
            redraw();
          }
        };
        requestAnimationFrame(fade);
      }
      redraw();
    },
    [crackCount, redraw]
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-pointer select-none ${className}`}
      style={style}
      onClick={handleClick}
    >
      {children}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default IceCrackEffect;
