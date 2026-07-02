"use client";
import { useI18n } from "@/i18n/config";
import { motion } from "framer-motion";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, formatRelativeDate, catName } from "@/lib/utils";
import { useAppData } from "@/lib/data-provider";
import type { Transaction } from "@/types";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { categories, wallets } = useAppData();
  const { locale } = useI18n();
  const category = categories.find((c) => c.id === transaction.categoryId);
  const wallet = wallets.find((w) => w.id === transaction.walletId);
  const Icon = category ? CATEGORY_ICONS[category.icon] : CATEGORY_ICONS.other_expense;
  const color = category ? (CATEGORY_COLORS[category.icon] ?? "#525252") : "#525252";
  const isIncome = transaction.type === "income";

  return (
    <motion.div layout className="flex items-center gap-3.5 px-4 py-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1a` }}
      >
        {Icon ? <Icon size={20} style={{ color }} /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
          {transaction.note || catName(category, locale)}
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
          {wallet?.name} - {formatRelativeDate(transaction.date)}
        </p>
      </div>
      <span
        className="shrink-0 text-sm font-semibold tabular-nums"
        style={{ color: isIncome ? "var(--color-income)" : "var(--color-text-primary)" }}
      >
        {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
      </span>
    </motion.div>
  );
}
