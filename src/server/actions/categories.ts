"use server";
import { db } from "@/server/db";
import { categories } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createCategorySchema,
  updateCategorySchema,
  type ActionResult,
} from "@/server/validations/schemas";

export async function createCategory(
  input: z.infer<typeof createCategorySchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = createCategorySchema.parse(input);
    const [cat] = await db.insert(categories).values({ ...data, userId }).returning();
    revalidatePath("/");
    return { success: true, data: cat };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed" };
  }
}

export async function updateCategory(
  id: number,
  input: z.infer<typeof updateCategorySchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = updateCategorySchema.parse(input);
    const [updated] = await db
      .update(categories)
      .set(data)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    if (!updated) return { success: false, error: "Not found" };
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed" };
  }
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const [deleted] = await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    if (!deleted) return { success: false, error: "Not found" };
    revalidatePath("/");
    return { success: true, data: deleted };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed" };
  }
}
