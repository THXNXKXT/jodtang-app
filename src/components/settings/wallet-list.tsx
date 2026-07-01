"use client";

import { Card } from "@/components/ui/card";
import { CATEGORY_ICONS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { formatCurrency } from "@/lib/utils";
import type { WalletType } from "@/types";

const TYPE_LABELS: Record<WalletType, string> = {
  cash: "เงินสด",
  bank: "ธนาคาร",
  ewallet: "e-Wallet",
  savings: "เงินออม",
};

export function WalletList() {
  const { wallets } = useAppData();
  return (
    <div className="space-y-2">
      {wallets.map((wallet) => {
        const Icon = CATEGORY_ICONS[wallet.icon];
        return (
          <Card key={wallet.id} className="flex items-center gap-3 py-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${wallet.color}1a`, color: wallet.color }}
            >
              {Icon ? <Icon size={18} /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {wallet.name}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {TYPE_LABELS[wallet.type]}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
              {formatCurrency(wallet.openingBalance)}
            </span>
          </Card>
        );
      })}
    </div>
  );
}
