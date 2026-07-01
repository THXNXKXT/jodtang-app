"use server";
import { db } from "@/server/db";
import { wallets } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

export async function getWallets() {
  const userId = await requireUserId();
  return db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(wallets.sortOrder);
}

export async function createWallet(data: {
  name: string; type: "cash" | "bank" | "ewallet" | "savings";
  icon: string; color: string; openingBalance: number;
}) {
  const userId = await requireUserId();
  await db.insert(wallets).values({ ...data, userId });
  revalidatePath("/");
}

export async function updateWallet(id: number, data: Partial<{
  name: string; type: "cash" | "bank" | "ewallet" | "savings"; icon: string; color: string; openingBalance: number; sortOrder: number;
}>) {
  const userId = await requireUserId();
  await db.update(wallets).set(data).where(eq(wallets.id, id));
  revalidatePath("/");
}

export async function deleteWallet(id: number) {
  const userId = await requireUserId();
  await db.delete(wallets).where(eq(wallets.id, id));
  revalidatePath("/");
}
