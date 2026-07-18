import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import "./DarkModeTransition.css";

type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  toggle: (originX?: number, originY?: number) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export const useTheme = () => useContext(Ctx);

export interface DarkModeTransitionProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const DarkModeTransition: React.FC<DarkModeTransitionProps> = ({
  children,
  defaultTheme = "dark",
}) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("vcl-theme") as Theme) ?? defaultTheme
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingTheme = useRef<Theme>(theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vcl-theme", theme);
  }, [theme]);

  const toggle = useCallback(
    (originX = window.innerWidth / 2, originY = window.innerHeight / 2) => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      pendingTheme.current = next;

      const overlay = overlayRef.current;
      if (!overlay) {
        setTheme(next);
        return;
      }

      // Size the circle to cover the screen
      const maxDist = Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY)
      );
      const diameter = maxDist * 2 + 100;

      overlay.style.left = `${originX}px`;
      overlay.style.top = `${originY}px`;
      overlay.style.width = `${diameter}px`;
      overlay.style.height = `${diameter}px`;
      overlay.style.background =
        next === "dark" ? "#07070f" : "#f8fafc";
      overlay.style.clipPath = "circle(0px at 50% 50%)";
      overlay.style.transition = "none";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.transition = "clip-path 0.6s cubic-bezier(0.76,0,0.24,1)";
          overlay.style.clipPath = `circle(${diameter / 2}px at 50% 50%)`;
        });
      });

      const onEnd = () => {
        setTheme(pendingTheme.current);
        overlay.style.clipPath = "circle(0px at 50% 50%)";
        overlay.style.transition = "none";
        overlay.removeEventListener("transitionend", onEnd);
      };
      overlay.addEventListener("transitionend", onEnd);
    },
    [theme]
  );

  return (
    <Ctx.Provider value={{ theme, toggle }}>
      <div
        className="dark-mode-root"
        data-theme={theme}
        style={{
          background: theme === "dark" ? "#07070f" : "#f8fafc",
          color: theme === "dark" ? "#fff" : "#111",
          transition: "background 0.3s, color 0.3s",
          minHeight: "100%",
        }}
      >
        {children}
        {/* Morph overlay */}
        <div
          ref={overlayRef}
          className="dark-mode-overlay"
          style={{ pointerEvents: "none" }}
        />
      </div>
    </Ctx.Provider>
  );
};

// ─── Standalone toggle button ─────────────────────────────────────────────────
export const ThemeToggleButton: React.FC<{ size?: number }> = ({ size = 44 }) => {
  const { theme, toggle } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    toggle(
      rect ? rect.left + rect.width / 2 : undefined,
      rect ? rect.top + rect.height / 2 : undefined
    );
  };

  const isDark = theme === "dark";

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="relative rounded-full flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      style={{
        width: size,
        height: size,
        background: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.06)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
      aria-label="Toggle theme"
    >
      <span
        className="text-lg transition-transform duration-500"
        style={{ transform: isDark ? "rotate(0deg)" : "rotate(180deg)" }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default DarkModeTransition;
