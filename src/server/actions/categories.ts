"use server";
import { db } from "@/server/db";
import { categories } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const userId = await requireUserId();
  return db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.sortOrder);
}

export async function createCategory(data: {
  name: string; nameEn: string; type: "income" | "expense";
  icon: string; color: string;
}) {
  const userId = await requireUserId();
  await db.insert(categories).values({ ...data, userId });
  revalidatePath("/");
}

export async function updateCategory(id: number, data: Partial<{
  name: string; nameEn: string; icon: string; color: string;
}>) {
  await db.update(categories).set(data).where(eq(categories.id, id));
  revalidatePath("/");
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/");
}
