"use client";
import { motion } from "framer-motion";

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Head/body */}
      <path d="M24 5C13 5 7 12 7 22C7 27 9 31 13 33V35C13 36 14 37 15 37H33C34 37 35 36 35 35V33C39 31 41 27 41 22C41 12 35 5 24 5Z" fill="var(--color-primary)" />

      {/* Tentacle 1 — left outer */}
      <motion.path
        d="M13 35C12 39 9 41 6 41C4 41 3 40 3 38"
        stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ d: ["M13 35C12 39 9 41 6 41C4 41 3 40 3 38", "M13 35C12 38 10 40 7 40C5 40 4 39 4 37", "M13 35C12 39 9 41 6 41C4 41 3 40 3 38"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Tentacle 2 — left inner */}
      <motion.path
        d="M17 36C16 40 14 43 11 44"
        stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ d: ["M17 36C16 40 14 43 11 44", "M17 36C16 39 15 41 12 42", "M17 36C16 40 14 43 11 44"] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      {/* Tentacle 3 — center */}
      <motion.path
        d="M24 37V44"
        stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ d: ["M24 37C24 40 23 43 22 45", "M24 37C24 39 24 42 24 45", "M24 37C24 40 25 43 26 45", "M24 37V44"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      />
      {/* Tentacle 4 — right inner */}
      <motion.path
        d="M31 36C32 40 34 43 37 44"
        stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ d: ["M31 36C32 40 34 43 37 44", "M31 36C32 39 33 41 36 42", "M31 36C32 40 34 43 37 44"] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Tentacle 5 — right outer */}
      <motion.path
        d="M35 35C36 39 39 41 42 41C44 41 45 40 45 38"
        stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ d: ["M35 35C36 39 39 41 42 41C44 41 45 40 45 38", "M35 35C36 38 38 40 41 40C43 40 44 39 44 37", "M35 35C36 39 39 41 42 41C44 41 45 40 45 38"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />

      {/* Eyes */}
      <circle cx="18" cy="19" r="3" fill="white" />
      <circle cx="30" cy="19" r="3" fill="white" />
      <circle cx="18.8" cy="18.3" r="1.3" fill="var(--color-primary)" />
      <circle cx="30.8" cy="18.3" r="1.3" fill="var(--color-primary)" />

      {/* Cheeks */}
      <circle cx="12" cy="25" r="2.5" fill="white" fillOpacity="0.12" />
      <circle cx="36" cy="25" r="2.5" fill="white" fillOpacity="0.12" />

      {/* Smile */}
      <path d="M20 28C22 30 26 30 28 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Coin slot */}
      <rect x="19.5" y="7" width="9" height="2" rx="1" fill="white" fillOpacity="0.3" />

      {/* Falling coin */}
      <motion.g
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [-10, 0, 8], opacity: [0, 1, 1, 0], scale: [1, 1, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeIn", times: [0, 0.3, 0.7, 1] }}
      >
        <circle cx="24" cy="1" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <text x="24" y="3" textAnchor="middle" fontSize="4" fill="#f59e0b" fontWeight="bold">B</text>
      </motion.g>
    </svg>
  );
}
