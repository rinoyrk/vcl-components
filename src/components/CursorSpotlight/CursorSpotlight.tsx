import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export interface CursorSpotlightProps {
  /** Spotlight radius in px */
  size?: number;
  /** Background overlay color */
  overlayColor?: string;
  /** Children content that will be revealed by the spotlight */
  children: React.ReactNode;
}

const CursorSpotlight: React.FC<CursorSpotlightProps> = ({
  size = 200,
  overlayColor = "rgba(5,5,15,0.88)",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInside, setIsInside] = useState(false);
  const [isTouchDevice] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );

  const rawX = useMotionValue(-999);
  const rawY = useMotionValue(-999);
  const springX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 180, damping: 22 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    },
    [rawX, rawY]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isTouchDevice) return;

    const onMove = (e: MouseEvent) => handleMouseMove(e);
    const onEnter = () => setIsInside(true);
    const onLeave = () => setIsInside(false);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [handleMouseMove, isTouchDevice]);

  // Derived SVG mask radius
  const [pos, setPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const unsubX = springX.on("change", (v) =>
      setPos((p) => ({ ...p, x: v }))
    );
    const unsubY = springY.on("change", (v) =>
      setPos((p) => ({ ...p, y: v }))
    );
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX, springY]);

  if (isTouchDevice) {
    // Mobile fallback: no overlay
    return (
      <div ref={containerRef} className="relative w-full h-full">
        {children}
      </div>
    );
  }

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: isInside
      ? `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, transparent 0%, transparent 60%, black 100%)`
      : "none",
    maskImage: isInside
      ? `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, transparent 0%, transparent 60%, black 100%)`
      : "none",
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Base content */}
      <div className="relative z-0">{children}</div>

      {/* Dark overlay with cutout */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
        style={{
          backgroundColor: overlayColor,
          opacity: isInside ? 1 : 0,
          ...maskStyle,
        }}
      />

      {/* Spotlight glow ring */}
      {isInside && (
        <motion.div
          className="absolute pointer-events-none z-20 rounded-full"
          style={{
            width: size * 2,
            height: size * 2,
            left: pos.x - size,
            top: pos.y - size,
            boxShadow: `0 0 ${size * 0.6}px ${size * 0.25}px rgba(99,102,241,0.12)`,
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Idle hint overlay */}
      {!isInside && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backgroundColor: overlayColor }}
        >
          <span className="text-white/30 text-sm font-medium tracking-widest uppercase select-none">
            Move cursor to reveal
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default CursorSpotlight;
