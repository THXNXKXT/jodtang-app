"use server";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { requireUserId } from "@/server/session";

export async function getProfile() {
  try {
    const userId = await requireUserId();
    const [user] = await db.select({ name: users.name, email: users.email, image: users.image }).from(users).where(eq(users.id, userId));
    return user ?? { name: "User", email: "", image: null };
  } catch {
    return { name: "User", email: "", image: null };
  }
}
