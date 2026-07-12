"use client";
import { motion, useAnimation } from "framer-motion";
import { PencilIcon, ArchiveIcon, ArchiveRestoreIcon } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/i18n/config";
import { updateWallet } from "@/server/actions/wallets";
import type { Wallet, WalletType } from "@/types";

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

  return (
    <div className="space-y-2">
      {wallets.map((wallet) => (
        <WalletRow
          key={wallet.id}
          wallet={wallet}
          balance={getWalletBalance(wallet.id, wallet.openingBalance)}
          typeLabel={typeLabels[wallet.type]}
          reload={reload}
        />
      ))}
    </div>
  );
}

function WalletRow({
  wallet, balance, typeLabel, reload,
}: {
  wallet: Wallet;
  balance: number;
  typeLabel: string;
  reload: () => Promise<void>;
}) {
  const controls = useAnimation();
  const Icon = CATEGORY_ICONS[wallet.icon];
  const id = Number(wallet.id);
  const isArchived = wallet.disabled;

  async function snapBack() {
    // ponytail: spring back to rest after action — fixes "icons stuck open"
    await controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 40 } });
  }

  async function handleRename() {
    await snapBack();
    const name = prompt("ชื่อกระเป๋าเงิน", wallet.name);
    if (name && name.trim() && name !== wallet.name) {
      await updateWallet(id, { name: name.trim() });
      await reload();
    }
  }

  async function toggleArchive() {
    await snapBack();
    await updateWallet(id, { disabled: !isArchived });
    await reload();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={handleRename}
        className="absolute inset-y-0 right-20 flex w-20 flex-col items-center justify-center gap-0.5 bg-[var(--color-primary)] text-white"
        aria-label="edit"
      >
        <PencilIcon size={16} />
        <span className="text-[10px]">แก้ไข</span>
      </button>
      <button
        type="button"
        onClick={toggleArchive}
        className="absolute inset-y-0 right-0 flex w-20 flex-col items-center justify-center gap-0.5 text-white"
        style={{ backgroundColor: isArchived ? "#22c55e" : "#71717a" }}
        aria-label={isArchived ? "restore" : "archive"}
      >
        {isArchived ? <ArchiveRestoreIcon size={16} /> : <ArchiveIcon size={16} />}
        <span className="text-[10px]">{isArchived ? "เรียกคืน" : "จัดเก็บ"}</span>
      </button>
      <motion.div
        animate={controls}
        drag="x"
        dragConstraints={{ left: -160, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          // ponytail: if released mid-swipe without button tap, snap to nearest edge
          if (info.offset.x > -40) controls.start({ x: 0 });
        }}
        className={`relative flex items-center gap-3 bg-[var(--color-surface)] px-4 py-3.5 ${isArchived ? "grayscale" : ""}`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${wallet.color}1a`, color: wallet.color }}>
          {Icon ? <Icon size={18} /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {wallet.name}
            {isArchived && <span className="ml-2 text-xs text-[var(--color-text-muted)]">· จัดเก็บแล้ว</span>}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">{typeLabel}</p>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
          {formatCurrency(balance)}
        </span>
      </motion.div>
    </div>
  );
}
