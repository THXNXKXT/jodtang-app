"use server";
import { z } from "zod";
import { db } from "@/server/db";
import { budgets } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";
import {
  createBudgetSchema,
  updateBudgetSchema,
  type ActionResult,
} from "@/server/validations/schemas";

export async function getBudgets() {
  const userId = await requireUserId();
  return db.select().from(budgets).where(eq(budgets.userId, userId));
}

export async function createBudget(
  input: z.infer<typeof createBudgetSchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = createBudgetSchema.parse(input);
    const [budget] = await db
      .insert(budgets)
      .values({ ...data, userId })
      .returning();
    revalidatePath("/");
    return { success: true, data: budget };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create budget",
    };
  }
}

export async function updateBudget(
  id: number,
  input: z.infer<typeof updateBudgetSchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = updateBudgetSchema.parse(input);
    const [updated] = await db
      .update(budgets)
      .set(data)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    if (!updated) {
      return { success: false, error: "Budget not found" };
    }
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update budget",
    };
  }
}

export async function deleteBudget(id: number): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const [deleted] = await db
      .delete(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    if (!deleted) {
      return { success: false, error: "Budget not found" };
    }
    revalidatePath("/");
    return { success: true, data: deleted };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete budget",
    };
  }
}
