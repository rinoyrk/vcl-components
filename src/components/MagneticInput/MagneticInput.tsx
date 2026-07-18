import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export interface MagneticInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
  strength?: number;
  accentColor?: string;
}

const SPRING = { stiffness: 220, damping: 20, mass: 0.5 };

const MagneticInput: React.FC<MagneticInputProps> = ({
  label = "Email address",
  placeholder = "you@example.com",
  type = "text",
  value,
  onChange,
  error,
  strength = 0.25,
  accentColor = "#6366f1",
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState("");

  const display = value ?? internal;
  const hasContent = display.length > 0;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  const isTouchOnly =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchOnly || focused || !wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawX.set((e.clientX - cx) * strength);
      rawY.set((e.clientY - cy) * strength);
    },
    [isTouchOnly, focused, rawX, rawY, strength]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternal(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="relative" style={{ minWidth: 280 }}>
      <motion.div
        ref={wrapRef}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={error ? { x: [0, -10, 10, -6, 6, -2, 2, 0] } : {}}
        transition={error ? { duration: 0.45, ease: "easeInOut" } : {}}
        className="relative"
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: focused
              ? `0 0 0 3px ${accentColor}44, 0 4px 24px ${accentColor}22`
              : error
              ? "0 0 0 3px rgba(239,68,68,0.35)"
              : "0 0 0 1px rgba(255,255,255,0.08)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Track */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            background: focused
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${
              error
                ? "rgba(239,68,68,0.5)"
                : focused
                ? `${accentColor}88`
                : "rgba(255,255,255,0.1)"
            }`,
            transition: "background 0.3s, border-color 0.3s",
          }}
        >
          {/* Floating label */}
          <motion.label
            animate={
              focused || hasContent
                ? { y: 6, scale: 0.75, color: error ? "#ef4444" : accentColor }
                : { y: 16, scale: 1, color: "rgba(255,255,255,0.35)" }
            }
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{ originX: 0, transformOrigin: "left center" }}
            className="absolute left-4 top-0 text-sm font-medium pointer-events-none select-none"
            onClick={() => inputRef.current?.focus()}
          >
            {label}
          </motion.label>

          <input
            ref={inputRef}
            type={type}
            value={display}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ""}
            className="w-full bg-transparent pt-6 pb-3 px-4 text-white text-sm outline-none placeholder-white/20"
          />
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 ml-1 text-xs font-medium"
            style={{ color: "#ef4444" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagneticInput;
