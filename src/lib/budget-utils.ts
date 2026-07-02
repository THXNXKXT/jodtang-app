import type { Transaction } from "@/types";

export function isInMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(dateStr);
  return d.getMonth() === month && d.getFullYear() === year;
}

export function getMonthSpent(transactions: Transaction[], categoryId: string, year?: number, month?: number): number {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  return transactions
    .filter((tx) => tx.type === "expense" && tx.categoryId === categoryId && isInMonth(tx.date, y, m))
    .reduce((s, tx) => s + tx.amount, 0);
}

export function getMonthLabel(year?: number, month?: number): string {
  const d = new Date();
  const y = year ?? d.getFullYear();
  const m = month ?? d.getMonth();
  return new Date(y, m).toLocaleDateString("th-TH", { month: "long", year: "numeric" });
}
