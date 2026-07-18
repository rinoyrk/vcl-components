import React, { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { motion } from "framer-motion";

export interface DragListItem {
  id: string;
  label: string;
  emoji?: string;
  accent?: string;
}

export interface DragToReorderListProps {
  defaultItems?: DragListItem[];
  onReorder?: (items: DragListItem[]) => void;
}

const DEFAULT_ITEMS: DragListItem[] = [
  { id: "1", label: "Design System", emoji: "🎨", accent: "#6366f1" },
  { id: "2", label: "Animations", emoji: "✨", accent: "#ec4899" },
  { id: "3", label: "Components", emoji: "🧩", accent: "#10b981" },
  { id: "4", label: "Interactions", emoji: "⚡", accent: "#f59e0b" },
  { id: "5", label: "Typography", emoji: "🔤", accent: "#a855f7" },
];

const DragItem: React.FC<{ item: DragListItem }> = ({ item }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-xl px-4 py-3 select-none cursor-default group"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      whileDrag={{
        scale: 1.04,
        boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${item.accent}66`,
        backgroundColor: "rgba(255,255,255,0.08)",
        zIndex: 10,
      }}
    >
      {/* Drag handle */}
      <motion.div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded-lg opacity-30 group-hover:opacity-70 transition-opacity"
        whileHover={{ scale: 1.15 }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          {[2, 6, 10].map((y) =>
            [2, 8].map((x) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="white" />
            ))
          )}
        </svg>
      </motion.div>

      {/* Accent dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: item.accent }}
      />

      <span className="text-lg flex-shrink-0">{item.emoji}</span>
      <span className="text-white/80 text-sm font-medium flex-1">
        {item.label}
      </span>

      {/* Right arrow */}
      <span className="text-white/20 text-xs">⠿</span>
    </Reorder.Item>
  );
};

const DragToReorderList: React.FC<DragToReorderListProps> = ({
  defaultItems = DEFAULT_ITEMS,
  onReorder,
}) => {
  const [items, setItems] = useState(defaultItems);

  const handleReorder = (next: DragListItem[]) => {
    setItems(next);
    onReorder?.(next);
  };

  return (
    <div className="w-full max-w-xs flex flex-col gap-1">
      <p className="text-white/30 text-xs mb-2 text-center tracking-wider uppercase">
        Drag to reorder
      </p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="flex flex-col gap-1.5"
        as="div"
      >
        {items.map((item) => (
          <DragItem key={item.id} item={item} />
        ))}
      </Reorder.Group>
    </div>
  );
};

export default DragToReorderList;
