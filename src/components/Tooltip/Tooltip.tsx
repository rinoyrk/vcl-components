import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  accentColor?: string;
}

const PLACEMENT_STYLES: Record<string, React.CSSProperties> = {
  top: { bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
  bottom: { top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
  left: { right: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" },
  right: { left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" },
};

const ENTER_MOTION: Record<string, object> = {
  top: { y: 6, opacity: 0 },
  bottom: { y: -6, opacity: 0 },
  left: { x: 6, opacity: 0 },
  right: { x: -6, opacity: 0 },
};

const ARROW_STYLES: Record<string, React.CSSProperties> = {
  top: { bottom: -5, left: "50%", transform: "translateX(-50%)", borderTop: "5px solid", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "none" },
  bottom: { top: -5, left: "50%", transform: "translateX(-50%)", borderBottom: "5px solid", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "none" },
  left: { right: -5, top: "50%", transform: "translateY(-50%)", borderLeft: "5px solid", borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "none" },
  right: { left: -5, top: "50%", transform: "translateY(-50%)", borderRight: "5px solid", borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "none" },
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  delay = 120,
  accentColor = "#6366f1",
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current ?? undefined);
    setVisible(false);
  }, []);

  const tooltipBg = "rgba(10,10,24,0.92)";

  return (
    <span className="relative inline-block" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="tooltip"
            role="tooltip"
            initial={{ ...ENTER_MOTION[placement], scale: 0.92 }}
            animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
            exit={{ ...ENTER_MOTION[placement], scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 26, duration: 0.18 }}
            className="absolute z-50 pointer-events-none"
            style={PLACEMENT_STYLES[placement]}
          >
            <div
              className="relative px-3 py-2 rounded-xl text-xs font-medium text-white whitespace-nowrap"
              style={{
                background: tooltipBg,
                border: `1px solid ${accentColor}44`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}22`,
                backdropFilter: "blur(12px)",
              }}
            >
              {content}
              {/* Arrow */}
              <span
                className="absolute w-0 h-0"
                style={{ ...ARROW_STYLES[placement], borderTopColor: tooltipBg, borderBottomColor: tooltipBg, borderLeftColor: tooltipBg, borderRightColor: tooltipBg }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default Tooltip;
