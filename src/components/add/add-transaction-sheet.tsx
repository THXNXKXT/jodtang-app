"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { createTransaction } from "@/server/actions/transactions";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

interface AddTransactionSheetProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_SEGMENTS = [
  { value: "expense", labelKey: "add.expense" },
  { value: "income", labelKey: "add.income" },
  { value: "transfer", labelKey: "add.transfer" },
];

export function AddTransactionSheet({ open, onClose }: AddTransactionSheetProps) {
  const { t } = useI18n();
  const { categories: allCategories, wallets, reload } = useAppData();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = useMemo(
    () => allCategories.filter((c) => c.type === type),
    [allCategories, type],
  );

  function reset() {
    setType("expense");
    setAmount("");
    setCategoryId("");
    setWalletId(wallets[0]?.id ?? "");
    setNote("");
  }

  async function handleSave() {
    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    if (type !== "transfer" && !categoryId) return;
    if (!walletId) return;

    setSaving(true);
    try {
      await createTransaction({
        type,
        amount: parsed,
        categoryId: type === "transfer" ? undefined : Number(categoryId),
        walletId: Number(walletId),
        note: note.trim() || t(`add.${type}`),
        date: new Date().toISOString(),
      });
      reload();
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={t("add.title")}>
      <div className="space-y-5 pb-2">
        <SegmentedControl
          segments={TYPE_SEGMENTS.map((s) => ({
            value: s.value,
            label: t(s.labelKey),
          }))}
          value={type}
          onChange={(v) => setType(v as TransactionType)}
        />

        <div className="text-center">
          <p className="mb-1 text-xs text-[var(--color-text-secondary)]">
            {t("add.amount")}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-semibold text-[var(--color-text-secondary)]">
              ฿
            </span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus={false}
              className="w-44 bg-transparent text-center text-4xl font-bold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
          </div>
        </div>

        {type !== "transfer" ? (
          <div>
            <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">
              {t("add.category")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((c) => {
                const Icon = CATEGORY_ICONS[c.icon];
                const color = CATEGORY_COLORS[c.icon] ?? "#525252";
                const selected = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 transition-colors",
                      selected
                        ? "border-[var(--color-text-primary)] bg-[var(--color-surface-hover)]"
                        : "border-[var(--color-border)]",
                    )}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      {Icon ? <Icon size={16} /> : null}
                    </span>
                    <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[11px] text-[var(--color-text-secondary)]">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">
            {t("add.wallet")}
          </p>
          <div className="flex flex-wrap gap-2">
            {wallets.map((w) => {
              const Icon = CATEGORY_ICONS[w.icon];
              const selected = walletId === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWalletId(w.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-[var(--color-text-primary)] bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)]",
                  )}
                >
                  {Icon ? <Icon size={14} /> : null}
                  {w.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">
            {t("add.note")}
          </p>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("add.note")}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text-muted)]"
          />
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {t("add.save")}
          </Button>
        </motion.div>
      </div>
    </BottomSheet>
  );
}
