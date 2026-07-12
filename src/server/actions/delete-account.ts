"use server";
import { db } from "@/server/db";
import { users, accounts } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { verifyPassword } from "better-auth/crypto";

// ponytail: better-auth uses scrypt (not bcrypt) — use its own verify to match hash format.
// Cascade-delete user — all related rows (wallets, txns, categories, sessions) cascade.
export async function deleteAccount(password: string): Promise<{ success: boolean; error?: string }> {
  const userId = await requireUserId();
  if (!password) return { success: false, error: "กรุณาใส่รหัสผ่าน" };

  const [acc] = await db
    .select({ password: accounts.password })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.providerId, "credential")));

  if (!acc?.password) return { success: false, error: "ไม่พบรหัสผ่าน" };

  const ok = await verifyPassword({ hash: acc.password, password });
  if (!ok) return { success: false, error: "รหัสผ่านไม่ถูกต้อง" };

  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}
