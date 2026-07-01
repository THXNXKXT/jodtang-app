"use server";
import { db } from "@/server/db";
import { budgets } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

export async function getBudgets() {
  const userId = await requireUserId();
  return db.select().from(budgets).where(eq(budgets.userId, userId));
}

export async function createBudget(data: { categoryId: number; amount: number }) {
  const userId = await requireUserId();
  await db.insert(budgets).values({ ...data, userId });
  revalidatePath("/");
}

export async function updateBudget(id: number, data: Partial<{ amount: number; active: boolean }>) {
  await db.update(budgets).set(data).where(eq(budgets.id, id));
  revalidatePath("/");
}

export async function deleteBudget(id: number) {
  await db.delete(budgets).where(eq(budgets.id, id));
  revalidatePath("/");
}
