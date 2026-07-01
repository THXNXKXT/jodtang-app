"use client";
import { PageTransition } from "@/components/layout/page-transition";
import { BalanceCard } from "@/components/home/balance-card";
import { SpendingTrendChart } from "@/components/home/spending-trend-chart";
import { CategoryBreakdownChart } from "@/components/home/category-breakdown-chart";
import { BudgetMiniCards } from "@/components/home/budget-mini-cards";
import { RecentTransactions } from "@/components/home/recent-transactions";
import { Logo } from "@/components/svg/logo";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="space-y-4 p-4 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <h1 className="text-lg font-bold tracking-tight">จดตัง</h1>
        </div>
        <BalanceCard />
        <SpendingTrendChart />
        <CategoryBreakdownChart />
        <BudgetMiniCards />
        <RecentTransactions />
      </div>
    </PageTransition>
  );
}
