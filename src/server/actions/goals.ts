"use server";
import { z } from "zod";
import { db } from "@/server/db";
import { savingsGoals, savingsContributions } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";
import {
  createGoalSchema,
  contributeSchema,
  type ActionResult,
} from "@/server/validations/schemas";

export async function getGoals() {
  const userId = await requireUserId();
  return db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));
}

export async function createGoal(
  input: z.infer<typeof createGoalSchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = createGoalSchema.parse(input);
    const [goal] = await db
      .insert(savingsGoals)
      .values({
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        icon: data.icon,
        color: data.color,
        deadline: data.deadline ? new Date(data.deadline) : null,
      })
      .returning();
    revalidatePath("/");
    return { success: true, data: goal };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create goal",
    };
  }
}

export async function contributeToGoal(input: {
  goalId: number;
  amount: number;
}): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const { goalId, amount } = contributeSchema.parse(input);

    // Verify the goal belongs to the user before mutating
    const [goal] = await db
      .select()
      .from(savingsGoals)
      .where(and(eq(savingsGoals.id, goalId), eq(savingsGoals.userId, userId)));
    if (!goal) {
      return { success: false, error: "Goal not found" };
    }

    await db.insert(savingsContributions).values({ goalId, userId, amount });
    await db
      .update(savingsGoals)
      .set({ currentAmount: sql`${savingsGoals.currentAmount} + ${amount}` })
      .where(eq(savingsGoals.id, goalId));

    revalidatePath("/");
    return { success: true, data: { goalId, amount } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to contribute to goal",
    };
  }
}

export async function deleteGoal(id: number): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const [deleted] = await db
      .delete(savingsGoals)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .returning();
    if (!deleted) {
      return { success: false, error: "Goal not found" };
    }
    revalidatePath("/");
    return { success: true, data: deleted };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete goal",
    };
  }
}
