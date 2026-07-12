"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { DownloadIcon } from "lucide-react";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { catName } from "@/lib/utils";
import { transactionsToCsv, downloadCsv } from "@/lib/csv";

export default function TransactionsPage() {
  const { t, locale } = useI18n();
  const { transactions, categories, wallets } = useAppData();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (categoryId && tx.categoryId !== categoryId) return false;
      if (walletId && tx.walletId !== walletId && tx.toWalletId !== walletId) return false;
      if (q && !tx.note.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, type, categoryId, walletId, transactions]);

  function handleExport() {
    // ponytail: enrich with names for human-readable CSV
    const enriched = filtered.map((tx) => ({
      ...tx,
      categoryName: catName(categories.find((c) => c.id === tx.categoryId), locale),
      walletName: wallets.find((w) => w.id === tx.walletId)?.name ?? "",
      toWalletName: wallets.find((w) => w.id === tx.toWalletId)?.name ?? "",
    }));
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`jodtang-${date}.csv`, transactionsToCsv(enriched));
  }

  return (
    <PageTransition>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
            {t("transactions.title")}
          </h1>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] disabled:opacity-40"
          >
            <DownloadIcon size={14} /> CSV
          </button>
        </div>
        <TransactionFilters
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          walletId={walletId}
          onWalletChange={setWalletId}
        />
        <TransactionList transactions={filtered} />
      </div>
    </PageTransition>
  );
}
