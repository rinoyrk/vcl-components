import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export interface GlassCard {
  id: string;
  title: string;
  description?: string;
  accent?: string;
  emoji?: string;
}

export interface GlassMorphingCardStackProps {
  cards?: GlassCard[];
}

const DEFAULT_CARDS: GlassCard[] = [
  {
    id: "1",
    title: "Aurora",
    description: "Northern lights inspired design",
    accent: "#6366f1",
    emoji: "🌌",
  },
  {
    id: "2",
    title: "Prism",
    description: "Refracting light into pure forms",
    accent: "#ec4899",
    emoji: "💎",
  },
  {
    id: "3",
    title: "Zenith",
    description: "At the peak of craft",
    accent: "#10b981",
    emoji: "⚡",
  },
  {
    id: "4",
    title: "Nebula",
    description: "Born from stardust",
    accent: "#f59e0b",
    emoji: "✨",
  },
];

const GlassMorphingCardStack: React.FC<GlassMorphingCardStackProps> = ({
  cards = DEFAULT_CARDS,
}) => {
  const [hovered, setHovered] = useState(false);
  const [activeId, setActiveId] = useState(cards[0]?.id);

  const orderedCards = [
    ...cards.filter((c) => c.id !== activeId),
    cards.find((c) => c.id === activeId)!,
  ].filter(Boolean);

  return (
    <div className="relative flex flex-col items-center select-none">
      <div
        className="relative"
        style={{ width: 260, height: 200 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <LayoutGroup>
          {orderedCards.map((card, i) => {
            const isActive = card.id === activeId;
            const isTop = i === orderedCards.length - 1;
            const offsetIndex = hovered
              ? i - (orderedCards.length - 1)
              : i - (orderedCards.length - 1);

            return (
              <motion.div
                key={card.id}
                layout
                layoutId={`card-${card.id}`}
                onClick={() => setActiveId(card.id)}
                animate={
                  hovered
                    ? {
                        x: offsetIndex * 64,
                        y: offsetIndex * -8,
                        scale: 0.88 + (i / (orderedCards.length - 1)) * 0.12,
                        rotateZ: offsetIndex * 4,
                        zIndex: i + 1,
                      }
                    : {
                        x: offsetIndex * 8,
                        y: offsetIndex * -8,
                        scale: 0.88 + (i / (orderedCards.length - 1)) * 0.12,
                        rotateZ: offsetIndex * 2.5,
                        zIndex: i + 1,
                      }
                }
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="absolute inset-0 rounded-2xl cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid rgba(255,255,255,${isTop ? 0.15 : 0.07})`,
                  boxShadow: isTop
                    ? `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${card.accent}44`
                    : "0 8px 24px rgba(0,0,0,0.3)",
                }}
                whileHover={{ scale: isTop ? 1.04 : undefined }}
              >
                {/* Accent glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-20"
                  style={{
                    background: `radial-gradient(ellipse at 30% 30%, ${card.accent}, transparent 70%)`,
                  }}
                />

                {isTop && (
                  <div className="relative z-10 p-5 flex flex-col h-full">
                    <span className="text-3xl mb-2">{card.emoji}</span>
                    <h3 className="text-white font-bold text-lg tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-white/50 text-sm mt-1">
                      {card.description}
                    </p>
                    <div
                      className="mt-auto text-xs font-semibold tracking-wider uppercase"
                      style={{ color: card.accent }}
                    >
                      Active Card
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </LayoutGroup>
      </div>

      {/* Dot nav */}
      <div className="flex gap-2 mt-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveId(card.id)}
            className="rounded-full transition-all duration-200"
            style={{
              width: activeId === card.id ? 20 : 6,
              height: 6,
              background:
                activeId === card.id
                  ? cards.find((c) => c.id === card.id)?.accent ?? "#6366f1"
                  : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      <p className="text-white/25 text-xs mt-2 text-center">
        Hover to fan · Click to bring forward
      </p>
    </div>
  );
};

export default GlassMorphingCardStack;
