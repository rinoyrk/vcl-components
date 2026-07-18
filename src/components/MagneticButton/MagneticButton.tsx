import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export interface MagneticButtonProps {
  /** Label rendered inside the button */
  text: string;
  /** Background / glow color (any valid CSS color). Defaults to indigo. */
  color?: string;
  /**
   * Magnetic pull strength, clamped to [0, 1].
   * 0 = no movement, 1 = maximum displacement.  Defaults to 0.4.
   */
  strength?: number;
  /** Called when the button is clicked */
  onClick?: () => void;
}

// ─── Spring config ───────────────────────────────────────────────────────────

const SPRING_CONFIG = { stiffness: 200, damping: 20, mass: 0.5 };
/**
 * Maximum pixel displacement cap.
 * Even with strength=1 the button will not shift more than this.
 */
const MAX_DISPLACEMENT = 36;

// ─── Component ───────────────────────────────────────────────────────────────

const MagneticButton: React.FC<MagneticButtonProps> = ({
  text,
  color = "#6366f1",
  strength = 0.4,
  onClick,
}) => {
  // Clamp strength to a safe range
  const clampedStrength = Math.min(1, Math.max(0, strength));

  // Detect touch-only devices once at mount — on those devices the magnetic
  // tracking is disabled and the button behaves as a standard button.
  const isTouchOnly = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches,
    []
  );

  // ── Motion values ──────────────────────────────────────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING_CONFIG);
  const springY = useSpring(rawY, SPRING_CONFIG);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const btnRef = useRef<HTMLButtonElement>(null);

  // ── Hover state (for glow) ─────────────────────────────────────────────────
  const [isHovered, setIsHovered] = useState(false);

  // ── Ripples ────────────────────────────────────────────────────────────────
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchOnly || !btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * clampedStrength;
      const dy = (e.clientY - centerY) * clampedStrength;
      rawX.set(Math.min(MAX_DISPLACEMENT, Math.max(-MAX_DISPLACEMENT, dx)));
      rawY.set(Math.min(MAX_DISPLACEMENT, Math.max(-MAX_DISPLACEMENT, dy)));
    },
    [isTouchOnly, clampedStrength, rawX, rawY]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isTouchOnly) setIsHovered(true);
  }, [isTouchOnly]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  }, [rawX, rawY]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 700);
      }
      onClick?.();
    },
    [onClick]
  );

  // Build the glow box-shadow using the provided color with 50% alpha
  const glowShadow = `0 0 28px 8px ${color}80`;

  return (
    /*
     * Wrapper div provides a generous hover detection zone so the button
     * reacts before the cursor actually lands on it.
     */
    <div
      className="inline-flex items-center justify-center p-8"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        ref={btnRef}
        style={{
          x: isTouchOnly ? 0 : springX,
          y: isTouchOnly ? 0 : springY,
          backgroundColor: color,
        }}
        animate={{
          boxShadow: isHovered ? glowShadow : "0 0 0px 0px transparent",
        }}
        transition={{ duration: 0.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="relative overflow-hidden rounded-full px-8 py-4 font-semibold text-white cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        aria-label={text}
      >
        {/* Button label */}
        <span className="relative z-10 pointer-events-none">{text}</span>

        {/* Ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 10,
                height: 10,
                top: ripple.y - 5,
                left: ripple.x - 5,
                backgroundColor: "rgba(255,255,255,0.55)",
                originX: "50%",
                originY: "50%",
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 28, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default MagneticButton;
