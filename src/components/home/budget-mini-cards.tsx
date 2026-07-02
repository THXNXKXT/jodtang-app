import { useI18n } from "@/i18n/config";
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency, catName } from "@/lib/utils";

export function BudgetMiniCards() {
  const { t } = useI18n();
  const { budgets, categories, transactions } = useAppData();
  const { locale } = useI18n();

  const topBudgets = [...budgets]
    .map((budget) => {
      const spent = transactions
        .filter((tx) => tx.type === "expense" && tx.categoryId === budget.categoryId)
        .reduce((s, tx) => s + tx.amount, 0);
      const ratio = spent / budget.amount;
      return { budget, spent, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("home.budgets")}
        </h2>
      </div>
      <div className="space-y-3">
        {topBudgets.map(({ budget, spent, ratio }, index) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const iconKey = category?.icon ?? "other_expense";
          const Icon = CATEGORY_ICONS[iconKey];
          const color = CATEGORY_COLORS[iconKey] ?? "#525252";
          const widthPct = Math.min(ratio * 100, 100);
          const isOver = spent > budget.amount;

          return (
            <Card key={budget.id} className="space-y-2 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  {Icon ? <Icon size={16} /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {catName(category, locale) || "—"}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold tabular-nums ${
                    isOver
                      ? "text-[var(--color-expense)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {Math.round(ratio * 100)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: isOver ? "var(--color-expense)" : color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 * index }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
