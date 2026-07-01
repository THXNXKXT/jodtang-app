import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** When true, the card surface lightens on hover. */
  hoverable?: boolean;
}

/**
 * Simple surface card with a border and background. Server component — no
 * client-side behavior unless `hoverable` is used (pure CSS transition).
 */
export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
        hoverable &&
          "cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
