import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface ElasticSliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  step?: number;
  onChange?: (value: number) => void;
  accentColor?: string;
  label?: string;
}

const ElasticSlider: React.FC<ElasticSliderProps> = ({
  min = 0,
  max = 100,
  defaultValue = 40,
  step = 1,
  onChange,
  accentColor = "#6366f1",
  label,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const velocity = useRef(0);

  // Spring for the knob position
  const progress = (value - min) / (max - min);
  const rawX = useMotionValue(progress);
  const springX = useSpring(rawX, { stiffness: 340, damping: 22, mass: 0.6 });

  // Track stretch — elastic deformation while dragging
  const stretchX = useMotionValue(0);
  const trackScaleX = useSpring(
    useTransform(stretchX, [-80, 0, 80], [0.96, 1, 1.04]),
    { stiffness: 400, damping: 28 }
  );

  // Sync spring when value changes (external)
  const syncSpring = useCallback(
    (v: number) => {
      rawX.set((v - min) / (max - min));
    },
    [rawX, min, max]
  );

  const getValueFromClient = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      return Math.round(raw / step) * step;
    },
    [min, max, step, value]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
      lastX.current = e.clientX;
      const v = getValueFromClient(e.clientX);
      setValue(v);
      syncSpring(v);
      onChange?.(v);
    },
    [getValueFromClient, syncSpring, onChange]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      velocity.current = e.clientX - lastX.current;
      lastX.current = e.clientX;
      stretchX.set(velocity.current * 2.5);
      const v = getValueFromClient(e.clientX);
      setValue(v);
      syncSpring(v);
      onChange?.(v);
    },
    [dragging, getValueFromClient, syncSpring, stretchX, onChange]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
    stretchX.set(0);
    velocity.current = 0;
  }, [stretchX]);

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2 select-none w-full max-w-xs">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs font-medium">{label}</span>
          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white text-xs font-bold tabular-nums"
          >
            {value}
          </motion.span>
        </div>
      )}

      <div
        className="relative h-9 flex items-center cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Track */}
        <motion.div
          ref={trackRef}
          className="relative w-full h-[6px] rounded-full overflow-hidden"
          style={{ scaleX: trackScaleX }}
        >
          {/* Background */}
          <div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
          {/* Fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
              boxShadow: `0 0 10px ${accentColor}66`,
              transition: dragging ? "none" : "width 0.1s",
            }}
          />
        </motion.div>

        {/* Knob */}
        <motion.div
          className="absolute"
          style={{ left: `${pct}%`, x: "-50%" }}
          animate={{ scale: dragging ? 1.22 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-full blur-md opacity-60"
            style={{ background: accentColor, transform: "scale(1.8)" }}
          />
          <div
            className="relative w-5 h-5 rounded-full border-2 border-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #fff)` }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ElasticSlider;
