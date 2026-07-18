import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export interface GalleryItem {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  span?: number; // grid column span
}

export interface ExpandableGridGalleryProps {
  items?: GalleryItem[];
}

// Beautiful gradient placeholder images from picsum
const DEFAULT_ITEMS: GalleryItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  src: `https://picsum.photos/seed/${i + 10}/600/400`,
  alt: `Photo ${i + 1}`,
  title: `Frame ${i + 1}`,
  span: i === 0 || i === 5 ? 2 : 1,
}));

const ExpandableGridGallery: React.FC<ExpandableGridGalleryProps> = ({
  items = DEFAULT_ITEMS,
}) => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <>
      <LayoutGroup>
        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-3 gap-2 w-full max-w-lg"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              layoutId={`gallery-item-${item.id}`}
              onClick={() => setSelected(item)}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{
                gridColumn: item.span ? `span ${item.span}` : "span 1",
                aspectRatio: "4/3",
              }}
              whileHover={{ scale: 1.02, zIndex: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 flex items-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                }}
              >
                <span className="text-white text-xs font-semibold">
                  {item.title}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Fullscreen overlay */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ backgroundColor: "rgba(5,5,15,0.92)" }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                layoutId={`gallery-item-${selected.id}`}
                className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
                style={{ maxHeight: "80vh" }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selected.src}
                  alt={selected.alt}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-6"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  }}
                >
                  <h3 className="text-white text-xl font-bold">
                    {selected.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-colors w-8 h-8 rounded-full grid place-items-center"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </>
  );
};

export default ExpandableGridGallery;
