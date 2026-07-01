"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/config";
import {
  getMonthExpense,
  getMonthIncome,
  getTotalBalance,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function BalanceCard() {
  const { t } = useI18n();
  const balance = getTotalBalance();
  const income = getMonthIncome();
  const expense = getMonthExpense();
  const max = Math.max(income, expense, 1);

  return (
    <Card className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-4"
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("home.totalBalance")}
        </p>
        <AnimatedNumber
          value={balance}
          format={(v) => formatCurrency(v)}
          className="block text-3xl font-bold text-[var(--color-text-primary)]"
        />

        <div className="space-y-3 pt-1">
          <BarRow
            icon={<TrendingUp size={16} />}
            label={t("home.income")}
            amount={income}
            widthPct={(income / max) * 100}
            color="var(--color-income)"
          />
          <BarRow
            icon={<TrendingDown size={16} />}
            label={t("home.expense")}
            amount={expense}
            widthPct={(expense / max) * 100}
            color="var(--color-expense)"
          />
        </div>
      </motion.div>
    </Card>
  );
}

function BarRow({
  icon,
  label,
  amount,
  widthPct,
  color,
}: {
  icon: ReactNode;
  label: string;
  amount: number;
  widthPct: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
          {icon}
          {label}
        </span>
        <span className="font-semibold tabular-nums text-[var(--color-text-primary)]">
          {formatCurrency(amount)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${widthPct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
