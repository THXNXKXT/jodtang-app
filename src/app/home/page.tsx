"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/layout/page-transition";
import { BalanceCard } from "@/components/home/balance-card";
import { InsightsCard } from "@/components/home/insights-card";
import { StreakBadge } from "@/components/home/streak-badge";
import { BudgetMiniCards } from "@/components/home/budget-mini-cards";
import { RecentTransactions } from "@/components/home/recent-transactions";
import { Logo } from "@/components/svg/logo";
import { useAppData } from "@/lib/data-provider";

// ponytail: defer recharts (2MB) — splits chart chunk out of initial paint
const SpendingTrendChart = dynamic(
  () => import("@/components/home/spending-trend-chart").then((m) => m.SpendingTrendChart),
  { loading: () => <div className="h-28 animate-pulse rounded-xl bg-[var(--color-surface)]" />, ssr: false },
);
const CategoryBreakdownChart = dynamic(
  () => import("@/components/home/category-breakdown-chart").then((m) => m.CategoryBreakdownChart),
  { loading: () => <div className="h-32 animate-pulse rounded-xl bg-[var(--color-surface)]" />, ssr: false },
);

const PTR_THRESHOLD = 70;

export default function HomePage() {
  const { reload } = useAppData();
  const [pulling, setPulling] = useState(0); // 0..1 progress
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const active = useRef(false);

  // ponytail: vanilla touch PTR — no lib, only fires when scrollTop=0
  useEffect(() => {
    function onStart(e: TouchEvent) {
      if (window.scrollY > 0) return;
      startY.current = e.touches[0]!.clientY;
      active.current = true;
    }
    function onMove(e: TouchEvent) {
      if (!active.current) return;
      const dy = e.touches[0]!.clientY - startY.current;
      if (dy <= 0) { setPulling(0); return; }
      setPulling(Math.min(dy / PTR_THRESHOLD, 1));
    }
    async function onEnd() {
      if (!active.current) return;
      active.current = false;
      if (pulling >= 1) {
        setRefreshing(true);
        navigator.vibrate?.(15);
        await reload();
        setRefreshing(false);
      }
      setPulling(0);
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [pulling, reload]);

  return (
    <PageTransition>
      {/* ponytail: pull-to-refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-150"
        style={{ height: refreshing || pulling > 0 ? (refreshing ? 32 : pulling * 32) : 0 }}
      >
        <div
          className={`size-5 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] ${refreshing ? "animate-spin" : ""}`}
          style={{ opacity: pulling || refreshing ? 1 : 0 }}
        />
      </div>
      <div className="space-y-4 p-4 pt-2">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <h1 className="text-lg font-bold tracking-tight">จดตัง</h1>
          <div className="ml-auto"><StreakBadge /></div>
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
