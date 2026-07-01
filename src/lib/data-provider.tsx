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
        wallets: wallets.map((w: Record<string, unknown>) => ({
          id: String(w.id), name: w.name as string, type: w.type as Wallet["type"],
          icon: w.icon as string, color: w.color as string,
          openingBalance: w.openingBalance as number, sortOrder: w.sortOrder as number,
        })),
        categories: categories.map((c: Record<string, unknown>) => ({
          id: String(c.id), name: c.name as string, nameEn: c.nameEn as string,
          type: c.type as Category["type"], icon: c.icon as string,
          color: c.color as string, sortOrder: c.sortOrder as number,
        })),
        transactions: transactions.map((t: Record<string, unknown>) => ({
          id: String(t.id), type: t.type as Transaction["type"], amount: t.amount as number,
          categoryId: t.categoryId ? String(t.categoryId) : "",
          walletId: t.walletId ? String(t.walletId) : "",
          date: (t.date as Date).toISOString(), note: (t.note as string) || "",
          tags: [],
        })),
        budgets: budgets.map((b: Record<string, unknown>) => ({
          id: String(b.id), categoryId: String(b.categoryId), amount: b.amount as number,
          period: "monthly" as const, active: b.active as boolean,
        })),
        goals: goals.map((g: Record<string, unknown>) => ({
          id: String(g.id), name: g.name as string, targetAmount: g.targetAmount as number,
          currentAmount: g.currentAmount as number, icon: g.icon as string,
          color: g.color as string,
        })),
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
