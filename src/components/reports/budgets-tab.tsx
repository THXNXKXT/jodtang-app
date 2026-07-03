"use client";
import { useState } from "react";
import { useI18n } from "@/i18n/config";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/svg/icons";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency, catName } from "@/lib/utils";
import { getMonthSpent, getMonthLabel } from "@/lib/budget-utils";
import { BudgetSheet } from "./budget-sheet";
import type { Budget } from "@/types";

export function BudgetsTab() {
  const { t, locale } = useI18n();
  const { budgets, categories, transactions } = useAppData();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  function prevMonth() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear()); setViewMonth(d.getMonth());
  }
  function nextMonth() {
    if (isCurrentMonth) return;
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear()); setViewMonth(d.getMonth());
  }

  function openAdd() { setEditing(null); setSheetOpen(true); }
  function openEdit(b: Budget) { setEditing(b); setSheetOpen(true); }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <button onClick={prevMonth} className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <ChevronLeftIcon size={18} />
        </button>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{getMonthLabel(viewYear, viewMonth)}</p>
        <button onClick={nextMonth} disabled={isCurrentMonth} className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30">
          <ChevronRightIcon size={18} />
        </button>
      </div>
      <button onClick={openAdd} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
        <PlusIcon size={18} /> {t("reports.budgets")}
      </button>
      {budgets.map((budget, index) => {
        const category = categories.find((c) => c.id === budget.categoryId);
        const iconKey = category?.icon ?? "other_expense";
        const Icon = CATEGORY_ICONS[iconKey];
        const color = CATEGORY_COLORS[iconKey] ?? "#525252";
        const spent = getMonthSpent(transactions, budget.categoryId, viewYear, viewMonth);
        const ratio = budget.amount > 0 ? spent / budget.amount : 0;
        const isOver = spent > budget.amount;
        const widthPct = Math.min(ratio * 100, 100);
        return (
          <Card key={budget.id} className="space-y-3 cursor-pointer" onClick={() => openEdit(budget)}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${color}1a`, color }}>
                {Icon ? <Icon size={18} /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{catName(category, locale) || "—"}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{formatCurrency(spent)} / {formatCurrency(budget.amount)}</p>
              </div>
              <span className={`shrink-0 text-sm font-bold tabular-nums ${isOver ? "text-[var(--color-expense)]" : "text-[var(--color-text-primary)]"}`}>{Math.round(ratio * 100)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: isOver ? "var(--color-expense)" : color }}
                initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 * index }} />
            </div>
            <p className={`text-xs font-medium ${isOver ? "text-[var(--color-expense)]" : "text-[var(--color-text-secondary)]"}`}>
              {isOver ? `${t("reports.budgetOver")} ${formatCurrency(spent - budget.amount)}` : `${t("reports.budgetLeft")} ${formatCurrency(budget.amount - spent)}`}
            </p>
          </Card>
        );
      })}
      <BudgetSheet open={sheetOpen} onClose={() => setSheetOpen(false)} editing={editing} />
    </div>
  );
}