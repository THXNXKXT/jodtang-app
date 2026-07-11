"use client";

import { motion } from "framer-motion";
import { TrendingDownIcon, PiggyBankIcon, AlertTriangleIcon } from "lucide-react";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";

// ponytail: pick the single best insight to show — no list of empty cards
export function InsightsCard() {
  const { transactions, budgets, categories, loading } = useAppData();
  if (loading) return null;

  const now = new Date();
  const thisY = now.getFullYear(), thisM = now.getMonth();
  const last = new Date(thisY, thisM - 1, 1);
  const lastY = last.getFullYear(), lastM = last.getMonth();

  const inMonth = (date: string, y: number, m: number) => {
    const d = new Date(date);
    return d.getFullYear() === y && d.getMonth() === m;
  };

  const sumExpense = (y: number, m: number) =>
    transactions.filter((t) => t.type === "expense" && inMonth(t.date, y, m)).reduce((s, t) => s + t.amount, 0);
  const sumIncome = (y: number, m: number) =>
    transactions.filter((t) => t.type === "income" && inMonth(t.date, y, m)).reduce((s, t) => s + t.amount, 0);

  const thisExp = sumExpense(thisY, thisM);
  const lastExp = sumExpense(lastY, lastM);
  const thisInc = sumIncome(thisY, thisM);
  const saved = thisInc - thisExp;

  // ponytail: priority — over-budget > saved > expense-down > nothing
  const overBudget = budgets
    .map((b) => {
      const spent = transactions
        .filter((t) => t.type === "expense" && t.categoryId === b.categoryId && inMonth(t.date, thisY, thisM))
        .reduce((s, t) => s + t.amount, 0);
      const cat = categories.find((c) => c.id === b.categoryId);
      return { name: cat?.name ?? "", spent, amount: b.amount };
    })
    .find((b) => b.spent > b.amount);

  let icon = <PiggyBankIcon size={16} />;
  let color = "var(--color-income)";
  let title = "ออมได้";
  let value = formatCurrency(saved);
  let sub = saved >= 0 ? `เดือนนี้ (รายรับ ${formatCurrency(thisInc)})` : "เดือนนี้ขาดดุล";

  if (overBudget) {
    icon = <AlertTriangleIcon size={16} />;
    color = "var(--color-expense)";
    title = "เกินงบ";
    value = overBudget.name;
    sub = `ใช้ ${formatCurrency(overBudget.spent)} / งบ ${formatCurrency(overBudget.amount)}`;
  } else if (lastExp > 0 && thisExp < lastExp) {
    const pct = Math.round((1 - thisExp / lastExp) * 100);
    icon = <TrendingDownIcon size={16} />;
    color = "var(--color-income)";
    title = "ใช้จ่ายลดลง";
    value = `${pct}%`;
    sub = `${formatCurrency(thisExp)} vs ${formatCurrency(lastExp)} เดือนก่อน`;
  } else if (saved < 0) {
    icon = <AlertTriangleIcon size={16} />;
    color = "var(--color-expense)";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${color.startsWith("var") ? "rgba(239,68,68,0.12)" : color + "1a"}`, color }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--color-text-secondary)]">{title}</p>
        <p className="truncate text-sm font-semibold" style={{ color }}>{value}</p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">{sub}</p>
      </div>
    </motion.div>
  );
}
