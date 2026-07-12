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

  // ponytail: two static groups, no tabs/dropdown — read top-to-bottom
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
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">{title}</p>
      <div className="space-y-1">
        {items.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon];
          const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
          const id = Number(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onRename(id, catName(cat, locale))}
              className="flex w-full items-center gap-3 rounded-xl bg-[var(--color-surface)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-hover)]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color + "1a", color }}>
                {Icon ? <Icon size={14} /> : null}
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-primary)]">
                {catName(cat, locale)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
