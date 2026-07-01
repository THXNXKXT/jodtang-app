"use client";

import { motion } from "framer-motion";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { getCategoryById, getWalletById } from "@/lib/mock-data";
import { cn, formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionItemProps {
  transaction: Transaction;
}

/**
 * A single transaction row: a tinted category icon circle on the left, the
 * note with wallet and relative date in the middle, and a direction-colored
 * amount on the right. Uses `layout` so it animates smoothly within lists.
 */
export function TransactionItem({ transaction }: TransactionItemProps) {
  const { type, amount, categoryId, walletId, note, date } = transaction;
  const category = getCategoryById(categoryId);
  const wallet = getWalletById(walletId);

  const iconKey = category?.icon ?? "other_expense";
  const Icon = CATEGORY_ICONS[iconKey];
  const color = CATEGORY_COLORS[iconKey] ?? "#525252";

  const isIncome = type === "income";
  const isExpense = type === "expense";
  const amountColor = isIncome
    ? "text-[var(--color-income)]"
    : isExpense
      ? "text-[var(--color-expense)]"
      : "text-[var(--color-transfer)]";
  const sign = isIncome ? "+" : isExpense ? "-" : "";

  return (
    <motion.div layout className="flex items-center gap-3 px-4 py-2.5">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        {Icon ? <Icon size={18} /> : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
          {note}
        </p>
        <p className="truncate text-xs text-[var(--color-text-secondary)]">
          {wallet?.name ?? "—"} · {formatRelativeDate(date)}
        </p>
      </div>

      <p
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          amountColor,
        )}
      >
        {sign}
        {formatCurrency(amount)}
      </p>
    </motion.div>
  );
}
