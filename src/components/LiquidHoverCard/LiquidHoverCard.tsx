import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface LiquidHoverCardProps {
  title?: string;
  description?: string;
  image?: string;
  gradient?: [string, string];
  children?: React.ReactNode;
}

const LiquidHoverCard: React.FC<LiquidHoverCardProps> = ({
  title = "Liquid Card",
  description = "Hover over me to see the liquid distortion effect.",
  image,
  gradient = ["#6366f1", "#ec4899"],
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  // 3D rotation derived from mouse position
  const rotateX = useTransform(springY, [0, 1], [12, -12]);
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);

  // Gradient shift derived from mouse position
  const gradientX = useTransform(springX, [0, 1], [0, 100]);
  const gradientY = useTransform(springY, [0, 1], [0, 100]);

  // Shadow shift
  const shadowX = useTransform(springX, [0, 1], [-20, 20]);
  const shadowY = useTransform(springY, [0, 1], [-20, 20]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseX.set(nx);
      mouseY.set(ny);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  return (
    <div
      style={{ perspective: "1000px" }}
      className="inline-block"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          boxShadow: isHovered
            ? `${shadowX.get()}px ${shadowY.get()}px 40px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.08)`
            : "0 8px 32px rgba(0,0,0,0.4)",
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.04 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-72 rounded-2xl overflow-hidden cursor-pointer select-none"
      >
        {/* SVG liquid filter */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="liquid-distort">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={isHovered ? "0.015 0.012" : "0.005 0.004"}
                numOctaves="3"
                seed="2"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  values={
                    isHovered
                      ? "0.005 0.004;0.015 0.012;0.005 0.004"
                      : "0.005 0.004;0.008 0.006;0.005 0.004"
                  }
                  dur="3s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={isHovered ? 18 : 4}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${gradientX.get()}% ${gradientY.get()}%, ${gradient[0]}cc, ${gradient[1]}cc, #0f0f1a)`,
            filter: isHovered ? "url(#liquid-distort)" : "none",
          }}
          animate={{
            background: isHovered
              ? `radial-gradient(ellipse at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, ${gradient[0]}, ${gradient[1]}, #0f0f1a)`
              : `radial-gradient(circle at 50% 50%, ${gradient[0]}88, ${gradient[1]}88, #0f0f1a)`,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Glass overlay */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(2px)",
          }}
        />

        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 p-6">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-36 object-cover rounded-xl mb-4 opacity-80"
            />
          )}
          <h3 className="text-white text-xl font-bold mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">{description}</p>
          {children}
        </div>

        {/* Border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid",
            borderColor: isHovered
              ? `${gradient[0]}88`
              : "rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </div>
  );
};

export default LiquidHoverCard;
