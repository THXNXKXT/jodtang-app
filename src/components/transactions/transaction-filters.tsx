"use client";

import { Search } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useI18n } from "@/i18n/config";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
}

export function TransactionFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
}: TransactionFiltersProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
        <Search size={16} className="shrink-0 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("transactions.search")}
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      <SegmentedControl
        segments={[
          { value: "all", label: t("transactions.all") },
          { value: "expense", label: t("add.expense") },
          { value: "income", label: t("add.income") },
        ]}
        value={type}
        onChange={onTypeChange}
      />
    </div>
  );
}
