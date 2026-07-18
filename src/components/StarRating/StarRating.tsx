import React, { useState } from "react";
import { motion } from "framer-motion";

export interface StarRatingProps {
  defaultValue?: number;
  max?: number;
  halfStars?: boolean;
  onChange?: (value: number) => void;
  size?: number;
  colorFilled?: string;
  colorEmpty?: string;
}

const StarPath =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

interface StarProps {
  index: number;
  fill: number; // 0, 0.5, or 1
  isHovered: boolean;
  size: number;
  colorFilled: string;
  colorEmpty: string;
  onMouseEnter: (val: number) => void;
  onClick: (val: number) => void;
}

const Star: React.FC<StarProps> = ({
  index,
  fill,
  isHovered,
  size,
  colorFilled,
  colorEmpty,
  onMouseEnter,
  onClick,
}) => {
  const gradId = `star-grad-${index}`;

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
      animate={{
        scale: fill > 0 ? (isHovered ? 1.25 : 1.1) : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        overflow="visible"
      >
        <defs>
          <linearGradient id={gradId}>
            <stop offset={`${fill * 100}%`} stopColor={colorFilled} />
            <stop offset={`${fill * 100}%`} stopColor={colorEmpty} />
          </linearGradient>
        </defs>
        <path
          d={StarPath}
          fill={`url(#${gradId})`}
          stroke={fill > 0 ? colorFilled : colorEmpty}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>

      {/* Half-star left zone */}
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        onMouseEnter={() => onMouseEnter(index + 0.5)}
        onClick={() => onClick(index + 0.5)}
      />
      {/* Full-star right zone */}
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        onMouseEnter={() => onMouseEnter(index + 1)}
        onClick={() => onClick(index + 1)}
      />
    </motion.div>
  );
};

const StarRating: React.FC<StarRatingProps> = ({
  defaultValue = 0,
  max = 5,
  halfStars = true,
  onChange,
  size = 32,
  colorFilled = "#f59e0b",
  colorEmpty = "rgba(255,255,255,0.2)",
}) => {
  const [value, setValue] = useState(defaultValue);
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered ?? value;

  const handleClick = (v: number) => {
    const next = halfStars ? v : Math.floor(v);
    setValue(next === value ? 0 : next);
    onChange?.(next === value ? 0 : next);
  };

  const getFill = (index: number) => {
    const v = displayValue;
    if (v >= index + 1) return 1;
    if (halfStars && v >= index + 0.5) return 0.5;
    return 0;
  };

  return (
    <div
      className="flex items-center gap-0.5 select-none"
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          index={i}
          fill={getFill(i)}
          isHovered={hovered !== null && hovered >= i + 0.5}
          size={size}
          colorFilled={colorFilled}
          colorEmpty={colorEmpty}
          onMouseEnter={(v) => setHovered(halfStars ? v : Math.ceil(v))}
          onClick={handleClick}
        />
      ))}
      <motion.span
        key={displayValue}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="ml-2 text-sm font-semibold"
        style={{ color: displayValue > 0 ? colorFilled : "rgba(255,255,255,0.3)" }}
      >
        {displayValue > 0 ? displayValue.toFixed(halfStars ? 1 : 0) : "–"}
      </motion.span>
    </div>
  );
};

export default StarRating;
