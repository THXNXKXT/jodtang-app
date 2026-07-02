"use client";
import { motion } from "framer-motion";

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Head/body — bulbous dome */}
      <path d="M24 6C14 6 8 13 8 22C8 27 10 31 14 33V35C14 36 15 37 16 37H32C33 37 34 36 34 35V33C38 31 40 27 40 22C40 13 34 6 24 6Z" fill="var(--color-primary)" />
      {/* Tentacles */}
      <path d="M14 35C13 38 11 39 9 39M9 39C8 39 7 38 7 37M9 39C9 40 10 41 11 41" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M18 36C17 39 15 41 13 42M13 42C12 42 11 41 11 40M13 42C13 43 14 44 15 44" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M24 37V42M24 42C23 42 22 43 22 44M24 42C25 42 26 43 26 44" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M30 36C31 39 33 41 35 42M35 42C36 42 37 41 37 40M35 42C35 43 34 44 33 44" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 35C35 38 37 39 39 39M39 39C40 39 41 38 41 37M39 39C39 40 38 41 37 41" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <circle cx="19" cy="20" r="2.8" fill="white" />
      <circle cx="29" cy="20" r="2.8" fill="white" />
      <circle cx="19.8" cy="19.5" r="1.2" fill="var(--color-primary)" />
      <circle cx="29.8" cy="19.5" r="1.2" fill="var(--color-primary)" />
      {/* Cheeks */}
      <circle cx="14" cy="25" r="2" fill="white" fillOpacity="0.15" />
      <circle cx="34" cy="25" r="2" fill="white" fillOpacity="0.15" />
      {/* Coin slot */}
      <rect x="20" y="8" width="8" height="2" rx="1" fill="white" fillOpacity="0.3" />
      {/* Falling coin */}
      <motion.g
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [-10, 0, 9], opacity: [0, 1, 1, 0], scale: [1, 1, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeIn", times: [0, 0.3, 0.7, 1] }}
      >
        <circle cx="24" cy="2" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <text x="24" y="4" textAnchor="middle" fontSize="4" fill="#f59e0b" fontWeight="bold">B</text>
      </motion.g>
    </svg>
  );
}
