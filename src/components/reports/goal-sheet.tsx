"use client";
import { useState, useEffect } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { useI18n } from "@/i18n/config";
import { cn, formatCurrency } from "@/lib/utils";
import { createGoal, deleteGoal, contributeToGoal } from "@/server/actions/goals";
import { Trash2Icon } from "@/components/svg/icons";
import type { SavingsGoal } from "@/types";

const ICON_OPTIONS = ["savings", "shopping", "travel", "bank", "health", "education"];

export function GoalSheet({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: SavingsGoal | null }) {
  const { t } = useI18n();
  const { reload } = useAppData();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [icon, setIcon] = useState("savings");
  const [contributing, setContributing] = useState(false);
  const [contribAmount, setContribAmount] = useState("");

  useEffect(() => {
    if (editing) { setName(editing.name); setTarget(String(editing.targetAmount)); setIcon(editing.icon); }
    else { setName(""); setTarget(""); setIcon("savings"); }
    setContributing(false); setContribAmount("");
  }, [editing, open]);

  async function handleSave() {
    const amt = parseFloat(target);
    if (!name || !amt || amt <= 0) return;
    if (editing) {
      // ponytail: no updateGoal action exists, skip edit for now
      return;
    }
    await createGoal({ name, targetAmount: amt, icon, color: CATEGORY_COLORS[icon] ?? "#3b82f6" });
    await reload();
    onClose();
  }

  async function handleContribute() {
    if (!editing) return;
    const amt = parseFloat(contribAmount);
    if (!amt || amt <= 0) return;
    await contributeToGoal({ goalId: Number(editing.id), amount: amt });
    await reload();
    setContribAmount("");
    onClose();
  }

  async function handleDelete() {
    if (!editing) return;
    await deleteGoal(Number(editing.id));
    await reload();
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={editing ? editing.name : t("reports.goals")}>
      <div className="space-y-5 p-6 pb-8">
        {editing && contributing ? (
          <>
            <div className="flex items-center justify-center gap-1 py-2">
              <span className="text-2xl text-[var(--color-text-secondary)]">฿</span>
              <input type="number" inputMode="decimal" placeholder="0" value={contribAmount} onChange={(e) => setContribAmount(e.target.value)} autoFocus
                className="w-44 bg-transparent text-center text-4xl font-bold outline-none placeholder:text-[var(--color-text-muted)]" />
            </div>
            <button type="button" onClick={handleContribute} disabled={!contribAmount}
              className="w-full rounded-xl bg-[var(--color-income)] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
              {t("reports.contribute")}
            </button>
          </>
        ) : (
          <>
            <div>
              <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("reports.goals")}</p>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!!editing} placeholder={t("reports.goals")}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none disabled:opacity-50" />
            </div>
            <div>
              <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("reports.target")}</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl text-[var(--color-text-secondary)]">฿</span>
                <input type="number" inputMode="decimal" placeholder="0" value={target} onChange={(e) => setTarget(e.target.value)} disabled={!!editing}
                  className="w-44 bg-transparent text-center text-4xl font-bold outline-none placeholder:text-[var(--color-text-muted)] disabled:opacity-50" />
              </div>
            </div>
            {!editing && (
              <div>
                <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("add.category")}</p>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((key) => {
                    const Icon = CATEGORY_ICONS[key] ?? CATEGORY_ICONS.savings;
                    const color = CATEGORY_COLORS[key] ?? "#3b82f6";
                    return (
                      <button key={key} type="button" onClick={() => setIcon(key)}
                        className={cn("flex items-center justify-center rounded-xl border p-2.5",
                          icon === key ? "border-[var(--color-primary)] bg-[var(--color-surface-hover)]" : "border-[var(--color-border)]")}>
                        {Icon ? <Icon size={18} style={{ color }} /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {editing ? (
              <>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setContributing(true)}
                    className="flex-1 rounded-xl bg-[var(--color-income)] py-3 text-sm font-semibold text-white">
                    {t("reports.contribute")}
                  </button>
                  <button type="button" onClick={handleDelete}
                    className="flex items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-[var(--color-expense)]">
                    <Trash2Icon size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button type="button" onClick={handleSave} disabled={!name || !target}
                className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
                {t("add.save")}
              </button>
            )}
          </>
        )}
      </div>
    </BottomSheet>
  );
}