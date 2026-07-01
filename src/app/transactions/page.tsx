"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { useI18n } from "@/i18n/config";
import { mockTransactions } from "@/lib/mock-data";

export default function TransactionsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockTransactions.filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (q && !tx.note.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, type]);

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
        />
        <TransactionList transactions={filtered} />
      </div>
    </PageTransition>
  );
}
