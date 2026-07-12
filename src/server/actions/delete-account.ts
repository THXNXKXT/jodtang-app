"use server";
import { db } from "@/server/db";
import { users, accounts } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import bcrypt from "bcryptjs";

// ponytail: verify password against accounts table (better-auth stores bcrypt hash there)
// then cascade-delete user — all related rows (wallets, txns, categories, sessions) cascade.
export async function deleteAccount(password: string): Promise<{ success: boolean; error?: string }> {
  const userId = await requireUserId();
  if (!password) return { success: false, error: "กรุณาใส่รหัสผ่าน" };

  const [acc] = await db
    .select({ password: accounts.password })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.providerId, "credential")));

  if (!acc?.password) return { success: false, error: "ไม่พบรหัสผ่าน" };

  const ok = await bcrypt.compare(password, acc.password);
  if (!ok) return { success: false, error: "รหัสผ่านไม่ถูกต้อง" };

  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}
