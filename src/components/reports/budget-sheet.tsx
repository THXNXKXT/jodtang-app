"use client";
import { useState, useEffect } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { useI18n } from "@/i18n/config";
import { cn, formatCurrency } from "@/lib/utils";
import { createBudget, updateBudget, deleteBudget } from "@/server/actions/budgets";
import { PlusIcon, Trash2Icon } from "@/components/svg/icons";
import type { Budget } from "@/types";

export function BudgetSheet({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: Budget | null }) {
  const { t } = useI18n();
  const { categories, reload } = useAppData();
  const expenseCats = categories.filter((c) => c.type === "expense");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (editing) { setCategoryId(editing.categoryId); setAmount(String(editing.amount)); }
    else { setCategoryId(""); setAmount(""); }
  }, [editing, open]);

  async function handleSave() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    if (!editing && !categoryId) return;
    if (editing) {
      await updateBudget(Number(editing.id), { amount: amt });
    } else {
      await createBudget({ categoryId: Number(categoryId), amount: amt });
    }
    await reload();
    onClose();
  }

  async function handleDelete() {
    if (!editing) return;
    await deleteBudget(Number(editing.id));
    await reload();
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={editing ? t("reports.budgets") : t("reports.budgets")}>
      <div className="space-y-5 p-6 pb-8">
        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("add.category")}</p>
          <div className="grid grid-cols-4 gap-2">
            {expenseCats.map((c) => {
              const Icon = CATEGORY_ICONS[c.icon];
              const color = CATEGORY_COLORS[c.icon] ?? "#525252";
              return (
                <button key={c.id} type="button" disabled={!!editing} onClick={() => setCategoryId(c.id)}
                  className={cn("flex flex-col items-center gap-1 rounded-xl border p-2.5 disabled:opacity-50",
                    categoryId === c.id ? "border-[var(--color-primary)] bg-[var(--color-surface-hover)]" : "border-[var(--color-border)]")}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: color + "1a", color }}>
                    {Icon && <Icon size={16} />}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("reports.budgetLeft")}</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl text-[var(--color-text-secondary)]">฿</span>
            <input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-44 bg-transparent text-center text-4xl font-bold outline-none placeholder:text-[var(--color-text-muted)]" />
          </div>
        </div>
        <button type="button" onClick={handleSave} disabled={!amount || (!editing && !categoryId)}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
          {t("add.save")}
        </button>
        {editing && (
          <button type="button" onClick={handleDelete}
            className="flex w-full items-center justify-center gap-2 py-2 text-sm text-[var(--color-expense)]">
            <Trash2Icon size={16} /> {t("reports.budgets")} - {formatCurrency(0)}
          </button>
        )}
      </div>
    </BottomSheet>
  );
}