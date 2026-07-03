"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { PlusIcon } from "@/components/svg/icons";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";
import { GoalSheet } from "./goal-sheet";
import type { SavingsGoal } from "@/types";

export function GoalsTab() {
  const { t } = useI18n();
  const { goals } = useAppData();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsGoal | null>(null);

  function openAdd() { setEditing(null); setSheetOpen(true); }
  function openEdit(g: SavingsGoal) { setEditing(g); setSheetOpen(true); }

  return (
    <div className="space-y-3">
      <button onClick={openAdd} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
        <PlusIcon size={18} /> {t("reports.goals")}
      </button>
      {goals.map((goal) => {
        const pct = goal.targetAmount > 0 ? Math.min(goal.currentAmount / goal.targetAmount, 1) : 0;
        return (
          <Card key={goal.id} className="flex items-center gap-4 cursor-pointer" onClick={() => openEdit(goal)}>
            <ProgressRing progress={pct} size={72} strokeWidth={7} color={goal.color}>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{Math.round(pct * 100)}%</span>
            </ProgressRing>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{goal.name}</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{t("reports.saved")} {formatCurrency(goal.currentAmount)}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{t("reports.target")} {formatCurrency(goal.targetAmount)}</p>
            </div>
          </Card>
        );
      })}
      <GoalSheet open={sheetOpen} onClose={() => setSheetOpen(false)} editing={editing} />
    </div>
  );
}