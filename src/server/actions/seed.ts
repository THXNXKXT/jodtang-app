"use server";
import { db } from "@/server/db";
import { wallets, categories } from "@/server/db/schema";

import { defaultWallets, defaultCategories } from "@/server/seed-data";

export async function seedDefaultData(userId: string) {
  await db.insert(wallets).values(defaultWallets.map((w) => ({ ...w, userId })));
  await db.insert(categories).values(defaultCategories.map((c) => ({ ...c, userId })));
}
