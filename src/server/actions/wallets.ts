"use server";
import { z } from "zod";
import { db } from "@/server/db";
import { wallets, categories } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";
import {
  createWalletSchema,
  updateWalletSchema,
  type ActionResult,
} from "@/server/validations/schemas";

import { defaultWallets, defaultCategories } from "@/server/seed-data";

export async function getWallets() {
  const userId = await requireUserId();
  let result = await db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(wallets.sortOrder);

  if (result.length === 0) {
    await db.insert(wallets).values(defaultWallets.map((w) => ({ ...w, userId })));
    await db.insert(categories).values(defaultCategories.map((c) => ({ ...c, userId })));
    result = await db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(wallets.sortOrder);
  }

  return result;
}

export async function createWallet(input: z.infer<typeof createWalletSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = createWalletSchema.parse(input);
    await db.insert(wallets).values({ ...data, userId });
    revalidatePath("/");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create wallet" };
  }
}

export async function updateWallet(id: number, input: z.infer<typeof updateWalletSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = updateWalletSchema.parse(input);
    const result = await db.update(wallets).set(data).where(and(eq(wallets.id, id), eq(wallets.userId, userId)));
    if (result.rowCount === 0) return { success: false, error: "Wallet not found" };
    revalidatePath("/");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update wallet" };
  }
}

export async function deleteWallet(id: number): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const result = await db.delete(wallets).where(and(eq(wallets.id, id), eq(wallets.userId, userId)));
    if (result.rowCount === 0) return { success: false, error: "Wallet not found" };
    revalidatePath("/");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete wallet" };
  }
}
