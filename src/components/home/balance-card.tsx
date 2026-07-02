"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";

export function BalanceCard() {
  const { t } = useI18n();
  const { wallets, transactions, loading } = useAppData();
  const walletTotal = wallets.reduce((s, w) => s + w.openingBalance, 0);
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const total = walletTotal + income - expense;
  const maxVal = Math.max(income, expense, 1);

  if (loading) return <div className="h-48 animate-pulse rounded-3xl bg-[var(--color-surface)]" />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)] p-5">
      <p className="text-sm text-[var(--color-text-secondary)]">{t("home.totalBalance")}</p>
      <div className="mt-1 text-3xl font-bold tracking-tight">
        <AnimatedNumber value={total} format={(n) => `฿${n.toLocaleString("th-TH")}`} />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="flex-1 rounded-xl bg-[var(--color-surface-hover)] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-income)]"><TrendingUp size={14} /> {t("home.income")}</div>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(income)}</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <motion.div className="h-full rounded-full bg-[var(--color-income)]" initial={{ width: 0 }} animate={{ width: `${(income / maxVal) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
          </div>
        </div>
        <div className="flex-1 rounded-xl bg-[var(--color-surface-hover)] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-expense)]"><TrendingDown size={14} /> {t("home.expense")}</div>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(expense)}</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <motion.div className="h-full rounded-full bg-[var(--color-expense)]" initial={{ width: 0 }} animate={{ width: `${(expense / maxVal) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
