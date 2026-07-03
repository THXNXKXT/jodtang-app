import {
  Home, Utensils, Car, ShoppingBag, Film, Zap, Heart,
  GraduationCap, Plane, Gift, Dumbbell, Phone, Droplet,
  Wallet, CreditCard, Banknote, Smartphone, PiggyBank,
  Briefcase, TrendingUp, Plus, Minus, ArrowLeftRight, RotateCcw, Coffee, BookOpen, Baby, PawPrint, Wrench,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  food: Utensils, transport: Car, shopping: ShoppingBag,
  entertainment: Film, utilities: Zap, health: Heart,
  education: GraduationCap, travel: Plane, gift: Gift,
  fitness: Dumbbell, phone: Phone, water: Droplet,
  other_expense: ShoppingBag,
  salary: Briefcase, freelance: Wallet, investment: TrendingUp,
  gift_income: Gift, other_income: Plus, refund: RotateCcw,
  cash: Banknote, bank: CreditCard, ewallet: Smartphone, savings: PiggyBank,
};

export const CATEGORY_COLORS: Record<string, string> = {
  food: "#f97316", transport: "#3b82f6", shopping: "#ec4899",
  entertainment: "#8b5cf6", utilities: "#eab308", health: "#ef4444",
  education: "#06b6d4", travel: "#14b8a6", gift: "#a855f7",
  fitness: "#22c55e", phone: "#6366f1", water: "#0ea5e9",
  salary: "#22c55e", freelance: "#10b981", investment: "#f59e0b", refund: "#14b8a6",
};

export const TRANSACTION_TYPE_META = {
  expense: { icon: Minus, color: "var(--color-expense)", label: "รายจ่าย" },
  income: { icon: Plus, color: "var(--color-income)", label: "รายรับ" },
  transfer: { icon: ArrowLeftRight, color: "var(--color-transfer)", label: "โอนย้าย" },
} as const;
