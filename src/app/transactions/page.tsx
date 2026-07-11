"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";

export default function TransactionsPage() {
  const { t } = useI18n();
  const { transactions } = useAppData();
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

  return (
    <PageTransition>
      <div className="space-y-4 p-4">
        <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
          {t("transactions.title")}
        </h1>
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
