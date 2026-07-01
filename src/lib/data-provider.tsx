"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { Transaction, Wallet, Category, Budget, SavingsGoal } from "@/types";

interface AppData {
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  loading: boolean;
  reload: () => void;
}

const DataContext = createContext<AppData>({
  wallets: [], categories: [], transactions: [], budgets: [], goals: [], loading: true, reload: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<AppData, "reload">>({
    wallets: [], categories: [], transactions: [], budgets: [], goals: [], loading: true,
  });

  const load = useCallback(async () => {
    try {
      const [{ getWallets }, { getCategories }, { getTransactions }, { getBudgets }, { getGoals }] =
        await Promise.all([
          import("@/server/actions/wallets"),
          import("@/server/actions/categories"),
          import("@/server/actions/transactions"),
          import("@/server/actions/budgets"),
          import("@/server/actions/goals"),
        ]);
      const [wallets, categories, transactions, budgets, goals] = await Promise.all([
        getWallets(), getCategories(), getTransactions(), getBudgets(), getGoals(),
      ]);
      setData({
        wallets: (wallets as Record<string, unknown>[]).map((w) => ({
          id: String(w.id), name: w.name as string, type: w.type as Wallet["type"],
          icon: w.icon as string, color: w.color as string,
          openingBalance: w.openingBalance as number, sortOrder: w.sortOrder as number,
        })) as Wallet[],
        categories: (categories as Record<string, unknown>[]).map((c) => ({
          id: String(c.id), name: c.name as string, nameEn: c.nameEn as string,
          type: c.type as Category["type"], icon: c.icon as string,
          color: c.color as string, sortOrder: c.sortOrder as number,
        })) as Category[],
        transactions: (transactions as Record<string, unknown>[]).map((t) => ({
          id: String(t.id), type: t.type as Transaction["type"], amount: t.amount as number,
          categoryId: t.categoryId != null ? String(t.categoryId) : "",
          walletId: t.walletId != null ? String(t.walletId) : "",
          date: t.date instanceof Date ? t.date.toISOString() : String(t.date),
          note: (t.note as string) || "", tags: [],
        })) as Transaction[],
        budgets: (budgets as Record<string, unknown>[]).map((b) => ({
          id: String(b.id), categoryId: String(b.categoryId), amount: b.amount as number,
          period: "monthly" as const, active: b.active as boolean,
        })) as Budget[],
        goals: (goals as Record<string, unknown>[]).map((g) => ({
          id: String(g.id), name: g.name as string, targetAmount: g.targetAmount as number,
          currentAmount: g.currentAmount as number, icon: g.icon as string, color: g.color as string,
        })) as SavingsGoal[],
        loading: false,
      });
    } catch {
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return <DataContext.Provider value={{ ...data, reload: load }}>{children}</DataContext.Provider>;
}

export function useAppData() {
  return useContext(DataContext);
}
