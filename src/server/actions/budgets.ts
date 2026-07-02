"use server";
import { db } from "@/server/db";
import { budgets, categories } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

const defaultBudgetAmounts: Record<string, number> = {
  food: 8000, transport: 3000, shopping: 5000,
  entertainment: 2000, utilities: 2500, health: 2000,
};

export async function getBudgets() {
  const userId = await requireUserId();
  let result = await db.select().from(budgets).where(eq(budgets.userId, userId));

  // Auto-seed if user has categories but no budgets
  if (result.length === 0) {
    const cats = await db.select().from(categories).where(eq(categories.userId, userId));
    const budgetValues = cats
      .filter((c) => c.type === "expense" && defaultBudgetAmounts[c.icon])
      .map((c) => ({ userId, categoryId: c.id, amount: defaultBudgetAmounts[c.icon]! }));
    if (budgetValues.length > 0) {
      await db.insert(budgets).values(budgetValues);
      result = await db.select().from(budgets).where(eq(budgets.userId, userId));
    }
  }

  return result;
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
