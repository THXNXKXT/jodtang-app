"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

/**
 * Slide-up modal with drag-to-dismiss. The backdrop (z-40) dims and blurs the
 * page; the sheet (z-50) springs up from the bottom and can be dragged down to
 * close when released past a threshold or with enough velocity.
 */
export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      {open && (
        <motion.div
          key="sheet"
          className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.4 }}
          onDragEnd={handleDragEnd}
        >
          <div className="flex justify-center pb-2">
            <div className="h-1 w-10 rounded-full bg-[var(--color-text-muted)]" />
          </div>

          {title !== undefined && (
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="ปิด"
                className="rounded-full p-1 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="max-h-[75vh] overflow-y-auto">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
