import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export interface NavLink {
  label: string;
  href: string;
  sectionId?: string;
}

export interface FloatingNavbarProps {
  links?: NavLink[];
  logo?: React.ReactNode;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Home", href: "#home", sectionId: "home" },
  { label: "Components", href: "#components", sectionId: "components" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  links = DEFAULT_LINKS,
  logo,
  ctaLabel = "Get Started",
  onCtaClick,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setIsVisible(currentY < lastScrollY.current || currentY < 80);
        setIsScrolled(currentY > 20);
        lastScrollY.current = currentY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const sectionIds = links
      .map((l) => l.sectionId)
      .filter(Boolean) as string[];

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [links]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          key="navbar"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
        >
          <motion.div
            animate={{
              backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
              backgroundColor: isScrolled
                ? "rgba(10,10,20,0.75)"
                : "rgba(10,10,20,0.35)",
              boxShadow: isScrolled
                ? "0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)"
                : "0 2px 16px rgba(0,0,0,0.2)",
            }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl max-w-3xl w-full"
          >
            {/* Logo */}
            <div className="flex-shrink-0 text-white font-bold text-lg tracking-tight mr-4">
              {logo ?? "VCL"}
            </div>

            {/* Links */}
            <nav className="flex items-center gap-1 flex-1">
              {links.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg group"
                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 rounded-lg bg-white/10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onCtaClick}
              className="ml-2 flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
              }}
            >
              {ctaLabel}
            </motion.button>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default FloatingNavbar;
