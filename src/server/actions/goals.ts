"use server";
import { db } from "@/server/db";
import { savingsGoals, savingsContributions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

export async function getGoals() {
  const userId = await requireUserId();
  return db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));
}

export async function createGoal(data: {
  name: string; targetAmount: number; icon: string; color: string; deadline?: string;
}) {
  const userId = await requireUserId();
  await db.insert(savingsGoals).values({
    ...data, userId,
    deadline: data.deadline ? new Date(data.deadline) : null,
  });
  revalidatePath("/");
}

export async function contributeToGoal(goalId: number, amount: number) {
  const userId = await requireUserId();
  await db.insert(savingsContributions).values({ goalId, userId, amount });
  const [goal] = await db.select().from(savingsGoals).where(eq(savingsGoals.id, goalId));
  if (goal) {
    await db.update(savingsGoals)
      .set({ currentAmount: goal.currentAmount + amount })
      .where(eq(savingsGoals.id, goalId));
  }
  revalidatePath("/");
}

export async function deleteGoal(id: number) {
  await db.delete(savingsGoals).where(eq(savingsGoals.id, id));
  revalidatePath("/");
}
