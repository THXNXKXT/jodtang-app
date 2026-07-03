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

// ponytail: default names for auto-sync — keeps existing users up to date
const defaultCatNames = [
  "อาหาร", "เดินทาง", "ช้อปปิ้ง", "บันเทิง", "สาธารณูปโภค", "สุขภาพ",
  "โทรศัพท์", "การศึกษา", "ของขวัญ", "ค่าเช่า", "กาแฟ", "สัตว์เลี้ยง",
  "ซ่อมบำรุง", "อื่นๆ",
  "เงินเดือน", "ฟรีแลนซ์", "ของขวัญ", "คืนเงิน", "ลงทุน", "โบนัส", "ขายของ", "อื่นๆ",
];

export async function getCategories() {
  const userId = await requireUserId();
  const existing = await db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.sortOrder);

  // ponytail: auto-add missing default categories for existing users
  if (existing.length < 14) {
    const existingNames = new Set(existing.map(c => c.name));
    const missingNames = defaultCatNames.filter(n => !existingNames.has(n));
    if (missingNames.length > 0) {
      const { defaultCategories } = await import("@/server/actions/wallets");
      const missing = defaultCategories.filter(c => missingNames.includes(c.name));
      if (missing.length > 0) {
        await db.insert(categories).values(missing.map(c => ({ ...c, userId })));
        return db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.sortOrder);
      }
    }
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
