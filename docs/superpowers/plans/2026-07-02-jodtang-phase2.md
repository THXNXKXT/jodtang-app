# Jodtang-app Phase 2: Backend Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mock data with a real PostgreSQL database on Neon, add authentication via Better-Auth, and wire all CRUD operations through Server Actions with per-user data isolation.

**Architecture:** Next.js 16 Server Actions call Drizzle ORM queries against Neon serverless PostgreSQL. Better-Auth handles email/password + Google OAuth with sessions stored in the same database. All data is scoped by `userId` from the authenticated session. Components switch from importing mock-data to calling Server Actions.

**Tech Stack:** Neon (serverless PostgreSQL), Drizzle ORM + drizzle-kit, Better-Auth, @neondatabase/serverless, Next.js Server Actions.

## Global Constraints

- **No emojis** anywhere
- **No `any` types** — strict TypeScript
- **pnpm** as package manager
- **Data isolation**: every query must filter by `userId` from the session
- **Environment variables**: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` in `.env.local`
- **Keep existing UI** — only swap data source from mock to real
- **Shell**: git-bash/MSYS on Windows

---

## Neon Setup (Prerequisite)

1. Go to https://neon.tech → Sign up (GitHub/Google)
2. Create a new project (e.g., "jodtang")
3. Copy the **Connection string** (format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
4. Create `.env.local` in project root:
```
DATABASE_URL=postgresql://...your-connection-string...
BETTER_AUTH_SECRET=run: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
```

---

## File Structure (New + Modified)

```
src/
├── server/
│   ├── db/
│   │   ├── index.ts          # Neon + Drizzle connection
│   │   └── schema.ts         # All table definitions
│   ├── auth.ts               # Better-Auth config
│   └── actions/
│       ├── transactions.ts   # CRUD for transactions
│       ├── wallets.ts        # CRUD for wallets
│       ├── categories.ts     # CRUD for categories
│       ├── budgets.ts        # CRUD for budgets
│       └── goals.ts          # CRUD for goals + contributions
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx    # Login page
│   │   └── signup/page.tsx   # Signup page
│   └── api/auth/[...all]/route.ts  # Better-Auth API handler
├── lib/
│   └── auth-client.ts        # Client-side auth helpers
└── components/
    └── auth/
        └── auth-provider.tsx  # Session context for client
```

---

## Task 1: Database Schema + Connection

**Files:**
- Create: `src/server/db/index.ts`, `src/server/db/schema.ts`, `drizzle.config.ts`
- Create: `.env.local`, `.env.example`

**Interfaces:**
- Produces: `db` (Drizzle instance), all table objects (`users`, `wallets`, `categories`, `transactions`, `budgets`, `savingsGoals`, `savingsContributions`, `recurringTransactions`)

- [ ] **Step 1: Install dependencies**

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

- [ ] **Step 2: Create .env.example**

```
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

- [ ] **Step 3: Create drizzle.config.ts**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 4: Create src/server/db/schema.ts**

All tables based on `src/types/index.ts`. Includes `users` and `sessions` for Better-Auth.

```typescript
import { pgTable, text, integer, boolean, timestamp, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense", "transfer"]);
export const walletTypeEnum = pgEnum("wallet_type", ["cash", "bank", "ewallet", "savings"]);
export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);

// Better-Auth tables
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

// App tables
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

// Relations
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
```

- [ ] **Step 5: Create src/server/db/index.ts**

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export type Database = typeof db;
```

- [ ] **Step 6: Generate and push schema**

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Drizzle schema + Neon connection for all tables"
```

---

## Task 2: Better-Auth Setup

**Files:**
- Create: `src/server/auth.ts`, `src/lib/auth-client.ts`, `src/app/api/auth/[...all]/route.ts`
- Create: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `auth` (Better-Auth instance), `authClient` (client-side helpers), `getSession()` server helper

- [ ] **Step 1: Install Better-Auth**

```bash
pnpm add better-auth
```

- [ ] **Step 2: Create src/server/auth.ts**

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
    },
  }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
});

export type Session = typeof auth.$Infer.Session;
```

- [ ] **Step 3: Create API route**

Create `src/app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

- [ ] **Step 4: Create auth client**

