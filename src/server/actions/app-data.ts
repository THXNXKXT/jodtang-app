"use server";
import { db } from "@/server/db";
import { wallets, categories, transactions, budgets, savingsGoals, users } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireUserId } from "@/server/session";

// ponytail: batch all initial data into one round trip — was 5 separate server actions
export async function getAppData() {
  const userId = await requireUserId();
  const { defaultCategories } = await import("@/server/seed-data");

  // Run all reads in parallel
  const [w, existingCats, t, b, g, u] = await Promise.all([
    db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(wallets.sortOrder),
    db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.sortOrder),
    db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.date)).limit(200),
    db.select().from(budgets).where(eq(budgets.userId, userId)),
    db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId)),
    db.select({ name: users.name, email: users.email, image: users.image }).from(users).where(eq(users.id, userId)),
  ]);

  // Sync categories by nameEn (insert missing + update drifted icon/color)
  const defaultsByKey = new Map(defaultCategories.map((c) => [`${c.type}:${c.nameEn}`, c]));
  const existingKeys = new Set(existingCats.map((c) => `${c.type}:${c.nameEn}`));
  let catsChanged = false;

  const missing = defaultCategories.filter((c) => !existingKeys.has(`${c.type}:${c.nameEn}`));
  if (missing.length > 0) {
    await db.insert(categories).values(missing.map((c) => ({ ...c, userId })));
    catsChanged = true;
  }

  for (const cat of existingCats) {
    const def = defaultsByKey.get(`${cat.type}:${cat.nameEn}`);
    if (def && (cat.icon !== def.icon || cat.color !== def.color)) {
      await db.update(categories)
        .set({ icon: def.icon, color: def.color })
        .where(and(eq(categories.id, cat.id), eq(categories.userId, userId)));
      catsChanged = true;
    }
  }

  const finalCats = catsChanged
    ? await db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.sortOrder)
    : existingCats;

  return { wallets: w, categories: finalCats, transactions: t, budgets: b, goals: g, profile: u[0] ?? { name: "User", email: "", image: null } };
}
