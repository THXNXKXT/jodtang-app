"use server";
import { db } from "@/server/db";
import { savingsGoals, savingsContributions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

const defaultGoals = [
  { name: "เงินฉุกเฉิน", targetAmount: 50000, icon: "savings", color: "#10b981" },
  { name: "ทะเลปีหน้า", targetAmount: 20000, icon: "travel", color: "#3b82f6" },
];

export async function getGoals() {
  const userId = await requireUserId();
  let result = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));

  // Auto-seed if empty
  if (result.length === 0) {
    await db.insert(savingsGoals).values(defaultGoals.map((g) => ({ ...g, userId })));
    result = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));
  }

  return result;
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
