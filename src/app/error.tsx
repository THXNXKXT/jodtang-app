"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error("App error:", error); }, [error]);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-expense-soft)]">
        <AlertTriangle size={28} className="text-[var(--color-expense)]" />
      </motion.div>
      <div>
        <h2 className="text-lg font-bold">เกิดข้อผิดพลาด</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">ไม่สามารถโหลดหน้านี้ได้</p>
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={reset}
        className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
        <RotateCcw size={16} /> ลองอีกครั้ง
      </motion.button>
    </div>
  );
}
