"use client";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Transaction, Wallet, Category, Budget, SavingsGoal } from "@/types";


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

// ponytail: raw DB types match schema column types
type DbWallet = { id: number; name: string; type: string; icon: string; color: string; openingBalance: number; sortOrder: number };
type DbCategory = { id: number; name: string; nameEn: string; type: string; icon: string; color: string; sortOrder: number };
type DbTransaction = { id: number; type: string; amount: number; categoryId: number | null; walletId: number | null; toWalletId: number | null; date: Date; note: string | null };
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
    note: t.note ?? "", tags: [], toWalletId: t.toWalletId != null ? String(t.toWalletId) : undefined };
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
      const { getAppData } = await import("@/server/actions/app-data");
      const raw = await getAppData();
      setData({
        wallets: (raw.wallets as DbWallet[]).map(mapWallet),
        categories: (raw.categories as DbCategory[]).map(mapCategory),
        transactions: (raw.transactions as DbTransaction[]).map(mapTransaction),
        budgets: (raw.budgets as DbBudget[]).map(mapBudget),
        goals: (raw.goals as DbGoal[]).map(mapGoal),
        loading: false,
      });
    } catch {
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  useEffect(() => { if (!isAuthRoute) load(); }, [load, isAuthRoute]);

  useEffect(() => { if (pathname === "/") load(); }, [pathname, load]);
  return <DataContext.Provider value={{ ...data, reload: load }}>{children}</DataContext.Provider>;
}

export function useAppData() {
  return useContext(DataContext);
}

