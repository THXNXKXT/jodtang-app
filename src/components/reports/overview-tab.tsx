"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { CategoryBreakdownChart } from "@/components/home/category-breakdown-chart";
import { useI18n } from "@/i18n/config";
import { getMonthExpense, getMonthIncome } from "@/lib/mock-data";
import { formatCurrency, formatCurrencyShort } from "@/lib/utils";

export function OverviewTab() {
  const { t } = useI18n();
  const income = getMonthIncome();
  const expense = getMonthExpense();

  const data = useMemo(
    () => [
      { name: t("home.income"), value: income, color: "var(--color-income)" },
      { name: t("home.expense"), value: expense, color: "var(--color-expense)" },
    ],
    [income, expense, t],
  );

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
          {t("reports.monthlyComparison")}
        </h2>
        <div className="-mx-2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => formatCurrencyShort(v)}
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-hover)" }}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--color-text-primary)",
                }}
                formatter={(value) => [formatCurrency(Number(value)), ""]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <CategoryBreakdownChart />
    </div>
  );
}
