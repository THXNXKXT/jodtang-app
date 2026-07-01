"use client";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";

export function CategoryList() {
  const { categories } = useAppData();
  const expense = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">รายจ่าย</p>
        <div className="space-y-1">
          {expense.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
            return (
              <div key={cat.id} className="flex items-center gap-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
                  {Icon ? <Icon size={14} style={{ color }} /> : null}
                </div>
                <span className="text-sm">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">รายรับ</p>
        <div className="space-y-1">
          {income.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
            return (
              <div key={cat.id} className="flex items-center gap-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
                  {Icon ? <Icon size={14} style={{ color }} /> : null}
                </div>
                <span className="text-sm">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
