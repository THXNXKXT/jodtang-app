"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUpIcon, TrendingDownIcon, ChevronRightIcon } from "@/components/svg/icons";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";

export function BalanceCard() {
  const { t } = useI18n();
  const { wallets, transactions, loading } = useAppData();
  const [open, setOpen] = useState(false);

  // ponytail: per-wallet balance = opening + income - expense + transfer-in - transfer-out
  const walletBalances = wallets.map((w) => {
    const delta = transactions.reduce((s, tx) => {
      if (tx.walletId === w.id) {
        if (tx.type === "income") return s + tx.amount;
        if (tx.type === "expense") return s - tx.amount;
        if (tx.type === "transfer") return s - tx.amount;
      }
      if (tx.toWalletId === w.id && tx.type === "transfer") return s + tx.amount;
      return s;
    }, 0);
    return { ...w, balance: w.openingBalance + delta };
  });

  const total = walletBalances.reduce((s, w) => s + w.balance, 0);
  const income = transactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const expense = transactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const maxVal = Math.max(income, expense, 1);

  if (loading) return <div className="h-48 animate-pulse rounded-3xl bg-[var(--color-surface)]" />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-surface-hover)]"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-secondary)]">{t("home.totalBalance")}</p>
          <ChevronRightIcon size={16} className="text-[var(--color-text-muted)]" />
        </div>
        <div className="mt-1 text-3xl font-bold tracking-tight">
          <AnimatedNumber value={total} format={(n) => `฿${n.toLocaleString("th-TH")}`} />
        </div>
        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded-xl bg-[var(--color-surface-hover)] p-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-income)]"><TrendingUpIcon size={14} /> {t("home.income")}</div>
            <p className="mt-1 text-sm font-semibold">{formatCurrency(income)}</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
              <motion.div className="h-full rounded-full bg-[var(--color-income)]" initial={{ width: 0 }} animate={{ width: `${(income / maxVal) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
            </div>
          </div>
          <div className="flex-1 rounded-xl bg-[var(--color-surface-hover)] p-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-expense)]"><TrendingDownIcon size={14} /> {t("home.expense")}</div>
            <p className="mt-1 text-sm font-semibold">{formatCurrency(expense)}</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
              <motion.div className="h-full rounded-full bg-[var(--color-expense)]" initial={{ width: 0 }} animate={{ width: `${(expense / maxVal) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
            </div>
          </div>
        </div>
      </motion.div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={t("home.totalBalance")}>
        <div className="space-y-2 p-4 pb-6">
          {walletBalances.map((w) => (
            <div key={w.id} className="flex items-center justify-between rounded-xl bg-[var(--color-surface-hover)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: w.color }} />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">{w.name}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">{formatCurrency(w.balance)}</span>
            </div>
          ))}
          {walletBalances.length > 0 && (
            <div className="flex items-center justify-between border-t border-dashed border-[var(--color-border)] px-4 pt-3">
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">{t("home.totalBalance")}</span>
              <span className="text-base font-bold tabular-nums text-[var(--color-text-primary)]">{formatCurrency(total)}</span>
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
