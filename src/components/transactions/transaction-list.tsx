"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { TransactionItem } from "@/components/ui/transaction-item";
import { useI18n } from "@/i18n/config";
import { formatRelativeDate } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { t } = useI18n();

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      const key = new Date(tx.date).toISOString().slice(0, 10);
      const list = map.get(key);
      if (list) { list.push(tx); } else { map.set(key, [tx]); }
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([key, items]) => ({ key, label: formatRelativeDate(key), items }));
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">{t("transactions.noResults")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((group, gIndex) => (
        <div key={group.key}>
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              {group.label}
            </p>
          </div>
          <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            {group.items.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.03 * (gIndex * 2 + i) }}
              >
                <TransactionItem transaction={tx} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
