"use server";
import { db } from "@/server/db";
import { wallets, categories, budgets, savingsGoals } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

const defaultWallets = [
  { name: "กระเป๋าสตางค์", type: "cash" as const, icon: "cash", color: "#10b981", openingBalance: 0, sortOrder: 0 },
  { name: "บัญชีธนาคาร", type: "bank" as const, icon: "bank", color: "#3b82f6", openingBalance: 0, sortOrder: 1 },
  { name: "e-Wallet", type: "ewallet" as const, icon: "ewallet", color: "#f97316", openingBalance: 0, sortOrder: 2 },
  { name: "เงินออม", type: "savings" as const, icon: "savings", color: "#a855f7", openingBalance: 0, sortOrder: 3 },
];

const defaultCategories = [
  { name: "อาหาร", nameEn: "Food", type: "expense" as const, icon: "food", color: "#f97316", sortOrder: 0 },
  { name: "เดินทาง", nameEn: "Transport", type: "expense" as const, icon: "transport", color: "#3b82f6", sortOrder: 1 },
  { name: "ช้อปปิ้ง", nameEn: "Shopping", type: "expense" as const, icon: "shopping", color: "#ec4899", sortOrder: 2 },
  { name: "บันเทิง", nameEn: "Entertainment", type: "expense" as const, icon: "entertainment", color: "#8b5cf6", sortOrder: 3 },
  { name: "สาธารณูปโภค", nameEn: "Utilities", type: "expense" as const, icon: "utilities", color: "#eab308", sortOrder: 4 },
  { name: "สุขภาพ", nameEn: "Health", type: "expense" as const, icon: "health", color: "#ef4444", sortOrder: 5 },
  { name: "เงินเดือน", nameEn: "Salary", type: "income" as const, icon: "salary", color: "#10b981", sortOrder: 0 },
  { name: "ฟรีแลนซ์", nameEn: "Freelance", type: "income" as const, icon: "freelance", color: "#059669", sortOrder: 1 },
];

const defaultGoals = [
  { name: "เงินฉุกเฉิน", targetAmount: 50000, icon: "savings", color: "#10b981" },
  { name: "ทะเลปีหน้า", targetAmount: 20000, icon: "travel", color: "#3b82f6" },
];

export async function getWallets() {
  const userId = await requireUserId();
  let result = await db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(wallets.sortOrder);

  // Auto-seed defaults for new users
  if (result.length === 0) {
    await db.insert(wallets).values(defaultWallets.map((w) => ({ ...w, userId })));
    await db.insert(categories).values(defaultCategories.map((c) => ({ ...c, userId })));

    // Create default budgets for expense categories
    const expenseCats = await db.select().from(categories)
      .where(eq(categories.userId, userId));
    const budgetAmounts: Record<string, number> = {
      food: 8000, transport: 3000, shopping: 5000,
      entertainment: 2000, utilities: 2500, health: 2000,
    };
    const budgetValues = expenseCats
      .filter((c) => c.type === "expense" && budgetAmounts[c.icon])
      .map((c) => ({ userId, categoryId: c.id, amount: budgetAmounts[c.icon]! }));
    if (budgetValues.length > 0) {
      await db.insert(budgets).values(budgetValues);
    }

    // Create default savings goals
    await db.insert(savingsGoals).values(defaultGoals.map((g) => ({ ...g, userId })));

    result = await db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(wallets.sortOrder);
  }

  return result;
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
  await db.update(wallets).set(data).where(eq(wallets.id, id));
  revalidatePath("/");
}

export async function deleteWallet(id: number) {
  await db.delete(wallets).where(eq(wallets.id, id));
  revalidatePath("/");
}
