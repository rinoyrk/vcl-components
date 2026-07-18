import React, { useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

export interface HoverTiltCardProps {
  children?: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees
  glareOpacity?: number;
}

const HoverTiltCard: React.FC<HoverTiltCardProps> = ({
  children,
  className = "",
  maxTilt = 18,
  glareOpacity = 0.25,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 200, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 200, damping: 22 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);

  // Glare position
  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  }, [rawX, rawY]);

  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  return (
    <div
      ref={cardRef}
      style={{ perspective: "900px" }}
      className="inline-block"
      onMouseMove={(e) => {
        handleMouseMove(e);
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setGlarePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setIsHovered(true);
      }}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative rounded-2xl overflow-hidden ${className}`}
      >
        {children ?? (
          <div
            className="w-64 h-40 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🎮</div>
              <span className="text-white/60 text-sm">Hover me</span>
            </div>
          </div>
        )}

        {/* Glare overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      </motion.div>
    </div>
  );
};

export default HoverTiltCard;
