"use client";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { useI18n } from "@/i18n/config";
import { updateCategory } from "@/server/actions/categories";
import { catName } from "@/lib/utils";

export function CategoryList() {
  const { t, locale } = useI18n();
  const { categories, reload } = useAppData();

  async function handleRename(id: number, currentName: string) {
    const name = prompt(t("settings.categoryName") || "ชื่อหมวดหมู่", currentName);
    if (name && name.trim() && name !== currentName) {
      await updateCategory(id, { name: name.trim() });
      await reload();
    }
  }

  // ponytail: no archive — seed sync uses nameEn key, archive would get undone on next sync
  return (
    <div className="space-y-1">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.icon];
        const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
        const id = Number(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleRename(id, catName(cat, locale))}
            className="flex w-full items-center gap-3 rounded-xl bg-[var(--color-surface)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-hover)]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: color + "1a", color }}>
              {Icon ? <Icon size={14} /> : null}
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-primary)]">
              {catName(cat, locale)}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
              {cat.type === "income" ? "รายรับ" : "รายจ่าย"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
