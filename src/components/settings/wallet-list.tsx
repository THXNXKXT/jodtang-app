"use client";
import { motion } from "framer-motion";
import { PencilIcon, PowerIcon, PowerOffIcon } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/i18n/config";
import { updateWallet } from "@/server/actions/wallets";
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

  async function toggleDisabled(id: number, current: boolean) {
    await updateWallet(id, { disabled: !current });
    await reload();
  }

  return (
    <div className="space-y-2">
      {wallets.map((wallet) => {
        const Icon = CATEGORY_ICONS[wallet.icon];
        const balance = getWalletBalance(wallet.id, wallet.openingBalance);
        const id = Number(wallet.id);
        const isDisabled = wallet.disabled;

        return (
          <div key={wallet.id} className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]">
            {/* ponytail: swipe reveals edit + disable toggle behind */}
            <button
              type="button"
              onClick={() => handleRename(id, wallet.name)}
              className="absolute inset-y-0 right-20 flex w-20 items-center justify-center bg-[var(--color-primary)] text-white"
              aria-label="edit"
            >
              <PencilIcon size={18} />
            </button>
            <button
              type="button"
              onClick={() => toggleDisabled(id, isDisabled)}
              className="absolute inset-y-0 right-0 flex w-20 items-center justify-center text-white"
              style={{ backgroundColor: isDisabled ? "#22c55e" : "#71717a" }}
              aria-label={isDisabled ? "enable" : "disable"}
            >
              {isDisabled ? <PowerIcon size={18} /> : <PowerOffIcon size={18} />}
            </button>
            <motion.div
              drag="x"
              dragConstraints={{ left: -160, right: 0 }}
              dragElastic={0.1}
              className={`relative flex items-center gap-3 bg-[var(--color-surface)] px-4 py-3.5 ${isDisabled ? "opacity-50" : ""}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${wallet.color}1a`, color: wallet.color }}>
                {Icon ? <Icon size={18} /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {wallet.name}
                  {isDisabled && <span className="ml-2 text-xs text-[var(--color-text-muted)]">· จัดเก็บแล้ว</span>}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">{typeLabels[wallet.type]}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
                {formatCurrency(balance)}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
