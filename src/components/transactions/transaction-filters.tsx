"use client";

import { SearchIcon } from "@/components/svg/icons";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { catName } from "@/lib/utils";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  walletId: string;
  onWalletChange: (value: string) => void;
}

const selectClass =
  "appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none";

export function TransactionFilters({
  search, onSearchChange, type, onTypeChange,
  categoryId, onCategoryChange, walletId, onWalletChange,
}: TransactionFiltersProps) {
  const { t, locale } = useI18n();
  const { categories, wallets } = useAppData();

  // ponytail: only categories matching active type — feels right
  const visibleCats = type === "all" ? categories : categories.filter((c) => c.type === type);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
        <SearchIcon size={16} className="shrink-0 text-[var(--color-text-muted)]" />
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
        onChange={(v) => { onTypeChange(v); onCategoryChange(""); }}
      />
      {/* ponytail: native selects — shortest diff, no custom dropdown needed */}
      <div className="grid grid-cols-2 gap-2">
        <select value={categoryId} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
          <option value="">{t("add.category")}: {t("transactions.all")}</option>
          {visibleCats.map((c) => (
            <option key={c.id} value={c.id}>{catName(c, locale)}</option>
          ))}
        </select>
        <select value={walletId} onChange={(e) => onWalletChange(e.target.value)} className={selectClass}>
          <option value="">{t("add.wallet")}: {t("transactions.all")}</option>
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
