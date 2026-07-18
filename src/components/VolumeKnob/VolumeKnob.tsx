import React, { useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export interface VolumeKnobProps {
  /** 0 – 100 */
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}

const TICKS = 11;
const MIN_DEG = -135;
const MAX_DEG = 135;

const VolumeKnob: React.FC<VolumeKnobProps> = ({
  value = 50,
  onChange,
  size = 100,
  color = "#7c3aed",
  label,
  className = "",
}) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(value);
  const rotation = useMotionValue(MIN_DEG + ((value / 100) * (MAX_DEG - MIN_DEG)));

  // Sync external value → rotation
  useEffect(() => {
    const deg = MIN_DEG + (value / 100) * (MAX_DEG - MIN_DEG);
    animate(rotation, deg, { duration: 0.3, ease: "easeOut" });
  }, [value, rotation]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      startY.current = e.clientY;
      startVal.current = value;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [value]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const delta = startY.current - e.clientY; // drag up = increase
      const newVal = Math.max(0, Math.min(100, startVal.current + delta * 0.8));
      const deg = MIN_DEG + (newVal / 100) * (MAX_DEG - MIN_DEG);
      rotation.set(deg);
      onChange?.(Math.round(newVal));
    },
    [onChange, rotation]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const r = size / 2;
  const indicatorLength = r * 0.38;

  return (
    <div
      className={`flex flex-col items-center gap-2 select-none ${className}`}
      style={{ width: size + 48 }}
    >
      {/* Tick arc */}
      <div className="relative" style={{ width: size + 40, height: size + 40 }}>
        <svg
          className="absolute inset-0"
          width={size + 40}
          height={size + 40}
          viewBox={`0 0 ${size + 40} ${size + 40}`}
        >
          {Array.from({ length: TICKS }).map((_, i) => {
            const pct = i / (TICKS - 1);
            const deg = MIN_DEG + pct * (MAX_DEG - MIN_DEG);
            const rad = ((deg - 90) * Math.PI) / 180;
            const cx = (size + 40) / 2;
            const cy = (size + 40) / 2;
            const or = r + 14;
            const ir = r + 8;
            const active = pct <= (value / 100);
            return (
              <line
                key={i}
                x1={cx + Math.cos(rad) * ir}
                y1={cy + Math.sin(rad) * ir}
                x2={cx + Math.cos(rad) * or}
                y2={cy + Math.sin(rad) * or}
                stroke={active ? color : "#374151"}
                strokeWidth={i === 0 || i === TICKS - 1 ? 2 : 1.5}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Knob */}
        <motion.div
          className="absolute rounded-full cursor-grab active:cursor-grabbing"
          style={{
            width: size,
            height: size,
            top: 20,
            left: 20,
            background: `radial-gradient(circle at 35% 35%, #374151, #111827)`,
            boxShadow: `0 4px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)`,
            rotate: rotation,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Indicator dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              background: color,
              top: r - indicatorLength - 3,
              left: r - 3,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </motion.div>
      </div>

      {/* Value label */}
      {label !== undefined ? (
        <span className="text-sm text-gray-400">{label}</span>
      ) : (
        <span className="text-sm font-mono text-gray-300">{value}</span>
      )}
    </div>
  );
};

export default VolumeKnob;
