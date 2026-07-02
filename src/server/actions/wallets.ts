"use server";
import { z } from "zod";
import { db } from "@/server/db";
import { wallets } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";
import {
  createWalletSchema,
  updateWalletSchema,
  type ActionResult,
} from "@/server/validations/schemas";

export async function getWallets() {
  const userId = await requireUserId();
  return db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .orderBy(wallets.sortOrder);
}

export async function createWallet(
  input: z.infer<typeof createWalletSchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = createWalletSchema.parse(input);
    const [wallet] = await db
      .insert(wallets)
      .values({ ...data, userId })
      .returning();
    revalidatePath("/");
    return { success: true, data: wallet };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create wallet",
    };
  }
}

export async function updateWallet(
  id: number,
  input: z.infer<typeof updateWalletSchema>,
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const data = updateWalletSchema.parse(input);
    const [updated] = await db
      .update(wallets)
      .set(data)
      .where(and(eq(wallets.id, id), eq(wallets.userId, userId)))
      .returning();
    if (!updated) {
      return { success: false, error: "Wallet not found" };
    }
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update wallet",
    };
  }
}

export async function deleteWallet(id: number): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    const [deleted] = await db
      .delete(wallets)
      .where(and(eq(wallets.id, id), eq(wallets.userId, userId)))
      .returning();
    if (!deleted) {
      return { success: false, error: "Wallet not found" };
    }
    revalidatePath("/");
    return { success: true, data: deleted };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete wallet",
    };
  }
}
