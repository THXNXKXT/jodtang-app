"use client";
import { FlameIcon } from "lucide-react";
import { useAppData } from "@/lib/data-provider";

// ponytail: streak = consecutive days (ending today or yesterday) with >=1 tx.
// No persistence — recomputed from txs each render. Cheap (≤200 items).
export function StreakBadge() {
  const { transactions } = useAppData();
  if (transactions.length === 0) return null;

  const days = new Set(transactions.map((t) => new Date(t.date).toISOString().slice(0, 10)));
  let streak = 0;
  const d = new Date();
  // ponytail: allow streak to count from yesterday if today has none yet
  const today = d.toISOString().slice(0, 10);
  if (!days.has(today)) d.setDate(d.getDate() - 1);
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  if (streak < 2) return null;

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
      <FlameIcon size={16} className="text-[#f97316]" />
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{streak}</span>
      <span className="text-xs text-[var(--color-text-secondary)]">วันติดต่อกัน</span>
    </div>
  );
}
