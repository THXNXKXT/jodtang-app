"use client";
import { motion } from "framer-motion";

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M12 26C12 18 17 14 24 14C31 14 38 18 38 26C38 28 37 30 35 31L37 38L30 34C28 35 26 35 24 35C17 35 12 32 12 26Z" fill="var(--color-primary)" />
      {/* Ear */}
      <path d="M10 20L6 15L13 18Z" fill="var(--color-primary)" />
      {/* Snout */}
      <ellipse cx="36" cy="27" rx="4.5" ry="4" fill="white" fillOpacity="0.25" />
      <circle cx="35" cy="26" r="1.2" fill="white" fillOpacity="0.6" />
      <circle cx="37" cy="28" r="1.2" fill="white" fillOpacity="0.6" />
      {/* Eye */}
      <circle cx="22" cy="23" r="2.2" fill="white" />
      <circle cx="22.7" cy="22.3" r="1" fill="var(--color-primary)" />
      {/* Coin slot */}
      <rect x="20" y="12.5" width="8" height="2" rx="1" fill="white" fillOpacity="0.4" />
      {/* Legs */}
      <rect x="17" y="33" width="3.5" height="6" rx="1.75" fill="var(--color-primary)" />
      <rect x="27.5" y="33" width="3.5" height="6" rx="1.75" fill="var(--color-primary)" />
      {/* Tail */}
      <path d="M11 25C7 25 5 22 5 19" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Coin: falls, shrinks into slot */}
      <motion.g
        initial={{ y: -10, opacity: 0, scale: 1 }}
        animate={{ y: [-10, 0, 14], opacity: [0, 1, 1, 0], scale: [1, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeIn", times: [0, 0.3, 0.7, 1] }}
      >
        <circle cx="24" cy="4" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <text x="24" y="6" textAnchor="middle" fontSize="4" fill="#f59e0b" fontWeight="bold">B</text>
      </motion.g>
    </svg>
  );
}
