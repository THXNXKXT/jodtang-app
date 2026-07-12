"use server";
import { db } from "@/server/db";
import { wallets, categories, transactions, budgets, savingsGoals, users } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { sendDailySummaryToUser } from "@/server/actions/line-summary";

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
    db.select({ name: users.name, email: users.email, image: users.image, notifyFreq: users.notifyFreq, lastDailySummaryAt: users.lastDailySummaryAt, id: users.id }).from(users).where(eq(users.id, userId)),
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

  // ponytail: app-open trigger — if user opted daily + hasn't received today's summary + it's past 23:00 ICT yesterday, send now.
  // Replaces unreliable Vercel Hobby + GitHub Actions scheduled crons.
  const userRow = u[0];
  const profile = userRow ? { name: userRow.name, email: userRow.email, image: userRow.image } : { name: "User", email: "", image: null };
  try {
    if (userRow && userRow.notifyFreq === "daily") {
      const ICT = 7 * 60 * 60 * 1000;
      const ict = new Date(Date.now() + ICT);
      const y = ict.getUTCFullYear(), m = ict.getUTCMonth(), d = ict.getUTCDate();
      const cutoff = new Date(Date.UTC(y, m, d - 1, 16, 0, 0) - ICT); // 23:00 ICT yesterday
      const now = Date.now();
      const lastSent = userRow.lastDailySummaryAt ? new Date(userRow.lastDailySummaryAt).getTime() : 0;
      if (now >= cutoff.getTime() && lastSent < cutoff.getTime()) {
        // fire-and-forget — don't block app load waiting on LINE API
        sendDailySummaryToUser(userRow.id).then((ok) => {
          if (ok) db.update(users).set({ lastDailySummaryAt: new Date() }).where(eq(users.id, userRow.id)).catch(() => {});
        }).catch(() => {});
      }
    }
  } catch { /* ponytail: summary is best-effort, never break app load */ }

  return { wallets: w, categories: finalCats, transactions: t, budgets: b, goals: g, profile };
}
