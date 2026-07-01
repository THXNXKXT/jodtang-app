import { pgTable, text, integer, boolean, timestamp, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense", "transfer"]);
export const walletTypeEnum = pgEnum("wallet_type", ["cash", "bank", "ewallet", "savings"]);
export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: walletTypeEnum("type").notNull(),
  icon: text("icon").notNull().default("cash"),
  color: text("color").notNull().default("#3b82f6"),
  openingBalance: integer("opening_balance").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  type: categoryTypeEnum("type").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  walletId: integer("wallet_id").references(() => wallets.id, { onDelete: "cascade" }),
  toWalletId: integer("to_wallet_id").references(() => wallets.id, { onDelete: "set null" }),
  date: timestamp("date").notNull(),
  note: text("note").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  period: text("period").notNull().default("monthly"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  targetAmount: integer("target_amount").notNull(),
  currentAmount: integer("current_amount").notNull().default(0),
  deadline: timestamp("deadline"),
  icon: text("icon").notNull().default("savings"),
  color: text("color").notNull().default("#3b82f6"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savingsContributions = pgTable("savings_contributions", {
  id: serial("id").primaryKey(),
  goalId: integer("goal_id").notNull().references(() => savingsGoals.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  date: timestamp("date").defaultNow(),
  note: text("note").default(""),
});

export const recurringTransactions = pgTable("recurring_transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  walletId: integer("wallet_id").references(() => wallets.id),
  note: text("note").default(""),
  frequency: text("frequency").notNull(),
  nextDate: timestamp("next_date").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const walletsRelations = relations(wallets, ({ many }) => ({
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
  budgets: many(budgets),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
  wallet: one(wallets, { fields: [transactions.walletId], references: [wallets.id] }),
}));

export const savingsGoalsRelations = relations(savingsGoals, ({ many }) => ({
  contributions: many(savingsContributions),
}));
