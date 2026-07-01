"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { useI18n } from "@/i18n/config";
import {
  getCategorySpending,
  getMonthExpense,
  mockCategories,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

interface SliceDatum {
  name: string;
  value: number;
  color: string;
  pct: number;
}

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export function CategoryBreakdownChart() {
  const { t } = useI18n();

  const data = useMemo<SliceDatum[]>(() => {
    const total = getMonthExpense();
    const slices = mockCategories
      .filter((c) => c.type === "expense")
      .map((c) => ({
        name: c.name,
        value: getCategorySpending(c.id),
        color: CATEGORY_COLORS[c.icon] ?? "#525252",
      }))
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((s) => ({
        ...s,
        pct: total > 0 ? (s.value / total) * 100 : 0,
      }));
    return slices;
  }, []);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
        {t("home.categoryBreakdown")}
      </h2>
      <div className="flex items-center gap-4">
        <div className="h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--color-text-primary)",
                }}
                formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="min-w-0 flex-1 space-y-1.5">
          {data.map((slice) => {
            const Icon = CATEGORY_ICONS[
              mockCategories.find((c) => c.name === slice.name)?.icon ?? "other_expense"
            ];
            return (
              <li key={slice.name} className="flex items-center gap-2 text-sm">
                {Icon ? (
                  <Icon size={14} style={{ color: slice.color }} className="shrink-0" />
                ) : null}
                <span className={`min-w-0 flex-1 ${ellipsis} text-[var(--color-text-secondary)]`}>
                  {slice.name}
                </span>
                <span className="shrink-0 font-medium tabular-nums text-[var(--color-text-primary)]">
                  {slice.pct.toFixed(0)}%
                </span>
              </li>
            );
          })}
          {data.length === 0 ? (
            <li className="text-sm text-[var(--color-text-muted)]">—</li>
          ) : null}
        </ul>
      </div>
    </Card>
  );
}
