import { z } from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(["cash", "bank", "ewallet", "savings"]),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  openingBalance: z.number().int().min(0),
});

export const updateWalletSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  type: z.enum(["cash", "bank", "ewallet", "savings"]).optional(),
  icon: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  openingBalance: z.number().int().min(0).optional(),
  sortOrder: z.number().int().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  nameEn: z.string().min(1).max(50),
  type: z.enum(["income", "expense"]),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  nameEn: z.string().min(1).max(50).optional(),
  icon: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const createTransactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.number().int().positive(),
  categoryId: z.number().int().positive().optional(),
  walletId: z.number().int().positive(),
  toWalletId: z.number().int().positive().optional(),
  note: z.string().max(200).default(""),
  date: z.string().min(1),
});

export const updateTransactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]).optional(),
  amount: z.number().int().positive().optional(),
  categoryId: z.number().int().positive().optional(),
  walletId: z.number().int().positive().optional(),
  note: z.string().max(200).optional(),
  date: z.date().optional(),
});

export const createBudgetSchema = z.object({
  categoryId: z.number().int().positive(),
  amount: z.number().int().positive(),
});

export const updateBudgetSchema = z.object({
  amount: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

export const createGoalSchema = z.object({
  name: z.string().min(1).max(100),
  targetAmount: z.number().int().positive(),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  deadline: z.string().optional(),
});

export const contributeSchema = z.object({
  goalId: z.number().int().positive(),
  amount: z.number().int().positive(),
});

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };
