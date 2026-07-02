"use server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { isExpired } from "@/lib/budget-utils";

export async function generateLinkCode(): Promise<string> {
  const userId = await requireUserId();
  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  const ts = Date.now();
  await db.update(users).set({ lineId: `pending:${code}:${ts}` }).where(eq(users.id, userId));
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
  const row = rows[0] ?? null;
  if (row?.lineId?.startsWith("pending:") && isExpired(row.lineId)) {
    await db.update(users).set({ lineId: null }).where(eq(users.id, userId));
    return { lineId: null, notifyFreq: row.notifyFreq };
  }
  return row;
}
