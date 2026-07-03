"use server";
import { db } from "@/server/db";
import { wallets, categories } from "@/server/db/schema";

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
  { name: "โทรศัพท์", nameEn: "Phone", type: "expense" as const, icon: "phone", color: "#6366f1", sortOrder: 6 },
  { name: "การศึกษา", nameEn: "Education", type: "expense" as const, icon: "education", color: "#0ea5e9", sortOrder: 7 },
  { name: "ของขวัญ", nameEn: "Gift", type: "expense" as const, icon: "gift", color: "#d946ef", sortOrder: 8 },
  { name: "เงินเดือน", nameEn: "Salary", type: "income" as const, icon: "salary", color: "#10b981", sortOrder: 0 },
  { name: "ฟรีแลนซ์", nameEn: "Freelance", type: "income" as const, icon: "freelance", color: "#059669", sortOrder: 1 },
  { name: "ของขวัญ", nameEn: "Gift", type: "income" as const, icon: "gift", color: "#ec4899", sortOrder: 2 },
  { name: "คืนเงิน", nameEn: "Refund", type: "income" as const, icon: "refund", color: "#14b8a6", sortOrder: 3 },
  { name: "ลงทุน", nameEn: "Investment", type: "income" as const, icon: "investment", color: "#f59e0b", sortOrder: 4 },
];

export async function seedDefaultData(userId: string) {
  await db.insert(wallets).values(defaultWallets.map((w) => ({ ...w, userId })));
  await db.insert(categories).values(defaultCategories.map((c) => ({ ...c, userId })));
}
