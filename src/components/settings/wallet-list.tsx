"use client";
import { Card } from "@/components/ui/card";
import { CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/i18n/config";
import { updateWallet, deleteWallet } from "@/server/actions/wallets";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { WalletType } from "@/types";

export function WalletList() {
  const { t } = useI18n();
  const { wallets, transactions, reload } = useAppData();

  const typeLabels: Record<WalletType, string> = {
    cash: t("settings.walletType.cash"),
    bank: t("settings.walletType.bank"),
    ewallet: t("settings.walletType.ewallet"),
    savings: t("settings.walletType.savings"),
  };

  function getWalletBalance(walletId: string, opening: number) {
    let balance = opening;
    for (const tx of transactions) {
      if (tx.walletId === walletId) {
        if (tx.type === "income") balance += tx.amount;
        else if (tx.type === "expense") balance -= tx.amount;
        else if (tx.type === "transfer") balance -= tx.amount;
      }
      if (tx.toWalletId === walletId && tx.type === "transfer") balance += tx.amount;
    }
    return balance;
  }

  async function handleRename(id: number, currentName: string) {
    const name = prompt(t("settings.walletName"), currentName);
    if (name && name.trim() && name !== currentName) {
      await updateWallet(id, { name: name.trim() });
      await reload();
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`${t("settings.deleteWalletConfirm")}: ${name}`)) return;
    await deleteWallet(id);
    await reload();
  }

  return (
    <div className="space-y-2">
      {wallets.map((wallet) => {
        const Icon = CATEGORY_ICONS[wallet.icon];
        const balance = getWalletBalance(wallet.id, wallet.openingBalance);
        const id = Number(wallet.id);
        return (
          <Card key={wallet.id} className="flex items-center gap-3 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${wallet.color}1a`, color: wallet.color }}>
              {Icon ? <Icon size={18} /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{wallet.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{typeLabels[wallet.type]}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
              {formatCurrency(balance)}
            </span>
            <button onClick={() => handleRename(id, wallet.name)} aria-label="edit"
              className="shrink-0 rounded-full p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              <PencilIcon size={14} />
            </button>
            <button onClick={() => handleDelete(id, wallet.name)} aria-label="delete"
              className="shrink-0 rounded-full p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-expense)]">
              <TrashIcon size={14} />
            </button>
          </Card>
        );
      })}
    </div>
  );
}
