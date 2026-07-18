import React, { useState } from "react";
import { motion } from "framer-motion";

// All components
import MagneticButton from "./components/MagneticButton";
import LiquidHoverCard from "./components/LiquidHoverCard";
import FloatingNavbar from "./components/FloatingNavbar";
import CursorSpotlight from "./components/CursorSpotlight";
import GradientBorderButton from "./components/GradientBorderButton";
import ParallaxHero from "./components/ParallaxHero";
import AudioVisualizer from "./components/AudioVisualizer";
import GlassMorphingCardStack from "./components/GlassMorphingCardStack";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ExpandableGridGallery from "./components/ExpandableGridGallery";
import InfiniteMarquee from "./components/InfiniteMarquee";
import AnimatedToggleSwitch from "./components/AnimatedToggleSwitch";
import ParticleExplosion from "./components/ParticleExplosion";
import AnimatedProgressRing from "./components/AnimatedProgressRing";
import GradientText from "./components/GradientText";
import DragToReorderList from "./components/DragToReorderList";
import HoverTiltCard from "./components/HoverTiltCard";
import MorphingIconButton from "./components/MorphingIconButton";
import StarRating from "./components/StarRating";
import ScrollProgressIndicator from "./components/ScrollProgressIndicator";

// Components 21-40
import MagneticInput from "./components/MagneticInput";
import { DarkModeTransition, ThemeToggleButton } from "./components/DarkModeTransition";
import FrostedSidebar from "./components/FrostedSidebar";
import FireCursorTrail from "./components/FireCursorTrail";
import ElasticSlider from "./components/ElasticSlider";
import MasonryGrid from "./components/MasonryGrid";
import WaveDivider from "./components/WaveDivider";
import RotatingCarousel3D from "./components/RotatingCarousel3D";
import LightningHover from "./components/LightningHover";
import Tooltip from "./components/Tooltip";
import PuzzleLoader from "./components/PuzzleLoader";
import TypingText from "./components/TypingText";
import Starfield from "./components/Starfield";
import FlipCard from "./components/FlipCard";
import PaintBrushReveal from "./components/PaintBrushReveal";
import VolumeKnob from "./components/VolumeKnob";
import CompassNavigation from "./components/CompassNavigation";
import LiquidProgressBar from "./components/LiquidProgressBar";
import IceCrackEffect from "./components/IceCrackEffect";
import ConfettiCelebration from "./components/ConfettiCelebration";

// ─── Marquee items ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "⚡ Framer Motion",
  "🎨 Tailwind CSS",
  "✨ React 19",
  "💎 TypeScript",
  "🌌 CSS Animations",
  "🔥 Web Audio API",
  "🧩 SVG Filters",
  "🎥 Canvas API",
];

const marqueeNodes = MARQUEE_ITEMS.map((item) => (
  <span
    key={item}
    className="px-4 py-2 rounded-full text-sm font-medium text-white/70 border border-white/10 whitespace-nowrap"
    style={{ background: "rgba(255,255,255,0.04)" }}
  >
    {item}
  </span>
));

// ─── ShowcaseCard wrapper ──────────────────────────────────────────────────────
interface ShowcaseCardProps {
  number: number;
  title: string;
  tag: string;
  children: React.ReactNode;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  number,
  title,
  tag,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    className="relative rounded-2xl overflow-hidden flex flex-col"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {/* Card header */}
    <div
      className="flex items-center justify-between px-5 py-3.5 border-b"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md"
          style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}
        >
          {number}
        </span>
        <span className="text-white/80 text-sm font-semibold">{title}</span>
      </div>
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {tag}
      </span>
    </div>

    {/* Demo area */}
    <div className="flex-1 flex items-center justify-center p-6 min-h-[200px]">
      {children}
    </div>
  </motion.div>
);

// ─── Progress ring interactive demo ───────────────────────────────────────────
const ProgressRingDemo = () => {
  const [val, setVal] = useState(68);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <AnimatedProgressRing value={val} size={110} label="Progress" />
        <AnimatedProgressRing
          value={Math.max(0, val - 20)}
          size={110}
          colorFrom="#10b981"
          colorTo="#06b6d4"
          label="Speed"
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-40 accent-indigo-500"
      />
    </div>
  );
};

