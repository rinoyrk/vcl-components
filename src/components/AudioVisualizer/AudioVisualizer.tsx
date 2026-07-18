import React, { useRef, useEffect, useState, useCallback } from "react";

export interface AudioVisualizerProps {
  /** Bar count */
  bars?: number;
  /** Accent color */
  color?: string;
  /** Secondary color for intensity gradient */
  colorHigh?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  bars = 48,
  color = "#6366f1",
  colorHigh = "#ec4899",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [barHeights, setBarHeights] = useState<number[]>(
    Array(bars).fill(4)
  );
  const [usingDemo, setUsingDemo] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const demoRafRef = useRef<number>(0);
  const demoTimeRef = useRef<number>(0);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(demoRafRef.current);
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    setIsListening(false);
    setUsingDemo(false);
    setBarHeights(Array(bars).fill(4));
  }, [bars]);

  // Animate bars from analyser data
  const startAnalysis = useCallback(
    (analyser: AnalyserNode) => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const frame = () => {
        analyser.getByteFrequencyData(dataArray);
        const step = Math.floor(dataArray.length / bars);
        const heights = Array.from({ length: bars }, (_, i) => {
          const val = dataArray[i * step] ?? 0;
          return Math.max(4, (val / 255) * 96);
        });
        setBarHeights(heights);
        rafRef.current = requestAnimationFrame(frame);
      };
      rafRef.current = requestAnimationFrame(frame);
    },
    [bars]
  );

  // Demo mode: animated fake data
  const startDemo = useCallback(() => {
    setUsingDemo(true);
    const frame = (t: number) => {
      const heights = Array.from({ length: bars }, (_, i) => {
        const base = Math.sin(t * 0.001 + i * 0.4) * 0.5 + 0.5;
        const spike = Math.sin(t * 0.003 + i * 1.1) * 0.3 + 0.3;
        return Math.max(4, (base + spike) * 55);
      });
      setBarHeights(heights);
      demoRafRef.current = requestAnimationFrame(frame);
    };
    demoRafRef.current = requestAnimationFrame(frame);
  }, [bars]);

  const handleToggle = useCallback(async () => {
    if (isListening) {
      stopListening();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      setIsListening(true);
      startAnalysis(analyser);
    } catch (e: any) {
      if (e?.name === "NotAllowedError") {
        setError("Microphone access denied. Showing demo visualization.");
      } else {
        setError("Mic unavailable. Showing demo visualization.");
      }
      setIsListening(true);
      startDemo();
    } finally {
      setIsLoading(false);
    }
  }, [isListening, stopListening, startAnalysis, startDemo]);

  useEffect(() => () => stopListening(), [stopListening]);

  // Interpolate color based on bar height
  const getBarColor = (height: number) => {
    const t = Math.min(1, height / 96);
    // Simple hex lerp using CSS
    return `color-mix(in oklch, ${colorHigh} ${Math.round(t * 100)}%, ${color})`;
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Visualizer bars */}
      <div
        className="flex items-end gap-[2px] rounded-xl overflow-hidden px-4 py-3"
        style={{
          background: "rgba(10,10,20,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          height: 120,
          minWidth: 280,
        }}
      >
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${h}px`,
              background: isListening
                ? getBarColor(h)
                : "rgba(255,255,255,0.15)",
              transitionDuration: "50ms",
            }}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-amber-400/80 text-center max-w-xs">{error}</p>
      )}
      {usingDemo && !error && (
        <p className="text-xs text-white/30 text-center">Demo mode</p>
      )}

      {/* Control button */}
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
        style={{
          background: isListening
            ? "rgba(239,68,68,0.2)"
            : `linear-gradient(135deg, ${color}, ${colorHigh})`,
          border: isListening
            ? "1px solid rgba(239,68,68,0.4)"
            : "1px solid transparent",
          boxShadow: isListening
            ? "none"
            : `0 4px 20px rgba(99,102,241,0.35)`,
        }}
      >
        {isLoading ? "Requesting..." : isListening ? "Stop" : "Start Mic"}
      </button>
    </div>
  );
};

export default AudioVisualizer;
