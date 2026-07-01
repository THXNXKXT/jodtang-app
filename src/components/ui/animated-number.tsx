"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}

/**
 * Count-up animation on mount. Animates from 0 to the target value using
 * framer-motion's `useMotionValue` + `animate`, formatting each frame via the
 * optional `format` function. A `useTransform` derives the formatted display
 * string and the ref keeps the DOM node in sync.
 */
export function AnimatedNumber({
  value,
  format = (v) => Math.round(v).toString(),
  duration = 0.8,
  className,
}: AnimatedNumberProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => format(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) ref.current.textContent = latest;
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, value, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {format(0)}
    </motion.span>
  );
}
