"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Segment {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Generic tab selector. The active segment's highlight slides between options
 * using a shared `layoutId` background animated by framer-motion.
 */
export function SegmentedControl({
  segments,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "relative flex rounded-lg bg-[var(--color-surface)] p-1",
        className,
      )}
    >
      {segments.map((segment) => {
        const isActive = segment.value === value;
        return (
          <button
            key={segment.value}
            type="button"
            onClick={() => onChange(segment.value)}
            className={cn(
              "relative flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)]",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-control"
                className="absolute inset-0 rounded-md bg-[var(--color-surface-hover)]"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{segment.label}</span>
          </button>
        );
      })}
    </div>
  );
}
