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

export async function getCategories() {
  const userId = await requireUserId();
  const existing = await db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.sortOrder);
  const { defaultCategories } = await import("@/server/seed-data");

  // ponytail: sync defaults by nameEn (stable key, survives Thai name edits)
  // 1. insert missing categories
  // 2. update icon+color for existing defaults whose icon drifted from seed
  const defaultsByKey = new Map(defaultCategories.map(c => [`${c.type}:${c.nameEn}`, c]));
  const existingKeys = new Set(existing.map(c => `${c.type}:${c.nameEn}`));

  let changed = false;

  // insert missing
  const missing = defaultCategories.filter(c => !existingKeys.has(`${c.type}:${c.nameEn}`));
  if (missing.length > 0) {
    await db.insert(categories).values(missing.map(c => ({ ...c, userId })));
    changed = true;
  }

  // update drifted icon/color on existing defaults
  for (const cat of existing) {
    const def = defaultsByKey.get(`${cat.type}:${cat.nameEn}`);
    if (def && (cat.icon !== def.icon || cat.color !== def.color)) {
      await db.update(categories)
        .set({ icon: def.icon, color: def.color })
        .where(and(eq(categories.id, cat.id), eq(categories.userId, userId)));
      changed = true;
    }
  }

  if (changed) {
    return db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.sortOrder);
  }
  return existing;
}

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
      .where(eq(categories.id, id))
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
      .where(eq(categories.id, id))
      .returning();
    if (!deleted) return { success: false, error: "Not found" };
    revalidatePath("/");
    return { success: true, data: deleted };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed" };
  }
}
