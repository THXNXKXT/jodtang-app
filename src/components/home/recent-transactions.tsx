"use client";

import { motion } from "framer-motion";
import { TransactionItem } from "@/components/ui/transaction-item";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import Link from "next/link";

export function RecentTransactions() {
  const { t } = useI18n();
  const { transactions } = useAppData();
  const recent = transactions.slice(0, 5);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("home.recentTransactions")}
        </h2>
        <Link
          href="/transactions"
          className="text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          {t("home.seeAll")}
        </Link>
      </div>
      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">{t("home.emptyRecent")}</p>
          </div>
        ) : (
          recent.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 * i }}
            >
              <TransactionItem transaction={tx} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