Create `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

- [ ] **Step 5: Create login + signup pages**

Create `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx` with email/password forms using the existing Button component and Tailwind styles. Forms call `signIn.email()` / `signUp.email()` and redirect to `/` on success.

- [ ] **Step 6: Add session helper**

Create `src/server/session.ts`:

```typescript
import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.id;
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Better-Auth setup with email/password + Google OAuth"
```

---

## Task 3: Server Actions - Wallets & Categories

**Files:**
- Create: `src/server/actions/wallets.ts`, `src/server/actions/categories.ts`
- Create: `src/server/actions/seed.ts` (default data on signup)

**Interfaces:**
- Produces: `getWallets()`, `createWallet()`, `updateWallet()`, `deleteWallet()`, `getCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()`, `seedDefaultData(userId)`

- [ ] **Step 1: Create wallets actions**

All functions start with `const userId = await requireUserId();` and filter queries by userId.

```typescript
"use server";
import { db } from "@/server/db";
import { wallets } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

export async function getWallets() {
  const userId = await requireUserId();
  return db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(wallets.sortOrder);
}

export async function createWallet(data: { name: string; type: string; icon: string; color: string; openingBalance: number }) {
  const userId = await requireUserId();
  await db.insert(wallets).values({ ...data, userId });
  revalidatePath("/");
}

// ... updateWallet, deleteWallet similar pattern
```

- [ ] **Step 2: Create categories actions**

Same pattern as wallets.

- [ ] **Step 3: Create seed function**

`seedDefaultData(userId)` inserts default wallets (cash, bank, ewallet, savings) and default categories (food, transport, shopping, etc.) for a new user. Called after signup.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: server actions for wallets and categories + default seed"
```

---

## Task 4: Server Actions - Transactions

**Files:**
- Create: `src/server/actions/transactions.ts`

**Interfaces:**
- Produces: `getTransactions()`, `getTransactionsByMonth()`, `createTransaction()`, `updateTransaction()`, `deleteTransaction()`

- [ ] **Step 1: Create transactions actions**

```typescript
"use server";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { requireUserId } from "@/server/session";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  const userId = await requireUserId();
  return db.select().from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date));
}

export async function createTransaction(data: {
  type: "income" | "expense" | "transfer";
  amount: number;
  categoryId?: number;
  walletId: number;
  toWalletId?: number;
  note: string;
  date: string;
}) {
  const userId = await requireUserId();
  await db.insert(transactions).values({ ...data, userId, date: new Date(data.date) });
  revalidatePath("/");
}

// ... updateTransaction, deleteTransaction similar
```

- [ ] **Step 2: Commit**

---

## Task 5: Server Actions - Budgets & Goals

**Files:**
- Create: `src/server/actions/budgets.ts`, `src/server/actions/goals.ts`

- [ ] **Step 1: Budget CRUD** — getBudgets, createBudget, updateBudget, deleteBudget
- [ ] **Step 2: Goal CRUD** — getGoals, createGoal, updateGoal, deleteGoal
- [ ] **Step 3: Contribution action** — contributeToGoal(goalId, amount) updates currentAmount + creates contribution record
- [ ] **Step 4: Commit**

---

## Task 6: Replace Mock Data with Server Actions

**Files:**
- Modify: ALL page components and feature components that import from `src/lib/mock-data.ts`

- [ ] **Step 1: Convert Home components** to async server components calling Server Actions
- [ ] **Step 2: Convert Transactions page** to fetch from server
- [ ] **Step 3: Convert Reports page** to fetch from server
- [ ] **Step 4: Convert Settings page** wallet/category lists to server data
- [ ] **Step 5: Convert Add Transaction Sheet** to call `createTransaction()` server action
- [ ] **Step 6: Delete `src/lib/mock-data.ts`**
- [ ] **Step 7: Commit**

---

## Task 7: Auth Pages + Protected Routes

**Files:**
- Create: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`
- Create: `src/middleware.ts`
- Modify: `src/app/settings/page.tsx` (show real user info, working sign-out)

- [ ] **Step 1: Build login/signup pages** with email/password forms
- [ ] **Step 2: Add middleware** to redirect unauthenticated users to /login
- [ ] **Step 3: Wire sign-out button** to call `authClient.signOut()`
- [ ] **Step 4: Show real user email/name** in settings from session
- [ ] **Step 5: Commit**

---

## Task 8: Migration Verification + Final QA

- [ ] **Step 1: Create new account** → verify default wallets/categories seeded
- [ ] **Step 2: Add transaction** → verify it persists across refresh
- [ ] **Step 3: Check reports** → verify charts use real data
- [ ] **Step 4: Check data isolation** → verify user A can't see user B's data
- [ ] **Step 5: Test both dark/light themes** still work
- [ ] **Step 6: Run `npx tsc --noEmit`** — fix all errors
- [ ] **Step 7: Final commit + tag**
