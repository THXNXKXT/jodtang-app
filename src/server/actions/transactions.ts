"use server";
import { z } from "zod";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";
import {
  createTransactionSchema,
  updateTransactionSchema,
  type ActionResult,
} from "@/server/validations/schemas";

export async function getTransactions() {
  const userId = await requireUserId();
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date));
}

export async function getTransactionsByMonth(year: number, month: number) {
  const userId = await requireUserId();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  return db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, start),
        lte(transactions.date, end),
      ),
    )
    .orderBy(desc(transactions.date));
}

export async function createTransaction(
  input: z.infer<typeof createTransactionSchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const { date, ...rest } = createTransactionSchema.parse(input);
    const [transaction] = await db
      .insert(transactions)
      .values({ ...rest, userId, date: new Date(date) })
      .returning();
    revalidatePath("/");
    return { success: true, data: transaction };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create transaction",
    };
  }
}

export async function updateTransaction(
  id: number,
  input: z.infer<typeof updateTransactionSchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = updateTransactionSchema.parse(input);
    const [updated] = await db
      .update(transactions)
      .set(data)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    if (!updated) {
      return { success: false, error: "Transaction not found" };
    }
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update transaction",
    };
  }
}

export async function deleteTransaction(id: number): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const [deleted] = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    if (!deleted) {
      return { success: false, error: "Transaction not found" };
    }
    revalidatePath("/");
    return { success: true, data: deleted };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete transaction",
    };
  }
}
