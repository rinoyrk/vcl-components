import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface FrostedSidebarProps {
  items?: SidebarItem[];
  title?: string;
  accentColor?: string;
  defaultOpen?: boolean;
}

const DEFAULT_ITEMS: SidebarItem[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "components", label: "Components", icon: "🧩", badge: "20" },
  { id: "animations", label: "Animations", icon: "✨" },
  { id: "settings", label: "Settings", icon: "⚙️" },
  { id: "docs", label: "Documentation", icon: "📚" },
  { id: "logout", label: "Logout", icon: "🚪" },
];

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, type: "spring" as const, stiffness: 300, damping: 26 },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: -16,
    transition: { delay: i * 0.03, duration: 0.18 },
  }),
};

const FrostedSidebar: React.FC<FrostedSidebarProps> = ({
  items = DEFAULT_ITEMS,
  title = "VCL",
  accentColor = "#6366f1",
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(items[0]?.id ?? "");

  return (
    <div className="relative flex items-center gap-3">
      {/* Toggle trigger */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: open ? `${accentColor}22` : "rgba(255,255,255,0.06)",
          border: `1px solid ${open ? `${accentColor}55` : "rgba(255,255,255,0.1)"}`,
          cursor: "pointer",
          flexShrink: 0,
        }}
        aria-label="Toggle sidebar"
        aria-expanded={open}
      >
        <motion.div className="flex flex-col gap-[4px] w-4" animate={open ? "open" : "closed"}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[1.5px] rounded-full"
              style={{ background: open ? accentColor : "rgba(255,255,255,0.7)" }}
              variants={{
                open: { rotate: i === 0 ? 45 : i === 2 ? -45 : 0, y: i === 0 ? 5.5 : i === 2 ? -5.5 : 0, opacity: i === 1 ? 0 : 1 },
                closed: { rotate: 0, y: 0, opacity: 1 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            />
          ))}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Dim overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-20"
              style={{ background: "rgba(0,0,0,0.45)" }}
              onClick={() => setOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: "-105%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-105%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 z-30 flex flex-col pt-6 pb-4"
              style={{
                width: 240,
                background: "rgba(10,10,24,0.72)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "4px 0 40px rgba(0,0,0,0.45)",
              }}
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="flex items-center gap-3 px-5 mb-8"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
                >
                  V
                </div>
                <span className="text-white font-bold text-base">{title}</span>
              </motion.div>

              {/* Nav items */}
              <nav className="flex flex-col gap-1 px-3 flex-1">
                {items.map((item, i) => {
                  const isActive = active === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      custom={i}
                      variants={ITEM_VARIANTS}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      onClick={() => { setActive(item.id); setOpen(false); }}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full"
                      style={{
                        background: isActive ? `${accentColor}22` : "transparent",
                        border: isActive ? `1px solid ${accentColor}44` : "1px solid transparent",
                        cursor: "pointer",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                      }}
                      whileHover={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                          style={{ background: accentColor }}
                        />
                      )}
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                          style={{ background: `${accentColor}33`, color: accentColor }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Bottom hint */}
              <p className="px-5 text-xs text-white/20 mt-4">Press Esc to close</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Label */}
      <span className="text-white/40 text-xs">Click to open sidebar</span>
    </div>
  );
};

export default FrostedSidebar;
