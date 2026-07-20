"use client";
import { motion } from "framer-motion";

// ponytail: golden retriever pup mascot — floppy ear wiggle, blink, pant.
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left ear — wiggles */}
      <motion.ellipse
        cx="11" cy="22" rx="6" ry="12" fill="#d4a056"
        transform="rotate(-15 11 22)"
        animate={{ rotate: [-15, -8, -15] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
        style={{ transformOrigin: "11px 14px" }}
      />
      {/* Right ear */}
      <ellipse cx="37" cy="22" rx="6" ry="12" fill="#d4a056" transform="rotate(15 37 22)" />

      {/* Head */}
      <circle cx="24" cy="24" r="16" fill="#e8b878" />

      {/* Forehead fluff */}
      <path d="M18 13 Q24 10 30 13 Q28 16 24 16 Q20 16 18 13 Z" fill="#f0c890" />

      {/* Eyes — blink */}
      <motion.g
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 22px" }}
      >
        <circle cx="18" cy="22" r="2.8" fill="#1e293b" />
        <circle cx="30" cy="22" r="2.8" fill="#1e293b" />
        <circle cx="19" cy="21" r="0.9" fill="white" />
        <circle cx="31" cy="21" r="0.9" fill="white" />
      </motion.g>

      {/* Cheeks */}
      <ellipse cx="14" cy="28" rx="2.5" ry="1.8" fill="#e89878" opacity="0.5" />
      <ellipse cx="34" cy="28" rx="2.5" ry="1.8" fill="#e89878" opacity="0.5" />

      {/* Snout */}
      <ellipse cx="24" cy="30" rx="6" ry="5" fill="#f5dcb0" />

      {/* Nose */}
      <ellipse cx="24" cy="28" rx="2.2" ry="1.6" fill="#1e293b" />

      {/* Mouth */}
      <path d="M24 30 L24 33" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M24 33 Q20 35 18 33" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M24 33 Q28 35 30 33" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Panting tongue */}
      <motion.ellipse
        cx="24" cy="35" rx="2" ry="1.3" fill="#f472b6" opacity="0.8"
        animate={{ ry: [1.3, 1.8, 1.3] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 34px" }}
      />
    </svg>
  );
}
