import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CompassItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface CompassNavigationProps {
  items: CompassItem[];
  onSelect?: (id: string) => void;
  size?: number;
  className?: string;
}

const CompassNavigation: React.FC<CompassNavigationProps> = ({
  items,
  onSelect,
  size = 220,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const radius = size * 0.38;
  const count = items.length;

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
    setOpen(false);
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Orbit items */}
      <AnimatePresence>
        {open &&
          items.map((item, i) => {
            const angle = (360 / count) * i - 90;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = active === item.id;

            return (
              <motion.button
                key={item.id}
                className="absolute flex flex-col items-center justify-center rounded-full text-white text-xs font-semibold shadow-lg focus:outline-none"
                style={{
                  width: 54,
                  height: 54,
                  background: isActive
                    ? item.color ?? "#7c3aed"
                    : "rgba(30,30,50,0.85)",
                  border: `2px solid ${item.color ?? "#7c3aed"}`,
                  boxShadow: isActive ? `0 0 16px ${item.color ?? "#7c3aed"}88` : undefined,
                  zIndex: 5,
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x, y, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{
                  delay: i * 0.045,
                  type: "spring",
                  stiffness: 350,
                  damping: 22,
                }}
                onClick={() => handleSelect(item.id)}
              >
                {item.icon && <span className="text-lg leading-none">{item.icon}</span>}
                <span className="text-[10px] mt-0.5 leading-tight px-1 text-center">{item.label}</span>
              </motion.button>
            );
          })}
      </AnimatePresence>

      {/* Center trigger */}
      <motion.button
        className="relative z-10 flex items-center justify-center rounded-full text-white font-bold shadow-xl focus:outline-none"
        style={{
          width: 60,
          height: 60,
          background: open
            ? "linear-gradient(135deg,#7c3aed,#ec4899)"
            : "linear-gradient(135deg,#4f46e5,#7c3aed)",
          boxShadow: "0 4px 24px rgba(124,58,237,0.5)",
        }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </motion.button>

      {/* Backdrop ring */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: radius * 2 + 60,
              height: radius * 2 + 60,
              border: "1px solid rgba(124,58,237,0.2)",
            }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompassNavigation;
