import React from "react";
import { motion } from "framer-motion";

export interface MasonryItem {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  height?: number; // 1 = short, 2 = medium, 3 = tall
}

export interface MasonryGridProps {
  items?: MasonryItem[];
  columns?: number;
}

const DEFAULT_ITEMS: MasonryItem[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  src: `https://picsum.photos/seed/${i + 30}/400/${260 + (i % 3) * 100}`,
  alt: `Masonry ${i + 1}`,
  title: `Layer ${i + 1}`,
  height: 1 + (i % 3),
}));

const MasonryGrid: React.FC<MasonryGridProps> = ({
  items = DEFAULT_ITEMS,
  columns = 3,
}) => {
  // Distribute items into columns
  const cols: MasonryItem[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));

  return (
    <div className="flex gap-3 w-full" style={{ alignItems: "flex-start" }}>
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-3 flex-1">
          {col.map((item, ii) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: (ci * col.length + ii) * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.02, zIndex: 2 }}
              className="relative overflow-hidden rounded-xl group cursor-pointer"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto block object-cover"
                loading="lazy"
              />
              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                }}
              >
                <span className="text-white text-xs font-semibold">{item.title}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
