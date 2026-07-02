"use client";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Transaction, Wallet, Category, Budget, SavingsGoal } from "@/types";
import type { Database } from "@/server/db";

interface AppData {
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  loading: boolean;
  reload: () => Promise<void>;
}

const DataContext = createContext<AppData>({
  wallets: [], categories: [], transactions: [], budgets: [], goals: [],
  loading: true, reload: async () => {},
});

type DbWallet = { id: number; name: string; type: string; icon: string; color: string; openingBalance: number; sortOrder: number };
type DbCategory = { id: number; name: string; nameEn: string; type: string; icon: string; color: string; sortOrder: number };
type DbTransaction = { id: number; type: string; amount: number; categoryId: number | null; walletId: number | null; date: Date; note: string | null };
type DbBudget = { id: number; categoryId: number; amount: number; active: boolean };
type DbGoal = { id: number; name: string; targetAmount: number; currentAmount: number; icon: string; color: string };

function mapWallet(w: DbWallet): Wallet {
  return { id: String(w.id), name: w.name, type: w.type as Wallet["type"], icon: w.icon, color: w.color, openingBalance: w.openingBalance, sortOrder: w.sortOrder };
}
function mapCategory(c: DbCategory): Category {
  return { id: String(c.id), name: c.name, nameEn: c.nameEn, type: c.type as Category["type"], icon: c.icon, color: c.color, sortOrder: c.sortOrder };
}
function mapTransaction(t: DbTransaction): Transaction {
  return { id: String(t.id), type: t.type as Transaction["type"], amount: t.amount,
    categoryId: t.categoryId != null ? String(t.categoryId) : "",
    walletId: t.walletId != null ? String(t.walletId) : "",
    date: t.date instanceof Date ? t.date.toISOString() : String(t.date),
    note: t.note ?? "", tags: [] };
}
function mapBudget(b: DbBudget): Budget {
  return { id: String(b.id), categoryId: String(b.categoryId), amount: b.amount, period: "monthly" as const, active: b.active };
}
function mapGoal(g: DbGoal): SavingsGoal {
  return { id: String(g.id), name: g.name, targetAmount: g.targetAmount, currentAmount: g.currentAmount, icon: g.icon, color: g.color };
}

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

      // Auto-seed if empty
      if (wallets.length === 0) {
        const { seedDefaultData } = await import("@/server/actions/seed");
        const { requireUserId } = await import("@/server/session");
        try {
          const userId = await requireUserId();
          await seedDefaultData(userId);
          const [w2, c2] = await Promise.all([getWallets(), getCategories()]);
          setData({
            wallets: (w2 as DbWallet[]).map(mapWallet),
            categories: (c2 as DbCategory[]).map(mapCategory),
            transactions: [], budgets: [], goals: [], loading: false,
          });
          return;
        } catch { /* not logged in */ }
      }

      setData({
        wallets: (wallets as DbWallet[]).map(mapWallet),
        categories: (categories as DbCategory[]).map(mapCategory),
        transactions: (transactions as DbTransaction[]).map(mapTransaction),
        budgets: (budgets as DbBudget[]).map(mapBudget),
        goals: (goals as DbGoal[]).map(mapGoal),
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
