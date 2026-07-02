"use server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";

const CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 min

export async function generateLinkCode(): Promise<string> {
  const userId = await requireUserId();
  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  const ts = Date.now();
  // ponytail: encode expiry in the value — no extra column needed
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
  // Expire stale pending codes on read
  if (row?.lineId?.startsWith("pending:") && isExpired(row.lineId)) {
    await db.update(users).set({ lineId: null }).where(eq(users.id, userId));
    return { lineId: null, notifyFreq: row.notifyFreq };
  }
  return row;
}

export function isExpired(pendingValue: string): boolean {
  const parts = pendingValue.split(":");
  const ts = Number(parts[2] ?? 0);
  return Date.now() - ts > CODE_EXPIRY_MS;
}
