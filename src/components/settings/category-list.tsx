"use client";
import { useState } from "react";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { useI18n } from "@/i18n/config";
import { updateCategory } from "@/server/actions/categories";
import { catName } from "@/lib/utils";
import { RenameSheet } from "@/components/ui/rename-sheet";

export function CategoryList() {
  const { locale } = useI18n();
  const { categories, reload } = useAppData();

  async function handleRename(id: number, name: string) {
    await updateCategory(id, { name });
    await reload();
  }

  const expense = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");

  return (
    <div className="space-y-5">
      <Section title="รายจ่าย" items={expense} onRename={handleRename} locale={locale} />
      <Section title="รายรับ" items={income} onRename={handleRename} locale={locale} />
    </div>
  );
}

function Section({
  title, items, onRename, locale,
}: {
  title: string;
  items: ReturnType<typeof Array.prototype.slice>;
  onRename: (id: number, name: string) => Promise<void>;
  locale: string;
}) {
  const [rename, setRename] = useState<{ id: number; name: string } | null>(null);
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">{title}</p>
      <div className="space-y-1">
        {items.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon];
          const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
          const id = Number(cat.id);
          const displayName = catName(cat, locale);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setRename({ id, name: displayName })}
              className="flex w-full items-center gap-3 rounded-xl bg-[var(--color-surface)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-hover)]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color + "1a", color }}>
                {Icon ? <Icon size={14} /> : null}
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-primary)]">
                {displayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* ponytail: shared modal, single instance per section */}
      <RenameSheet
        key={rename ? rename.name : "closed"}
        open={rename !== null}
        currentName={rename?.name ?? ""}
        title="แก้ไขหมวดหมู่"
        onClose={() => setRename(null)}
        onSave={async (name) => { if (rename) await onRename(rename.id, name); }}
      />
    </div>
  );
}
