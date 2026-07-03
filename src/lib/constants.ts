import { Plus, Minus, ArrowLeftRight, type LucideIcon } from "lucide-react";
import { CATEGORY_ICONS } from "./category-icons";

export { CATEGORY_ICONS };

export const CATEGORY_COLORS: Record<string, string> = {
  food: "#f97316", transport: "#3b82f6", shopping: "#ec4899",
  entertainment: "#8b5cf6", utilities: "#eab308", health: "#ef4444",
  education: "#06b6d4", travel: "#14b8a6", gift: "#a855f7",
  fitness: "#22c55e", phone: "#6366f1", water: "#0ea5e9",
  salary: "#22c55e", freelance: "#10b981", investment: "#f59e0b", refund: "#14b8a6", rent: "#0891b2", coffee: "#92400e", pet: "#7c3aed", repair: "#78716c", selling: "#0d9488",
};

export const TRANSACTION_TYPE_META = {
  expense: { icon: Minus, color: "var(--color-expense)", label: "รายจ่าย" },
  income: { icon: Plus, color: "var(--color-income)", label: "รายรับ" },
  transfer: { icon: ArrowLeftRight, color: "var(--color-transfer)", label: "โอนย้าย" },
} as const;
