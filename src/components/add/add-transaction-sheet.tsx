"use client";
import { useEffect, useMemo, useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { createTransaction, updateTransaction } from "@/server/actions/transactions";
import { cn, catName } from "@/lib/utils";
import { suggestCategoryIcon } from "@/lib/note-keywords";
import type { Transaction, TransactionType } from "@/types";

interface Props { open: boolean; onClose: () => void; editing?: Transaction | null; }
const SEGS = [
  { value: "expense", labelKey: "add.expense" },
  { value: "income", labelKey: "add.income" },
  { value: "transfer", labelKey: "add.transfer" },
];

export function AddTransactionSheet({ open, onClose, editing }: Props) {
  const { t, locale } = useI18n();
  const { categories: allCats, wallets, reload } = useAppData();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState("");
  const [toWalletId, setToWalletId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [manualCat, setManualCat] = useState(false);

  // ponytail: when opening in edit mode, hydrate state from the transaction once
  useEffect(() => {
    if (!open || !editing) return;
    setType(editing.type);
    setAmount(String(editing.amount));
    setCategoryId(editing.categoryId);
    setWalletId(editing.walletId);
    setToWalletId(editing.toWalletId ?? "");
    setNote(editing.note);
    setManualCat(true);
  }, [open, editing]);

  const cats = useMemo(() => allCats.filter((c) => c.type === type), [allCats, type]);

  useEffect(() => { if (wallets.length > 0 && !walletId) setWalletId(wallets[0]!.id); }, [wallets, walletId]);
  useEffect(() => { if (wallets.length > 1 && !toWalletId) setToWalletId(wallets[1]!.id); }, [wallets, toWalletId]);
  // ponytail: derived — suggestion overrides default unless user manually picked
  const suggestedFromNote = !manualCat ? cats.find((c) => c.icon === suggestCategoryIcon(note))?.id : undefined;
  const effectiveCategoryId = suggestedFromNote ?? categoryId;
  // ponytail: default first category when nothing else applies
  useEffect(() => { if (cats.length > 0 && !effectiveCategoryId) setCategoryId(cats[0]!.id); }, [cats, effectiveCategoryId]);

  async function handleSave() {
    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0 || !walletId) return;
    if (type === "transfer" && (!toWalletId || toWalletId === walletId)) return;
    setSaving(true);
    try {
      const common = {
        type, amount: parsed,
        categoryId: type === "transfer" ? undefined : Number(effectiveCategoryId),
        walletId: Number(walletId),
        toWalletId: type === "transfer" ? Number(toWalletId) : undefined,
        note: note.trim() || t("add." + type),
      };
      if (editing) {
        await updateTransaction(Number(editing.id), { ...common, date: new Date(editing.date) });
      } else {
        await createTransaction({ ...common, date: new Date().toISOString() });
      }
      await reload();
      setAmount(""); setNote(""); setCategoryId(""); setManualCat(false);
      onClose();
    } catch (e) { console.error("Save error:", e); }
    finally { setSaving(false); }
  }

  const title = editing ? t("transactions.edit") : t("add.title");

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="space-y-5 p-6 pb-8">
        <SegmentedControl segments={SEGS.map((s) => ({ value: s.value, label: t(s.labelKey) }))} value={type}
          onChange={(v) => { setType(v as TransactionType); setCategoryId(""); setManualCat(false); }} />

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
                  <button key={c.id} type="button" onClick={() => { setManualCat(true); setCategoryId(c.id); }}
                    className={cn("flex flex-col items-center gap-1 rounded-xl border p-2.5",
                      effectiveCategoryId === c.id ? "border-[var(--color-primary)] bg-[var(--color-surface-hover)]" : "border-[var(--color-border)]")}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: color + "1a", color }}>
                      {Icon && <Icon size={16} />}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">{catName(c, locale)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{type === "transfer" ? t("add.fromWallet") : t("add.wallet")}</p>
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

        {type === "transfer" && (
          <div>
            <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("add.toWallet")}</p>
            <div className="flex flex-wrap gap-2">
              {wallets.filter((w) => w.id !== walletId).map((w) => {
                const Icon = CATEGORY_ICONS[w.icon];
                return (
                  <button key={w.id} type="button" onClick={() => setToWalletId(w.id)}
                    className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm",
                      toWalletId === w.id ? "border-[var(--color-primary)] bg-[var(--color-surface-hover)]" : "border-[var(--color-border)]")}>
                    {Icon && <Icon size={14} />} {w.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("add.note")}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none placeholder:text-[var(--color-text-muted)]" />
        <button type="button" onClick={handleSave} disabled={saving}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? t("add.saving") : t("add.save")}
        </button>
      </div>
    </BottomSheet>
  );
}