// ─── Toggle demo ───────────────────────────────────────────────────────────────
const ToggleDemo = () => {
  const [mode, setMode] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatedToggleSwitch defaultChecked={mode} onChange={setMode} size="lg" />
      <span className="text-white/40 text-xs">{mode ? "Dark mode" : "Light mode"}</span>
    </div>
  );
};

// ─── Spotlight demo content ────────────────────────────────────────────────────
const SpotlightContent = () => (
  <div className="p-6 text-center">
    <div className="text-4xl mb-3">🔦</div>
    <h3 className="text-white text-lg font-bold">Hidden Content</h3>
    <p className="text-white/60 text-sm mt-1">
      Move your cursor here to reveal the secrets within.
    </p>
  </div>
);

// ─── ElasticSlider demo ──────────────────────────────────────────────────────
const ElasticSliderDemo = () => {
  const [val, setVal] = useState(40);
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <ElasticSlider defaultValue={val} onChange={(v) => setVal(v)} />
      <span className="text-white/40 text-xs font-mono">{val}</span>
    </div>
  );
};

// ─── LiquidProgressBar demo ──────────────────────────────────────────────────
const LiquidProgressBarDemo = () => {
  const [val, setVal] = useState(65);
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <LiquidProgressBar value={val} />
      <LiquidProgressBar value={Math.max(0, val - 20)} color="#10b981" />
      <input
        type="range"
        min={0}
        max={100}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </div>
  );
};

// ─── VolumeKnob demo ─────────────────────────────────────────────────────────
const VolumeKnobDemo = () => {
  const [vol, setVol] = useState(50);
  const [treble, setTreble] = useState(70);
  return (
    <div className="flex gap-8 items-end justify-center">
      <VolumeKnob value={vol} onChange={setVol} size={90} color="#6366f1" />
      <VolumeKnob value={treble} onChange={setTreble} size={90} color="#ec4899" label="Treble" />
    </div>
  );
};

// ─── PaintBrushReveal demo ───────────────────────────────────────────────────
const PaintBrushRevealDemo = () => {
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <PaintBrushReveal brushColor="#7c3aed" playKey={key}>
        <div className="w-56 h-20 flex items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.3),rgba(236,72,153,0.2))", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-white font-bold text-xl">✨ Revealed!</span>
        </div>
      </PaintBrushReveal>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white/70 hover:text-white transition-colors"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        Replay
      </button>
    </div>
  );
};

// ─── ConfettiCelebration demo ────────────────────────────────────────────────
const ConfettiDemo = () => {
  const [trigger, setTrigger] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="relative w-full" style={{ height: 120 }}>
        <ConfettiCelebration trigger={trigger} count={80} width="100%" height={120} />
      </div>
      <button
        onClick={() => {
          setTrigger(false);
          requestAnimationFrame(() => setTrigger(true));
        }}
        className="text-sm px-4 py-2 rounded-xl font-semibold text-white"
        style={{ background: "linear-gradient(135deg,#f43f5e,#f97316)" }}
      >
        🎉 Celebrate!
      </button>
    </div>
  );
};

// ─── Compass demo ────────────────────────────────────────────────────────────
const COMPASS_ITEMS = [
  { id: "home", label: "Home", icon: "🏠", color: "#6366f1" },
  { id: "search", label: "Search", icon: "🔍", color: "#ec4899" },
  { id: "star", label: "Saved", icon: "⭐", color: "#f59e0b" },
  { id: "bell", label: "Alerts", icon: "🔔", color: "#10b981" },
  { id: "user", label: "Profile", icon: "👤", color: "#06b6d4" },
];

