import React, { useRef } from "react";
import "./InfiniteMarquee.css";

export interface InfiniteMarqueeProps {
  items: React.ReactNode[];
  /** pixels per second */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
}

const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  items,
  speed = 60,
  direction = "left",
  pauseOnHover = true,
  gap = 24,
  className = "",
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  // We render items twice for seamless loop
  const doubled = [...items, ...items];

  const duration = `${(items.length * 120) / speed}s`;

  return (
    <div
      className={`marquee-root overflow-hidden ${className}`}
      style={{ "--marquee-gap": `${gap}px` } as React.CSSProperties}
    >
      <div
        ref={trackRef}
        className={`marquee-track ${direction === "right" ? "marquee-track--reverse" : ""} ${pauseOnHover ? "marquee-track--pausable" : ""}`}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {doubled.map((item, i) => (
          <div key={i} className="marquee-item" style={{ marginRight: gap }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteMarquee;
