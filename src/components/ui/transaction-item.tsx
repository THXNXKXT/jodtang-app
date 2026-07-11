"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/i18n/config";
import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon, PencilIcon } from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, formatRelativeDate, catName } from "@/lib/utils";
import { useAppData } from "@/lib/data-provider";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { deleteTransaction } from "@/server/actions/transactions";
import type { Transaction } from "@/types";

// ponytail: lazy — keep form/chunk out of every tx-item render
const AddTransactionSheet = dynamic(() => import("@/components/add/add-transaction-sheet").then((m) => m.AddTransactionSheet), { ssr: false });

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { categories, wallets, reload } = useAppData();
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const category = categories.find((c) => c.id === transaction.categoryId);
  const wallet = wallets.find((w) => w.id === transaction.walletId);
  const toWallet = wallets.find((w) => w.id === transaction.toWalletId);
  const Icon = category ? CATEGORY_ICONS[category.icon] : CATEGORY_ICONS.other_expense;
  const color = category ? (CATEGORY_COLORS[category.icon] ?? "#525252") : "#525252";
  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";

  const d = new Date(transaction.date);
  const dateStr = d.toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = d.toLocaleTimeString(locale === "th" ? "th-TH" : "en-GB", { hour: "2-digit", minute: "2-digit" });

  async function handleDelete() {
    setDeleting(true);
    await deleteTransaction(Number(transaction.id));
    await reload();
    navigator.vibrate?.(20);
    setOpen(false);
    setConfirmDelete(false);
  }

  return (
    <>
      {/* ponytail: swipe-left reveal — edit (deeper) + delete (edge).
          Parent bg covers buttons so layout anims don't flash them. */}
      <div className="relative overflow-hidden bg-[var(--color-surface)]">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="absolute inset-y-0 right-20 flex w-20 items-center justify-center bg-[var(--color-primary)] text-white"
          aria-label="edit"
        >
          <PencilIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-[var(--color-expense)] text-white"
          aria-label="delete"
        >
          <TrashIcon size={18} />
        </button>
        <motion.div
          drag="x"
          dragConstraints={{ left: -160, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            // ponytail: deep swipe → delete, mid swipe → edit
            if (info.offset.x < -120) setConfirmDelete(true);
            else if (info.offset.x < -60) setEditOpen(true);
          }}
          onClick={() => setOpen(true)}
          className="relative flex cursor-pointer items-center gap-3.5 bg-[var(--color-surface)] px-4 py-4 transition-colors hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-hover)]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${color}1a` }}>
            {Icon ? <Icon size={20} style={{ color }} /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
              {transaction.note || catName(category, locale)}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {wallet?.name} - {formatRelativeDate(transaction.date)}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold tabular-nums" style={{ color: isIncome ? "var(--color-income)" : "var(--color-text-primary)" }}>
            {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
          </span>
        </motion.div>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        {/* Receipt-style slip */}
        <div className="flex flex-col items-center pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: `${color}1a` }}>
            {Icon ? <Icon size={28} style={{ color }} /> : null}
          </div>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{catName(category, locale)}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums" style={{ color: isIncome ? "var(--color-income)" : "var(--color-expense)" }}>
            {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Dotted separator */}
        <div className="border-t-2 border-dashed border-[var(--color-border)]" />

        {/* Detail rows */}
        <div className="space-y-3 py-4 text-sm">
          {isTransfer ? (
            <Row label={t("add.fromWallet")} value={wallet?.name ?? "-"} />
          ) : (
            <Row label={t("add.wallet")} value={wallet?.name ?? "-"} />
          )}
          {isTransfer && toWallet && <Row label={t("add.toWallet")} value={toWallet.name} />}
          <Row label={t("transactions.date")} value={dateStr} />
          <Row label={t("transactions.time")} value={timeStr} />
          {transaction.note ? <Row label={t("add.note")} value={transaction.note} /> : null}
        </div>

        <div className="border-t-2 border-dashed border-[var(--color-border)]" />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => { setOpen(false); setEditOpen(true); }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-text-primary)]"
          >
            <PencilIcon size={16} /> {t("transactions.edit")}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-expense)] py-3 text-sm font-medium text-[var(--color-expense)] disabled:opacity-50"
          >
            {deleting ? "..." : t("transactions.delete")}
          </button>
        </div>
      </BottomSheet>

      <AddTransactionSheet open={editOpen} onClose={() => setEditOpen(false)} editing={transaction} />

      {/* Confirm delete modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            key="confirm-backdrop"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              key="confirm-card"
              className="w-full max-w-[300px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-center text-base font-semibold text-[var(--color-text-primary)]">
                {locale === "th" ? "ลบรายการนี้?" : "Delete this transaction?"}
              </p>
              <p className="mt-1 text-center text-xs text-[var(--color-text-secondary)]">
                {locale === "th" ? "ไม่สามารถยกเลิกได้" : "This cannot be undone"}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-text-secondary)]"
                >
                  {t("settings.cancel")}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-[var(--color-expense)] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {deleting ? "..." : (locale === "th" ? "ลบ" : "Delete")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-right font-medium text-[var(--color-text-primary)]">{value}</span>
    </div>
  );
}

