"use client";
import { motion } from "framer-motion";

// ponytail: piggy bank mascot — coin drops into slot, body jiggles.
// Replaces octopus (too detailed for small sizes). Round silhouette = readable at 16px.
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Ears */}
      <path d="M13 15 L9 5 L19 11 Z" fill="#f472b6" />
      <path d="M35 15 L39 5 L29 11 Z" fill="#f472b6" />
      <path d="M14 14 L12 8 L17 12 Z" fill="#ec4899" />
      <path d="M34 14 L36 8 L31 12 Z" fill="#ec4899" />

      {/* Body — subtle breathe */}
      <motion.circle
        cx="24" cy="26" r="17" fill="#f472b6"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 26px" }}
      />

      {/* Coin slot */}
      <rect x="19" y="11" width="10" height="2.2" rx="1.1" fill="#be185d" opacity="0.35" />

      {/* Falling coin */}
      <motion.g
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: [-8, 0, 2], opacity: [0, 1, 1, 0], scale: [1, 1, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1, ease: "easeIn", times: [0, 0.3, 0.75, 1] }}
      >
        <circle cx="24" cy="6" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <text x="24" y="8" textAnchor="middle" fontSize="4" fill="#92400e" fontWeight="bold">฿</text>
      </motion.g>

      {/* Eyes */}
      <motion.g
        animate={{ scaleY: [1, 0.1, 1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1], ease: "easeInOut" }}
        style={{ transformOrigin: "24px 22px" }}
      >
        <ellipse cx="18" cy="22" rx="2.8" ry="3.2" fill="white" />
        <ellipse cx="30" cy="22" rx="2.8" ry="3.2" fill="white" />
        <circle cx="18.5" cy="21.5" r="1.6" fill="#1e293b" />
        <circle cx="30.5" cy="21.5" r="1.6" fill="#1e293b" />
        <circle cx="19.2" cy="20.5" r="0.6" fill="white" />
        <circle cx="31.2" cy="20.5" r="0.6" fill="white" />
      </motion.g>

      {/* Cheeks */}
      <ellipse cx="13.5" cy="28" rx="2.5" ry="1.8" fill="#fb7185" opacity="0.45" />
      <ellipse cx="34.5" cy="28" rx="2.5" ry="1.8" fill="#fb7185" opacity="0.45" />

      {/* Snout (gold = money) */}
      <ellipse cx="24" cy="31" rx="5.5" ry="4" fill="#fbbf24" />
      <ellipse cx="22" cy="31" rx="0.9" ry="1.3" fill="#92400e" />
      <ellipse cx="26" cy="31" rx="0.9" ry="1.3" fill="#92400e" />

      {/* Smile */}
      <path d="M20 36 Q24 38 28 36" stroke="#be185d" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}
