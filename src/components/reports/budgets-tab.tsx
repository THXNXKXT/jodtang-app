"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";

export function BudgetsTab() {
  const { t } = useI18n();
  const { budgets, categories, transactions } = useAppData();

  return (
    <div className="space-y-3">
      {budgets.map((budget, index) => {
        const category = categories.find((c) => c.id === budget.categoryId);
        const iconKey = category?.icon ?? "other_expense";
        const Icon = CATEGORY_ICONS[iconKey];
        const color = CATEGORY_COLORS[iconKey] ?? "#525252";
        const spent = transactions
          .filter((tx) => tx.type === "expense" && tx.categoryId === budget.categoryId)
          .reduce((s, tx) => s + tx.amount, 0);
        const ratio = spent / budget.amount;
        const isOver = spent > budget.amount;
        const widthPct = Math.min(ratio * 100, 100);

        return (
          <Card key={budget.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${color}1a`, color }}
              >
                {Icon ? <Icon size={18} /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {category?.name ?? "—"}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                </p>
              </div>
              <span
                className={`shrink-0 text-sm font-bold tabular-nums ${
                  isOver
                    ? "text-[var(--color-expense)]"
                    : "text-[var(--color-text-primary)]"
                }`}
              >
                {Math.round(ratio * 100)}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: isOver ? "var(--color-expense)" : color,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 * index }}
              />
            </div>

            <p
              className={`text-xs font-medium ${
                isOver
                  ? "text-[var(--color-expense)]"
                  : "text-[var(--color-text-secondary)]"
              }`}
            >
              {isOver
                ? `${t("reports.budgetOver")} ${formatCurrency(spent - budget.amount)}`
                : `${t("reports.budgetLeft")} ${formatCurrency(budget.amount - spent)}`}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
