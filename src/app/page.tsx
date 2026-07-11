"use client";

import dynamic from "next/dynamic";
import { PageTransition } from "@/components/layout/page-transition";
import { BalanceCard } from "@/components/home/balance-card";
import { InsightsCard } from "@/components/home/insights-card";
import { BudgetMiniCards } from "@/components/home/budget-mini-cards";
import { RecentTransactions } from "@/components/home/recent-transactions";
import { Logo } from "@/components/svg/logo";

// ponytail: defer recharts (2MB) — splits chart chunk out of initial paint
const SpendingTrendChart = dynamic(
  () => import("@/components/home/spending-trend-chart").then((m) => m.SpendingTrendChart),
  { loading: () => <div className="h-28 animate-pulse rounded-xl bg-[var(--color-surface)]" />, ssr: false },
);
const CategoryBreakdownChart = dynamic(
  () => import("@/components/home/category-breakdown-chart").then((m) => m.CategoryBreakdownChart),
  { loading: () => <div className="h-32 animate-pulse rounded-xl bg-[var(--color-surface)]" />, ssr: false },
);

export default function HomePage() {
  return (
    <PageTransition>
      <div className="space-y-4 p-4 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <h1 className="text-lg font-bold tracking-tight">จดตัง</h1>
        </div>
        <BalanceCard />
        <InsightsCard />
        <SpendingTrendChart />
        <CategoryBreakdownChart />
        <BudgetMiniCards />
        <RecentTransactions />
      </div>
    </PageTransition>
  );
}
