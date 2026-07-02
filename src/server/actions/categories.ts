"use server";
import { z } from "zod";
import { db } from "@/server/db";
import { categories } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";
import {
  createCategorySchema,
  updateCategorySchema,
  type ActionResult,
} from "@/server/validations/schemas";

export async function getCategories() {
  const userId = await requireUserId();
  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.sortOrder);
}

export async function createCategory(
  input: z.infer<typeof createCategorySchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = createCategorySchema.parse(input);
    const [category] = await db
      .insert(categories)
      .values({ ...data, userId })
      .returning();
    revalidatePath("/");
    return { success: true, data: category };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
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
    if (!updated) {
      return { success: false, error: "Category not found" };
    }
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const [deleted] = await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    if (!deleted) {
      return { success: false, error: "Category not found" };
    }
    revalidatePath("/");
    return { success: true, data: deleted };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
