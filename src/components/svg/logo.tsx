"use client";
import { motion } from "framer-motion";

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body — rounder, cleaner */}
      <path d="M11 27C11 19 16 15 24 15C32 15 38 19 38 27C38 29 37 31 35.5 32.5L37 39L29.5 35.5C27.5 36 25.5 36 24 36C16 36 11 33 11 27Z" fill="var(--color-primary)" />
      {/* Ear */}
      <path d="M9 21L5 16L13 19Z" fill="var(--color-primary)" />
      {/* Snout */}
      <ellipse cx="35.5" cy="28" rx="5" ry="4" fill="white" fillOpacity="0.2" />
      <circle cx="34" cy="27" r="1.3" fill="white" fillOpacity="0.5" />
      <circle cx="37" cy="29" r="1.3" fill="white" fillOpacity="0.5" />
      {/* Eye */}
      <circle cx="21" cy="24" r="2.5" fill="white" />
      <circle cx="21.5" cy="23" r="1.1" fill="var(--color-primary)" />
      {/* Coin slot */}
      <rect x="19.5" y="13.5" width="9" height="2.2" rx="1.1" fill="white" fillOpacity="0.35" />
      {/* Legs */}
      <rect x="16" y="34" width="4" height="6" rx="2" fill="var(--color-primary)" />
      <rect x="28" y="34" width="4" height="6" rx="2" fill="var(--color-primary)" />
      {/* Tail — curly */}
      <path d="M10 26C7 26 4.5 24 4.5 21C4.5 19 5.5 18 7 18.5" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Falling coin */}
      <motion.g
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [-10, 0, 14], opacity: [0, 1, 1, 0], scale: [1, 1, 0.25] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeIn", times: [0, 0.3, 0.7, 1] }}
      >
        <circle cx="24" cy="3" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <text x="24" y="5" textAnchor="middle" fontSize="4" fill="#f59e0b" fontWeight="bold">B</text>
      </motion.g>
    </svg>
  );
}
