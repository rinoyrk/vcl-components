import React from "react";
import "./LoadingSkeleton.css";

type Variant = "text" | "card" | "avatar";

export interface LoadingSkeletonProps {
  variant?: Variant;
  lines?: number; // for 'text' variant
  className?: string;
}

const Shimmer: React.FC<{ className: string }> = ({ className }) => (
  <div className={`skeleton-shimmer ${className}`} />
);

const TextSkeleton: React.FC<{ lines: number }> = ({ lines }) => (
  <div className="flex flex-col gap-2 w-full">
    {Array.from({ length: lines }).map((_, i) => (
      <Shimmer
        key={i}
        className="h-3 rounded-full"
        // Last line shorter
        {...({ style: { width: i === lines - 1 ? "65%" : "100%" } } as any)}
      />
    ))}
  </div>
);

const CardSkeleton: React.FC = () => (
  <div
    className="rounded-2xl overflow-hidden p-4 flex flex-col gap-3"
    style={{ background: "rgba(255,255,255,0.04)", width: 220 }}
  >
    <Shimmer className="w-full h-28 rounded-xl" />
    <Shimmer className="h-3 rounded-full w-3/4" />
    <Shimmer className="h-3 rounded-full w-full" />
    <Shimmer className="h-3 rounded-full w-1/2" />
    <div className="flex items-center gap-2 mt-1">
      <Shimmer className="w-6 h-6 rounded-full flex-shrink-0" />
      <Shimmer className="h-2.5 rounded-full flex-1" />
    </div>
  </div>
);

const AvatarSkeleton: React.FC = () => (
  <div className="flex items-center gap-3">
    <Shimmer className="w-12 h-12 rounded-full flex-shrink-0" />
    <div className="flex flex-col gap-2 flex-1">
      <Shimmer className="h-3 rounded-full w-32" />
      <Shimmer className="h-2.5 rounded-full w-20" />
    </div>
  </div>
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "card",
  lines = 4,
  className = "",
}) => {
  return (
    <div className={className}>
      {variant === "text" && <TextSkeleton lines={lines} />}
      {variant === "card" && <CardSkeleton />}
      {variant === "avatar" && <AvatarSkeleton />}
    </div>
  );
};

export default LoadingSkeleton;
