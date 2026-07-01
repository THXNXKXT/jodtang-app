"use server";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  const userId = await requireUserId();
  return db.select().from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date));
}

export async function getTransactionsByMonth(year: number, month: number) {
  const userId = await requireUserId();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  return db.select().from(transactions)
    .where(and(eq(transactions.userId, userId), gte(transactions.date, start), lte(transactions.date, end)))
    .orderBy(desc(transactions.date));
}

export async function createTransaction(data: {
  type: "income" | "expense" | "transfer";
  amount: number;
  categoryId?: number;
  walletId: number;
  toWalletId?: number;
  note: string;
  date: string;
}) {
  const userId = await requireUserId();
  await db.insert(transactions).values({ ...data, userId, date: new Date(data.date) });
  revalidatePath("/");
}

export async function updateTransaction(id: number, data: Partial<{
  type: "income" | "expense" | "transfer";
  amount: number;
  categoryId: number;
  walletId: number;
  note: string;
  date: Date;
}>) {
  await db.update(transactions).set(data).where(eq(transactions.id, id));
  revalidatePath("/");
}

export async function deleteTransaction(id: number) {
  await db.delete(transactions).where(eq(transactions.id, id));
  revalidatePath("/");
}
