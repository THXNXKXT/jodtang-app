"use client";

import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";

export function GoalsTab() {
  const { t } = useI18n();
  const { goals } = useAppData();

  return (
    <div className="space-y-3">
      {goals.map((goal) => {
        const pct = Math.min(goal.currentAmount / goal.targetAmount, 1);
        return (
          <Card key={goal.id} className="flex items-center gap-4">
            <ProgressRing
              progress={pct}
              size={72}
              strokeWidth={7}
              color={goal.color}
            >
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                {Math.round(pct * 100)}%
              </span>
            </ProgressRing>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {goal.name}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                {t("reports.saved")} {formatCurrency(goal.currentAmount)}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t("reports.target")} {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
