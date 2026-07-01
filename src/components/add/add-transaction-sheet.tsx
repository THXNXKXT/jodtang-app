"use client";
import { useEffect, useMemo, useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { createTransaction } from "@/server/actions/transactions";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

interface Props { open: boolean; onClose: () => void; }
const SEGS = [
  { value: "expense", labelKey: "add.expense" },
  { value: "income", labelKey: "add.income" },
  { value: "transfer", labelKey: "add.transfer" },
];

export function AddTransactionSheet({ open, onClose }: Props) {
  const { t } = useI18n();
  const { categories: allCats, wallets, reload } = useAppData();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const cats = useMemo(() => allCats.filter((c) => c.type === type), [allCats, type]);

  useEffect(() => { if (wallets.length > 0 && !walletId) setWalletId(wallets[0]!.id); }, [wallets, walletId]);
  useEffect(() => { if (cats.length > 0 && !categoryId) setCategoryId(cats[0]!.id); }, [cats, categoryId]);

  async function handleSave() {
    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0 || !walletId) return;
    setSaving(true);
    try {
      await createTransaction({
        type, amount: parsed,
        categoryId: type === "transfer" ? undefined : Number(categoryId),
        walletId: Number(walletId),
        note: note.trim() || t("add." + type),
        date: new Date().toISOString(),
      });
      await reload();
      setAmount(""); setNote(""); setCategoryId("");
      onClose();
    } catch {}
    finally { setSaving(false); }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={t("add.title")}>
      <div className="space-y-5 p-6 pb-8">
        <SegmentedControl segments={SEGS.map((s) => ({ value: s.value, label: t(s.labelKey) }))} value={type}
          onChange={(v) => { setType(v as TransactionType); setCategoryId(""); }} />
        <div className="text-center py-2">
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl text-[var(--color-text-secondary)]">฿</span>
            <input type="number" inputMode="decimal" placeholder="0" value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-44 bg-transparent text-center text-4xl font-bold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]" />
          </div>
        </div>
        {type !== "transfer" && (
          <div>
            <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("add.category")}</p>
            <div className="grid grid-cols-4 gap-2">
              {cats.map((c) => {
                const Icon = CATEGORY_ICONS[c.icon];
                const color = CATEGORY_COLORS[c.icon] ?? "#525252";
                return (
                  <button key={c.id} type="button" onClick={() => setCategoryId(c.id)}
                    className={cn("flex flex-col items-center gap-1 rounded-xl border p-2.5",
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
        )}
        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("add.wallet")}</p>
          <div className="flex flex-wrap gap-2">
            {wallets.map((w) => {
              const Icon = CATEGORY_ICONS[w.icon];
              return (
                <button key={w.id} type="button" onClick={() => setWalletId(w.id)}
                  className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm",
                    walletId === w.id ? "border-[var(--color-primary)] bg-[var(--color-surface-hover)]" : "border-[var(--color-border)]")}>
                  {Icon && <Icon size={14} />} {w.name}
                </button>
              );
            })}
          </div>
        </div>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("add.note")}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none placeholder:text-[var(--color-text-muted)]" />
        <button type="button" onClick={handleSave} disabled={saving}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "กำลังบันทึก..." : t("add.save")}
        </button>
      </div>
    </BottomSheet>
  );
}
