"use client";

import { BalanceCard } from "@/components/home/balance-card";
import { BudgetMiniCards } from "@/components/home/budget-mini-cards";
import { CategoryBreakdownChart } from "@/components/home/category-breakdown-chart";
import { RecentTransactions } from "@/components/home/recent-transactions";
import { SpendingTrendChart } from "@/components/home/spending-trend-chart";
import { PageTransition } from "@/components/layout/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="space-y-4 p-4">
        <BalanceCard />
        <SpendingTrendChart />
        <CategoryBreakdownChart />
        <BudgetMiniCards />
        <RecentTransactions />
      </div>
    </PageTransition>
  );
}
