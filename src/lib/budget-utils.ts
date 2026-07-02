import type { Transaction } from "@/types";

export function isCurrentMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function getMonthSpent(transactions: Transaction[], categoryId: string): number {
  return transactions
    .filter((tx) => tx.type === "expense" && tx.categoryId === categoryId && isCurrentMonth(tx.date))
    .reduce((s, tx) => s + tx.amount, 0);
}

export function getMonthLabel(): string {
  return new Date().toLocaleDateString("th-TH", { month: "long", year: "numeric" });
}
