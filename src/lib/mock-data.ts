import type {
  Transaction, Wallet, Category, Budget, SavingsGoal,
} from "@/types";

export const mockWallets: Wallet[] = [
  { id: "w1", name: "กระเป๋าสตางค์", type: "cash", icon: "cash", color: "#22c55e", openingBalance: 5000, sortOrder: 0, disabled: false },
  { id: "w2", name: "KBANK", type: "bank", icon: "bank", color: "#3b82f6", openingBalance: 45000, sortOrder: 1, disabled: false },
  { id: "w3", name: "TrueMoney", type: "ewallet", icon: "ewallet", color: "#f97316", openingBalance: 1200, sortOrder: 2, disabled: false },
  { id: "w4", name: "เงินออม", type: "savings", icon: "savings", color: "#a855f7", openingBalance: 100000, sortOrder: 3, disabled: false },
];

export const mockCategories: Category[] = [
  { id: "c1", name: "อาหาร", nameEn: "Food", type: "expense", icon: "food", color: "#f97316", sortOrder: 0 },
  { id: "c2", name: "เดินทาง", nameEn: "Transport", type: "expense", icon: "transport", color: "#3b82f6", sortOrder: 1 },
  { id: "c3", name: "ช้อปปิ้ง", nameEn: "Shopping", type: "expense", icon: "shopping", color: "#ec4899", sortOrder: 2 },
  { id: "c4", name: "บันเทิง", nameEn: "Entertainment", type: "expense", icon: "entertainment", color: "#8b5cf6", sortOrder: 3 },
  { id: "c5", name: "สาธารณูปโภค", nameEn: "Utilities", type: "expense", icon: "utilities", color: "#eab308", sortOrder: 4 },
  { id: "c6", name: "สุขภาพ", nameEn: "Health", type: "expense", icon: "health", color: "#ef4444", sortOrder: 5 },
  { id: "c7", name: "โทรศัพท์", nameEn: "Phone", type: "expense", icon: "phone", color: "#6366f1", sortOrder: 6 },
  { id: "c8", name: "เงินเดือน", nameEn: "Salary", type: "income", icon: "salary", color: "#22c55e", sortOrder: 0 },
  { id: "c9", name: "ฟรีแลนซ์", nameEn: "Freelance", type: "income", icon: "freelance", color: "#10b981", sortOrder: 1 },
  { id: "c10", name: "ลงทุน", nameEn: "Investment", type: "income", icon: "investment", color: "#f59e0b", sortOrder: 2 },
];

export const mockBudgets: Budget[] = [
  { id: "b1", categoryId: "c1", amount: 8000, period: "monthly", active: true },
  { id: "b2", categoryId: "c2", amount: 3000, period: "monthly", active: true },
  { id: "b3", categoryId: "c3", amount: 5000, period: "monthly", active: true },
  { id: "b4", categoryId: "c4", amount: 2000, period: "monthly", active: true },
  { id: "b5", categoryId: "c5", amount: 2500, period: "monthly", active: true },
];

export const mockGoals: SavingsGoal[] = [
  { id: "g1", name: "เก็บเงินซื้อ Macbook", targetAmount: 60000, currentAmount: 35000, icon: "shopping", color: "#8b5cf6" },
  { id: "g2", name: "เงินฉุกเฉิน", targetAmount: 100000, currentAmount: 45000, icon: "savings", color: "#22c55e" },
  { id: "g3", name: "ทะเลทริปปีหน้า", targetAmount: 20000, currentAmount: 8000, deadline: "2026-12-01", icon: "travel", color: "#3b82f6" },
];

function generateMockTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const txns: Transaction[] = [];
  const entries: Array<[number, string, number, string, string]> = [
    [1, "income", 45000, "c8", "เงินเดือน"],
    [2, "expense", 6500, "c1", "ข้าวเช้า-เย็น"],
    [3, "expense", 1200, "c2", "รถไฟฟ้า"],
    [3, "expense", 89, "c7", "ค่าโทรศัพท์"],
    [5, "expense", 2500, "c3", "เสื้อผ้า"],
    [5, "expense", 450, "c1", "ข้าวกลางวัน"],
    [7, "expense", 320, "c4", "หนัง"],
    [8, "expense", 1800, "c5", "ไฟ"],
    [8, "expense", 220, "c5", "น้ำ"],
    [10, "income", 8000, "c9", "งานฟรีแลนซ์"],
    [10, "expense", 580, "c1", "ข้าว"],
    [12, "expense", 1450, "c2", "น้ำมัน"],
    [14, "expense", 990, "c3", "หูฟัง"],
    [15, "expense", 350, "c1", "กาแฟ"],
    [16, "expense", 280, "c4", "เกม"],
    [18, "expense", 1200, "c6", "ยา"],
    [20, "expense", 670, "c1", "ข้าวเย็น"],
    [22, "income", 1500, "c10", "ปันผล"],
    [22, "expense", 400, "c2", "แท็กซี่"],
    [25, "expense", 1500, "c3", "รองเท้า"],
    [27, "expense", 320, "c1", "ขนม"],
  ];
  entries.forEach(([day, type, amount, categoryId, note], i) => {
    const date = new Date(year, month, Math.min(day, 28));
    txns.push({
      id: `t${i + 1}`, type: type as Transaction["type"], amount,
      categoryId, walletId: type === "income" ? "w2" : "w1",
      date: date.toISOString(), note, tags: [],
    });
  });
  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const mockTransactions: Transaction[] = generateMockTransactions();

export function getWalletById(id: string): Wallet | undefined {
  return mockWallets.find((w) => w.id === id);
}
export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((c) => c.id === id);
}
export function getTotalBalance(): number {
  return mockWallets.reduce((sum, w) => sum + w.openingBalance, 0);
}
export function getMonthIncome(): number {
  return mockTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
}
export function getMonthExpense(): number {
  return mockTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
}
export function getCategorySpending(categoryId: string): number {
  return mockTransactions.filter((t) => t.type === "expense" && t.categoryId === categoryId).reduce((sum, t) => sum + t.amount, 0);
}
