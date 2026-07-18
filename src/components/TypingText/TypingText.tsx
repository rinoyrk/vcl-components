import React, { useEffect, useRef, useState, useCallback } from "react";

export interface TypingTextProps {
  strings: string[];
  /** Base chars/s */
  typeSpeed?: number;
  deleteSpeed?: number;
  /** ms pause between strings */
  pauseDuration?: number;
  loop?: boolean;
  cursorColor?: string;
  className?: string;
}

const TypingText: React.FC<TypingTextProps> = ({
  strings,
  typeSpeed = 55,
  deleteSpeed = 35,
  pauseDuration = 1400,
  loop = true,
  cursorColor = "#6366f1",
  className = "",
}) => {
  const [display, setDisplay] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const stateRef = useRef({
    strIndex: 0,
    charIndex: 0,
    deleting: false,
    done: false,
  });
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.done && !loop) return;

    const current = strings[s.strIndex % strings.length];

    if (!s.deleting) {
      if (s.charIndex < current.length) {
        setDisplay(current.slice(0, s.charIndex + 1));
        s.charIndex++;
        // Slight randomness for realism
        const jitter = (Math.random() - 0.5) * 40;
        rafRef.current = setTimeout(tick, 1000 / typeSpeed + jitter);
      } else {
        // Pause then delete
        rafRef.current = setTimeout(() => {
          s.deleting = true;
          tick();
        }, pauseDuration);
      }
    } else {
      if (s.charIndex > 0) {
        setDisplay(current.slice(0, s.charIndex - 1));
        s.charIndex--;
        rafRef.current = setTimeout(tick, 1000 / deleteSpeed);
      } else {
        s.deleting = false;
        s.strIndex++;
        if (!loop && s.strIndex >= strings.length) {
          s.done = true;
          return;
        }
        rafRef.current = setTimeout(tick, 300);
      }
    }
  }, [strings, typeSpeed, deleteSpeed, pauseDuration, loop]);

  useEffect(() => {
    rafRef.current = setTimeout(tick, 600);
    return () => clearTimeout(rafRef.current ?? undefined);
  }, [tick]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{display}</span>
      <span
        className="ml-0.5 inline-block w-[2px] h-[1.1em] rounded-sm align-middle"
        style={{
          background: cursorColor,
          opacity: cursorVisible ? 1 : 0,
          transition: "opacity 0.1s",
        }}
      />
    </span>
  );
};

export default TypingText;
