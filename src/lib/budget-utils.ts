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

export const CODE_EXPIRY_MS = 5 * 60 * 1000;

export function isExpired(pendingValue: string): boolean {
  const ts = Number(pendingValue.split(":")[2] ?? 0);
  return Date.now() - ts > CODE_EXPIRY_MS;
}

export function getCodeExpiryMs(pendingValue: string): number | null {
  const ts = Number(pendingValue.split(":")[2] ?? 0);
  if (!ts) return null;
  return ts + CODE_EXPIRY_MS;
}
