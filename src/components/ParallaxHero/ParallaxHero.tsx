import React, { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export interface ParallaxLayer {
  content: React.ReactNode;
  speed?: number; // 0 = no movement, 1 = full scroll movement
  className?: string;
}

export interface ParallaxHeroProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  layers?: ParallaxLayer[];
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  title = "Beyond Imagination",
  subtitle = "Premium UI components crafted with precision and delight.",
  ctaLabel = "Explore Components",
  onCtaClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Vertical parallax for each layer on scroll
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 0.6]);

  // Mouse parallax
  const mouseX = useSpring(0, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(nx * 30);
      mouseY.set(ny * 20);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Layer 1 — deep background orbs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: layer1Y, x: mouseX }}
      >
        <div
          className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }}
        />
      </motion.div>

      {/* Layer 2 — mid grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{ y: layer2Y, x: mouseY }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="pg"
              x="0"
              y="0"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M48 0L0 0 0 48"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pg)" />
        </svg>
      </motion.div>

      {/* Layer 3 — floating particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: layer3Y }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              background: i % 2 === 0 ? "#6366f1" : "#ec4899",
              opacity: 0.4 + Math.random() * 0.4,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Scroll fog overlay */}
      <motion.div
        className="absolute inset-0 bg-gray-950 pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 select-none">
        <motion.h1
          className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/50 max-w-lg font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCtaClick}
          className="px-8 py-3.5 rounded-2xl font-semibold text-white text-base"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
            boxShadow: "0 4px 32px rgba(99,102,241,0.45)",
          }}
        >
          {ctaLabel}
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-[-180px] flex flex-col items-center gap-1 opacity-30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-white text-xs tracking-widest uppercase">
            Scroll
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <path d="M8 0v20M2 14l6 8 6-8" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxHero;
