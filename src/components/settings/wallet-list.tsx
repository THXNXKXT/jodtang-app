"use client";
import { Card } from "@/components/ui/card";
import { CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/i18n/config";
import type { WalletType } from "@/types";

export function WalletList() {
  const { t } = useI18n();
  const { wallets, transactions } = useAppData();

  const typeLabels: Record<WalletType, string> = {
    cash: t("settings.walletType.cash"),
    bank: t("settings.walletType.bank"),
    ewallet: t("settings.walletType.ewallet"),
    savings: t("settings.walletType.savings"),
  };

  function getWalletBalance(walletId: string, opening: number) {
    const walletTxns = transactions.filter((t) => t.walletId === walletId);
    const income = walletTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = walletTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return opening + income - expense;
  }

  return (
    <div className="space-y-2">
      {wallets.map((wallet) => {
        const Icon = CATEGORY_ICONS[wallet.icon];
        const balance = getWalletBalance(wallet.id, wallet.openingBalance);
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
          </Card>
        );
      })}
    </div>
  );
}