// ─── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const scrollToComponents = () => {
    document.getElementById("components")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "#07070f" }} id="home">
      {/* Scroll progress indicators */}
      <ScrollProgressIndicator shape="line" />
      <ScrollProgressIndicator shape="circle" size={52} />

      {/* Floating Navbar */}
      <FloatingNavbar
        ctaLabel="View Source"
        onCtaClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
      />

      {/* Hero section */}
      <section id="hero">
        <ParallaxHero
          title="VCL Components"
          subtitle="40 premium, production-ready React components with stunning animations."
          ctaLabel="Explore All Components"
          onCtaClick={scrollToComponents}
        />
      </section>

      {/* Marquee strip */}
      <div className="py-8 border-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <InfiniteMarquee items={marqueeNodes} speed={40} pauseOnHover gap={16} />
      </div>

      {/* ── Component Grid ────────────────────────────────────── */}
      <section id="components" className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <GradientText
            className="text-5xl font-black tracking-tight"
            colors={["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#6366f1"]}
            speed={5}
            as="h2"
          >
            Component Showcase
          </GradientText>
          <p className="text-white/40 mt-4 max-w-lg mx-auto text-lg">
            Hover, click, and interact with each component below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* 1 — Magnetic Button */}
          <ShowcaseCard number={1} title="Magnetic Button" tag="Framer Motion">
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton text="Get Started" color="#6366f1" strength={0.45} />
              <MagneticButton text="Subscribe" color="#ec4899" strength={0.55} />
            </div>
          </ShowcaseCard>

          {/* 2 — Liquid Hover Card */}
          <ShowcaseCard number={2} title="Liquid Hover Card" tag="SVG Filter">
            <LiquidHoverCard
              title="Liquid UI"
              description="Watch the card distort and glow on hover with dynamic gradients."
              gradient={["#6366f1", "#ec4899"]}
            />
          </ShowcaseCard>

          {/* 3 — Floating Navbar preview */}
          <ShowcaseCard number={3} title="Floating Navbar" tag="Intersection Observer">
            <div className="flex flex-col items-center gap-3 w-full">
              <div
                className="w-full rounded-xl px-4 py-2.5 flex items-center gap-3"
                style={{
                  background: "rgba(10,10,20,0.75)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-white font-bold text-sm">VCL</span>
                {["Home", "Components", "About"].map((l) => (
                  <span key={l} className="text-white/50 text-xs px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                    {l}
                  </span>
                ))}
                <span className="ml-auto text-xs px-3 py-1 rounded-lg font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  CTA
                </span>
              </div>
              <p className="text-white/30 text-xs text-center">
                Fully functional navbar fixed at top of page ↑
              </p>
            </div>
          </ShowcaseCard>

          {/* 4 — Cursor Spotlight */}
          <ShowcaseCard number={4} title="Cursor Spotlight" tag="CSS Mask">
            <div className="w-full rounded-xl overflow-hidden" style={{ minHeight: 140 }}>
              <CursorSpotlight size={130} overlayColor="rgba(5,5,15,0.92)">
                <SpotlightContent />
              </CursorSpotlight>
            </div>
          </ShowcaseCard>

          {/* 5 — Gradient Border Button */}
          <ShowcaseCard number={5} title="Gradient Border Button" tag="CSS Keyframes">
            <div className="flex flex-wrap gap-4 justify-center">
              <GradientBorderButton colors={["#6366f1", "#ec4899", "#f59e0b"]}>
                Cosmic Energy
              </GradientBorderButton>
              <GradientBorderButton colors={["#10b981", "#06b6d4", "#a855f7"]}>
                Aurora Flow
              </GradientBorderButton>
            </div>
          </ShowcaseCard>

          {/* 6 — Parallax Hero preview */}
          <ShowcaseCard number={6} title="Parallax Hero" tag="Framer Motion">
            <div className="w-full overflow-hidden rounded-xl relative" style={{ height: 160 }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f0f2a, #1a0022)" }} />
              <div className="absolute top-2 left-4 w-20 h-20 rounded-full opacity-20 blur-2xl" style={{ background: "#6366f1" }} />
              <div className="absolute bottom-2 right-4 w-16 h-16 rounded-full opacity-15 blur-2xl" style={{ background: "#ec4899" }} />
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                <span className="text-white font-black text-xl tracking-tight">Beyond Imagination</span>
                <span className="text-white/40 text-xs">Multi-layer parallax on scroll</span>
              </div>
            </div>
          </ShowcaseCard>

          {/* 7 — Audio Visualizer */}
          <ShowcaseCard number={7} title="Audio Visualizer" tag="Web Audio API">
            <AudioVisualizer bars={40} color="#6366f1" colorHigh="#ec4899" />
          </ShowcaseCard>

          {/* 8 — Glass Morphing Card Stack */}
          <ShowcaseCard number={8} title="Glass Card Stack" tag="Framer Motion">
            <GlassMorphingCardStack />
          </ShowcaseCard>

          {/* 9 — Loading Skeleton */}
          <ShowcaseCard number={9} title="Loading Skeleton" tag="CSS Animation">
            <div className="flex flex-col gap-4 w-full items-center">
              <LoadingSkeleton variant="card" />
              <div className="w-full max-w-xs">
                <LoadingSkeleton variant="avatar" />
              </div>
              <div className="w-full max-w-xs">
                <LoadingSkeleton variant="text" lines={3} />
              </div>
            </div>
          </ShowcaseCard>

          {/* 10 — Expandable Grid Gallery */}
          <ShowcaseCard number={10} title="Expandable Gallery" tag="Framer Motion">
            <ExpandableGridGallery />
          </ShowcaseCard>

          {/* 11 — Infinite Marquee */}
          <ShowcaseCard number={11} title="Infinite Marquee" tag="CSS Animation">
            <div className="w-full flex flex-col gap-3">
              <InfiniteMarquee
                items={["React", "TypeScript", "Tailwind", "Vite", "Framer"].map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold text-white border"
                    style={{ background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.3)" }}>
                    {t}
                  </span>
                ))}
                speed={50}
                gap={10}
              />
              <InfiniteMarquee
                items={["Aurora", "Prism", "Nebula", "Zenith", "Cosmos"].map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold text-white border"
                    style={{ background: "rgba(236,72,153,0.15)", borderColor: "rgba(236,72,153,0.3)" }}>
                    {t}
                  </span>
                ))}
                speed={35}
                direction="right"
                gap={10}
              />
            </div>
          </ShowcaseCard>

          {/* 12 — Animated Toggle */}
          <ShowcaseCard number={12} title="Animated Toggle" tag="Framer Motion">
            <ToggleDemo />
          </ShowcaseCard>

          {/* 13 — Particle Explosion */}
          <ShowcaseCard number={13} title="Particle Explosion" tag="Canvas">
            <ParticleExplosion count={32} />
          </ShowcaseCard>

          {/* 14 — Progress Ring */}
          <ShowcaseCard number={14} title="Progress Ring" tag="SVG">
            <ProgressRingDemo />
          </ShowcaseCard>

          {/* 15 — Gradient Text */}
          <ShowcaseCard number={15} title="Gradient Text" tag="CSS Animation">
            <div className="flex flex-col items-center gap-4">
              <GradientText className="text-3xl font-black"
                colors={["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#6366f1"]}
                speed={3} as="h3">
                Flowing Colors
              </GradientText>
              <GradientText className="text-lg font-semibold"
                colors={["#10b981", "#06b6d4", "#6366f1", "#10b981"]}
                speed={5}>
                Emerald to Indigo
              </GradientText>
            </div>
          </ShowcaseCard>

          {/* 16 — Drag to Reorder */}
          <ShowcaseCard number={16} title="Drag to Reorder" tag="Framer Motion">
            <DragToReorderList />
          </ShowcaseCard>

          {/* 17 — Hover Tilt Card */}
          <ShowcaseCard number={17} title="3D Tilt Card" tag="CSS Transforms">
            <HoverTiltCard maxTilt={20}>
              <div className="w-64 h-44 p-5 flex flex-col justify-between"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.15))",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                <div className="flex justify-between items-start">
                  <span className="text-3xl">💎</span>
                  <span className="text-white/30 text-xs font-mono">3D CARD</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Hover to Tilt</p>
                  <p className="text-white/50 text-xs mt-0.5">Mouse position drives 3D rotation</p>
                </div>
              </div>
            </HoverTiltCard>
          </ShowcaseCard>

          {/* 18 — Morphing Icon Button */}
          <ShowcaseCard number={18} title="Morphing Icon Button" tag="SVG Animation">
            <div className="flex flex-col items-center gap-4">
              <MorphingIconButton size={52} />
              <span className="text-white/30 text-xs">Click to toggle menu ↔ close</span>
            </div>
          </ShowcaseCard>

          {/* 19 — Star Rating */}
          <ShowcaseCard number={19} title="Star Rating" tag="React">
            <div className="flex flex-col items-center gap-4">
              <StarRating defaultValue={3.5} halfStars size={36} />
              <StarRating defaultValue={4} halfStars={false} colorFilled="#ec4899" size={28} />
            </div>
          </ShowcaseCard>

          {/* 20 — Scroll Progress */}
          <ShowcaseCard number={20} title="Scroll Progress" tag="Window Scroll">
            <div className="flex gap-8 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="relative" style={{ width: 52, height: 52 }}>
                  <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
                    <defs>
                      <linearGradient id="demo-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <circle cx="26" cy="26" r="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
                    <circle cx="26" cy="26" r="22" fill="none" stroke="url(#demo-ring-grad)" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={String(2 * Math.PI * 22)}
                      strokeDashoffset={String(2 * Math.PI * 22 * 0.35)} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">65%</span>
                  </div>
                </div>
                <span className="text-white/30 text-xs">Circle</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, #6366f1, #ec4899)" }} />
                </div>
                <span className="text-white/30 text-xs">Line (top of page ↑)</span>
              </div>
            </div>
          </ShowcaseCard>

          {/* 21 — Magnetic Input */}
          <ShowcaseCard number={21} title="Magnetic Input" tag="Framer Motion">
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <MagneticInput label="Email" placeholder="you@example.com" type="email" />
              <MagneticInput label="Password" placeholder="••••••••" type="password" />
            </div>
          </ShowcaseCard>

          {/* 22 — Dark Mode Transition */}
          <ShowcaseCard number={22} title="Dark Mode Transition" tag="clip-path Reveal">
            <DarkModeTransition>
              <div className="flex flex-col items-center gap-3">
                <ThemeToggleButton />
                <span className="text-white/40 text-xs text-center">Click for a circular reveal</span>
              </div>
            </DarkModeTransition>
          </ShowcaseCard>

          {/* 23 — Frosted Sidebar */}
          <ShowcaseCard number={23} title="Frosted Sidebar" tag="Glassmorphism">
            <div className="relative overflow-hidden rounded-xl" style={{ width: 280, height: 220 }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0f0f2a,#1a0030)" }} />
              <FrostedSidebar defaultOpen={true} />
            </div>
          </ShowcaseCard>

          {/* 24 — Fire Cursor Trail */}
          <ShowcaseCard number={24} title="Fire Cursor Trail" tag="Canvas">
            <div className="relative overflow-hidden rounded-xl" style={{ width: "100%", height: 160, background: "#05050f" }}>
              <FireCursorTrail />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white/40 text-xs">Move cursor here</span>
              </div>
            </div>
          </ShowcaseCard>

          {/* 25 — Elastic Slider */}
          <ShowcaseCard number={25} title="Elastic Slider" tag="Spring Physics">
            <ElasticSliderDemo />
          </ShowcaseCard>

          {/* 26 — Masonry Grid */}
          <ShowcaseCard number={26} title="Masonry Grid" tag="Framer Motion">
            <div className="overflow-hidden rounded-xl" style={{ maxHeight: 220, width: "100%" }}>
              <MasonryGrid columns={3} />
            </div>
          </ShowcaseCard>

          {/* 27 — Wave Divider */}
          <ShowcaseCard number={27} title="Wave Divider" tag="SVG Animation">
            <div className="w-full flex flex-col gap-2">
              <WaveDivider colorBottom="#6366f1" amplitude={0.8} />
              <WaveDivider colorBottom="#ec4899" amplitude={0.8} speed="fast" />
              <WaveDivider colorBottom="#10b981" amplitude={0.8} speed="slow" />
            </div>
          </ShowcaseCard>

          {/* 28 — 3D Carousel */}
          <ShowcaseCard number={28} title="3D Carousel" tag="CSS 3D">
            <RotatingCarousel3D autoRotate autoRotateDelay={2500} />
          </ShowcaseCard>

          {/* 29 — Lightning Hover */}
          <ShowcaseCard number={29} title="Lightning Hover" tag="Canvas">
            <LightningHover color="#a5b4fc" bolts={5}>
              <div className="w-56 h-28 flex items-center justify-center rounded-xl font-bold text-white text-lg cursor-pointer select-none"
                style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))", border: "1px solid rgba(165,180,252,0.25)" }}>
                ⚡ Hover me
              </div>
            </LightningHover>
          </ShowcaseCard>

          {/* 30 — Tooltip */}
          <ShowcaseCard number={30} title="Tooltip" tag="Framer Motion">
            <div className="flex flex-wrap gap-5 justify-center items-center" style={{ padding: 24 }}>
              {(["top", "bottom", "left", "right"] as const).map((placement) => (
                <Tooltip key={placement} content={`Tooltip ${placement}`} placement={placement} accentColor="#7c3aed">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white capitalize"
                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}>
                    {placement}
                  </button>
                </Tooltip>
              ))}
            </div>
          </ShowcaseCard>

          {/* 31 — Puzzle Loader */}
          <ShowcaseCard number={31} title="Puzzle Loader" tag="CSS Animation">
            <PuzzleLoader size={48} color="#6366f1" />
          </ShowcaseCard>

          {/* 32 — Typing Text */}
          <ShowcaseCard number={32} title="Typing Text" tag="Typewriter">
            <TypingText
              strings={["Premium Components.", "Built with Framer Motion.", "Ready for Production.", "Open Source ✨"]}
              typeSpeed={60}
              cursorColor="#7c3aed"
              className="text-xl font-bold text-white"
            />
          </ShowcaseCard>

          {/* 33 — Starfield */}
          <ShowcaseCard number={33} title="Starfield Background" tag="Canvas">
            <div className="overflow-hidden rounded-xl relative" style={{ width: "100%", height: 160 }}>
              <Starfield starCount={160} speed={0.4} style={{ width: "100%", height: 160 }} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white/50 text-xs">Move cursor for parallax</span>
              </div>
            </div>
          </ShowcaseCard>

          {/* 34 — Flip Card */}
          <ShowcaseCard number={34} title="Flip Card" tag="CSS 3D">
            <FlipCard
              trigger="click"
              width={200}
              height={130}
              front={
                <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl gap-2"
                  style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <span className="text-2xl">🃏</span>
                  <span className="text-white font-bold text-sm">Click to Flip</span>
                </div>
              }
              back={
                <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl gap-2"
                  style={{ background: "linear-gradient(135deg,#ec4899,#f59e0b)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <span className="text-2xl">✨</span>
                  <span className="text-white font-bold text-sm">Back Face!</span>
                </div>
              }
            />
          </ShowcaseCard>

          {/* 35 — Paint Brush Reveal */}
          <ShowcaseCard number={35} title="Paint Brush Reveal" tag="SVG Mask">
            <PaintBrushRevealDemo />
          </ShowcaseCard>

          {/* 36 — Volume Knob */}
          <ShowcaseCard number={36} title="Volume Knob" tag="SVG Drag">
            <VolumeKnobDemo />
          </ShowcaseCard>

          {/* 37 — Compass Navigation */}
          <ShowcaseCard number={37} title="Compass Navigation" tag="Radial Menu">
            <CompassNavigation items={COMPASS_ITEMS} size={220} />
          </ShowcaseCard>

          {/* 38 — Liquid Progress Bar */}
          <ShowcaseCard number={38} title="Liquid Progress Bar" tag="SVG Wave">
            <LiquidProgressBarDemo />
          </ShowcaseCard>

          {/* 39 — Ice Crack Effect */}
          <ShowcaseCard number={39} title="Ice Crack Effect" tag="Canvas">
            <IceCrackEffect
              crackCount={8}
              className="rounded-xl"
              style={{ width: "100%", minHeight: 140 }}
            >
              <div className="w-full h-full flex items-center justify-center rounded-xl pointer-events-none select-none"
                style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(99,102,241,0.15))", border: "1px solid rgba(6,182,212,0.2)", minHeight: 140 }}>
                <span className="text-white/60 text-sm">🧊 Click anywhere to crack</span>
              </div>
            </IceCrackEffect>
          </ShowcaseCard>

          {/* 40 — Confetti Celebration */}
          <ShowcaseCard number={40} title="Confetti Celebration" tag="Canvas">
            <ConfettiDemo />
          </ShowcaseCard>

        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t py-12 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <GradientText className="text-2xl font-bold"
          colors={["#6366f1", "#a855f7", "#ec4899"]}
          speed={4}>
          VCL Components
        </GradientText>
        <p className="text-white/30 text-sm mt-2">
          40 premium React components · Built with Framer Motion + Tailwind
        </p>
      </footer>
    </div>
  );
}

export default App;
