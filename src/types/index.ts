export type TransactionType = "income" | "expense" | "transfer";
export type WalletType = "cash" | "bank" | "ewallet" | "savings";
export type CategoryType = "income" | "expense";
export type BudgetPeriod = "monthly";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  toWalletId?: string;
  date: string;
  note: string;
  tags: string[];
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  icon: string;
  color: string;
  openingBalance: number;
  sortOrder: number;
  disabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  type: CategoryType;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  active: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
}

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  note: string;
  frequency: "daily" | "weekly" | "monthly";
  nextDate: string;
  active: boolean;
}
