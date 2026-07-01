"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { formatCurrencyShort } from "@/lib/utils";
import type { Transaction } from "@/types";

interface DayDatum {
  label: string;
  amount: number;
}

function buildLast7DaysData(transactions: Transaction[]): DayDatum[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets = new Map<string, number>();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    const key = new Date(tx.date).toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + tx.amount);
    }
  }

  const data: DayDatum[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    data.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      amount: buckets.get(key) ?? 0,
    });
  }
  return data;
}

export function SpendingTrendChart() {
  const { t } = useI18n();
  const { transactions } = useAppData();
  const data = useMemo(() => buildLast7DaysData(transactions), [transactions]);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
        {t("home.spendingTrend")}
      </h2>
      <div className="-mx-2 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-expense)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--color-expense)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--color-text-primary)",
              }}
              labelStyle={{ color: "var(--color-text-secondary)" }}
              formatter={(value) => [formatCurrencyShort(Number(value)), "รายจ่าย"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-expense)"
              strokeWidth={2}
              fill="url(#spendingGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-expense)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
