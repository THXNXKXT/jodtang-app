"use server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";

export async function generateLinkCode(): Promise<string> {
  const userId = await requireUserId();
  const code = Math.random().toString().slice(2, 8);
  await db.update(users).set({ lineId: `pending:${code}` }).where(eq(users.id, userId));
  return code;
}

export async function updateNotifyFreq(freq: "daily" | "monthly" | "off") {
  const userId = await requireUserId();
  await db.update(users).set({ notifyFreq: freq }).where(eq(users.id, userId));
}

export async function getLineSettings() {
  const userId = await requireUserId();
  const rows = await db
    .select({ lineId: users.lineId, notifyFreq: users.notifyFreq })
    .from(users)
    .where(eq(users.id, userId));
  return rows[0] ?? null;
}
