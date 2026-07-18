import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

export interface CarouselCard {
  id: string;
  title: string;
  description?: string;
  image?: string;
  accent?: string;
  emoji?: string;
}

export interface RotatingCarousel3DProps {
  cards?: CarouselCard[];
  autoRotate?: boolean;
  autoRotateDelay?: number;
}

const DEFAULT_CARDS: CarouselCard[] = [
  { id: "1", title: "Aurora", description: "Northern lights design", accent: "#6366f1", emoji: "🌌" },
  { id: "2", title: "Prism", description: "Refracted beauty", accent: "#ec4899", emoji: "💎" },
  { id: "3", title: "Zenith", description: "Peak of craft", accent: "#10b981", emoji: "⚡" },
  { id: "4", title: "Nebula", description: "Born from stardust", accent: "#f59e0b", emoji: "✨" },
  { id: "5", title: "Vortex", description: "Spinning dimensions", accent: "#a855f7", emoji: "🌀" },
];

const RotatingCarousel3D: React.FC<RotatingCarousel3DProps> = ({
  cards = DEFAULT_CARDS,
  autoRotate = true,
  autoRotateDelay = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = cards.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  // Auto-rotate
  React.useEffect(() => {
    if (!autoRotate) return;
    timerRef.current = setTimeout(() => go(1), autoRotateDelay);
    return () => clearTimeout(timerRef.current ?? undefined);
  }, [activeIndex, autoRotate, autoRotateDelay, go]);

  const getCardProps = (offset: number) => {
    const absOff = Math.abs(offset);
    const visible = absOff <= 2;
    return {
      zIndex: 10 - absOff,
      rotateY: offset * 28,
      x: offset * 120,
      scale: 1 - absOff * 0.14,
      opacity: visible ? 1 - absOff * 0.38 : 0,
      filter: absOff > 0 ? `blur(${absOff * 1.5}px)` : "none",
    };
  };

  return (
    <div className="relative flex flex-col items-center gap-6 select-none" style={{ perspective: "900px" }}>
      {/* Cards */}
      <div className="relative flex items-center justify-center" style={{ height: 200, width: 280 }}>
        {cards.map((card, i) => {
          const offset = ((i - activeIndex + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
          const props = getCardProps(offset);

          return (
            <motion.div
              key={card.id}
              animate={{
                rotateY: props.rotateY,
                x: props.x,
                scale: props.scale,
                opacity: props.opacity,
                zIndex: props.zIndex,
                filter: props.filter,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onClick={() => { setActiveIndex(i); }}
              className="absolute w-52 h-44 rounded-2xl cursor-pointer flex flex-col p-5 justify-between"
              style={{
                background: `linear-gradient(135deg, ${card.accent}33, rgba(255,255,255,0.04))`,
                border: `1px solid ${card.accent}44`,
                backdropFilter: "blur(12px)",
                boxShadow: offset === 0 ? `0 16px 48px ${card.accent}44` : "none",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${card.accent}22`, color: card.accent }}>
                  #{i + 1}
                </span>
              </div>
              <div>
                <p className="text-white font-bold text-base">{card.title}</p>
                <p className="text-white/45 text-xs mt-0.5">{card.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => go(-1)}
          className="w-8 h-8 rounded-full grid place-items-center text-white/60 hover:text-white"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
        >←</motion.button>

        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <button key={i} onClick={() => { setActiveIndex(i); }}
              className="rounded-full transition-all duration-300"
              style={{ width: i === activeIndex ? 20 : 6, height: 6, background: i === activeIndex ? cards[activeIndex].accent : "rgba(255,255,255,0.2)", cursor: "pointer" }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => go(1)}
          className="w-8 h-8 rounded-full grid place-items-center text-white/60 hover:text-white"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
        >→</motion.button>
      </div>
    </div>
  );
};

export default RotatingCarousel3D;
