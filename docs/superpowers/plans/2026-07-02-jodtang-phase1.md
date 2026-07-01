# Jodtang-app Phase 1: Visual Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive mobile-first visual prototype of Jodtang-app with mock data, complete Framer Motion animations, and all 5 main screens — no backend wiring.

**Architecture:** Next.js 16 App Router with client components for interactivity. Mock data hardcoded in a typed data layer. Framer Motion for all animations. lucide-react icons throughout (zero emojis). Bottom tab navigation with shared-layout page transitions.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion 12, Recharts 3, lucide-react, next-intl 4, react-hook-form 7, zod 4, class-variance-authority, tailwind-merge, date-fns 4, pnpm.

## Global Constraints

- **No emojis** anywhere — lucide-react icons only
- **Mobile-first**: 375px base, scale up to desktop (max-width 480px on phone-like container centered on larger screens)
- **No `any` types** — strict TypeScript throughout
- **Monochrome palette**: greyscale + muted green (#22c55e at 80% opacity) for income / muted red (#ef4444 at 80% opacity) for expense
- **pnpm** as package manager
- **All interactive motion** via Framer Motion springs — no CSS transitions for buttons, sheets, cards
- **THB currency** only — `฿` prefix, no decimal for whole numbers
- **Thai + English** i18n from day one
- **Dark mode primary** — design for dark first, light as secondary

---

## File Structure

```
jodtang-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout: fonts, metadata, IntlProvider
│   │   ├── page.tsx                      # Home/Dashboard
│   │   ├── globals.css                   # Tailwind v4 theme tokens
│   │   ├── transactions/
│   │   │   └── page.tsx                  # Transaction history
│   │   ├── reports/
│   │   │   └── page.tsx                  # Charts, budgets, goals
│   │   └── settings/
│   │       └── page.tsx                  # Wallets, categories, profile
│   ├── components/
│   │   ├── ui/                           # Reusable primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── bottom-sheet.tsx
│   │   │   ├── segmented-control.tsx
│   │   │   ├── progress-ring.tsx
│   │   │   ├── animated-number.tsx
│   │   │   ├── category-icon.tsx
│   │   │   └── transaction-item.tsx
│   │   ├── layout/
│   │   │   ├── app-shell.tsx             # Phone-frame container + safe area
│   │   │   ├── bottom-nav.tsx            # Tab bar with Framer Motion layoutId
│   │   │   └── page-transition.tsx       # Fade + slide wrapper
│   │   ├── home/
│   │   │   ├── balance-card.tsx
│   │   │   ├── spending-trend-chart.tsx
│   │   │   ├── category-breakdown-chart.tsx
│   │   │   ├── budget-mini-cards.tsx
│   │   │   └── recent-transactions.tsx
│   │   ├── transactions/
│   │   │   ├── transaction-list.tsx
│   │   │   └── transaction-filters.tsx
│   │   ├── add/
│   │   │   └── add-transaction-sheet.tsx
│   │   ├── reports/
│   │   │   ├── overview-tab.tsx
│   │   │   ├── budgets-tab.tsx
│   │   │   └── goals-tab.tsx
│   │   └── settings/
│   │       ├── wallet-list.tsx
│   │       └── category-list.tsx
│   ├── lib/
│   │   ├── utils.ts                      # cn(), formatCurrency(), formatDate()
│   │   ├── constants.ts                  # Category icons map, colors
│   │   └── mock-data.ts                  # Typed seed data
│   ├── i18n/
│   │   ├── config.ts                     # next-intl config
│   │   ├── messages.th.json
│   │   └── messages.en.json
│   └── types/
│       └── index.ts                      # All TypeScript interfaces
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── docs/
    └── superpowers/
        ├── specs/2026-07-02-jodtang-app-design.md
        └── plans/
            └── 2026-07-02-jodtang-app-phase1.md  ← this file
```

---

## Task 1: Scaffold Project + Install Dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: a running Next.js 16 dev server at localhost:3000

- [ ] **Step 1: Scaffold with create-next-app**

```bash
cd /d/Projects
pnpm create next-app@latest jodtang-app --ts --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"
```

If the folder already exists (it does — we created it for git), scaffold in a temp dir and move files:

```bash
cd /d/Projects
pnpm create next-app@latest jodtung-tmp --ts --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"
# Move all files including dotfiles into jodtang-app
cp -r jodtung-tmp/* jodtang-app/
cp -r jodtung-tmp/.* jodtang-app/ 2>/dev/null
rm -rf jodtung-tmp
cd jodtang-app
```

- [ ] **Step 2: Install all dependencies**

```bash
pnpm add framer-motion recharts lucide-react next-intl react-hook-form @hookform/resolvers zod class-variance-authority tailwind-merge clsx date-fns
pnpm add -D @types/node
```

- [ ] **Step 3: Configure TypeScript for strictness**

Overwrite `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Verify dev server starts**

```bash
pnpm dev
```

Expected: Server starts at `http://localhost:3000` with default Next.js welcome page. Kill with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 project with dependencies"
```

---

## Task 2: Design System + Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/utils.ts`, `src/lib/constants.ts`

**Interfaces:**
- Produces: `cn()` utility, `formatCurrency()`, `formatDate()`, Tailwind theme tokens, category icon/color constants

- [ ] **Step 1: Write globals.css with Tailwind v4 theme**

Overwrite `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Greyscale */
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-surface-hover: #1c1c1c;
  --color-border: #262626;
  --color-text-primary: #fafafa;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #525252;

  /* Subtle accents */
  --color-income: #22c55e;
  --color-income-muted: #22c55ecc;
  --color-expense: #ef4444;
  --color-expense-muted: #ef4444cc;
  --color-transfer: #3b82f6;
  --color-transfer-muted: #3b82f6cc;

  /* Spacing */
  --spacing-tab-bar: 64px;

  /* Font */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
}

@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    overscroll-behavior-y: none;
    -webkit-font-smoothing: antialiased;
  }

  /* Hide scrollbar but keep scrollable */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

@layer utilities {
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .safe-area-top {
    padding-top: env(safe-area-inset-top, 0px);
  }
}
```

- [ ] **Step 2: Write utils.ts**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return `${amount < 0 ? "-" : ""}฿${formatted}`;
}

export function formatCurrencyShort(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `฿${(amount / 1_000).toFixed(1)}K`;
  return `฿${amount.toFixed(0)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
  }).format(d);
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(d, today)) return "วันนี้";
  if (isSameDay(d, yesterday)) return "เมื่อวาน";
  return formatDateShort(d);
}
```

- [ ] **Step 3: Write constants.ts**

Create `src/lib/constants.ts`:

```typescript
import {
  Home, Utensils, Car, ShoppingBag, Film, Zap, Heart,
  GraduationCap, Plane, Gift, Dumbbell, Phone, Droplet,
  Wallet, CreditCard, Banknote, Smartphone, PiggyBank,
  Briefcase, TrendingUp, Plus, Minus, ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  // Expense categories
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  entertainment: Film,
  utilities: Zap,
  health: Heart,
  education: GraduationCap,
  travel: Plane,
  gift: Gift,
  fitness: Dumbbell,
  phone: Phone,
  water: Droplet,
  other_expense: ShoppingBag,

  // Income categories
  salary: Briefcase,
  freelance: Wallet,
  investment: TrendingUp,
  gift_income: Gift,
  other_income: Plus,

  // Wallet types
  cash: Banknote,
  bank: CreditCard,
  ewallet: Smartphone,
  savings: PiggyBank,
};

export const CATEGORY_COLORS: Record<string, string> = {
  food: "#f97316",
  transport: "#3b82f6",
  shopping: "#ec4899",
  entertainment: "#8b5cf6",
  utilities: "#eab308",
  health: "#ef4444",
  education: "#06b6d4",
  travel: "#14b8a6",
  gift: "#a855f7",
  fitness: "#22c55e",
  phone: "#6366f1",
  water: "#0ea5e9",
  salary: "#22c55e",
  freelance: "#10b981",
  investment: "#f59e0b",
};

export const TRANSACTION_TYPE_META = {
  expense: { icon: Minus, color: "var(--color-expense)", label: "รายจ่าย" },
  income: { icon: Plus, color: "var(--color-income)", label: "รายรับ" },
  transfer: { icon: ArrowLeftRight, color: "var(--color-transfer)", label: "โอนย้าย" },
} as const;
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: design system — tailwind theme, utils, constants"
```

---

## Task 3: Types + Mock Data Layer

**Files:**
- Create: `src/types/index.ts`, `src/lib/mock-data.ts`

**Interfaces:**
- Produces: `Transaction`, `Wallet`, `Category`, `Budget`, `SavingsGoal`, `RecurringTransaction` types + seed arrays

- [ ] **Step 1: Write types**

Create `src/types/index.ts`:

```typescript
export type TransactionType = "income" | "expense" | "transfer";
export type WalletType = "cash" | "bank" | "ewallet" | "savings";
export type CategoryType = "income" | "expense";
export type BudgetPeriod = "monthly";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  toWalletId?: string;
  date: string; // ISO string
  note: string;
  tags: string[];
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  icon: string; // key into CATEGORY_ICONS
  color: string;
  openingBalance: number;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  type: CategoryType;
  icon: string; // key into CATEGORY_ICONS
  color: string;
  sortOrder: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  active: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
}

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  note: string;
  frequency: "daily" | "weekly" | "monthly";
  nextDate: string;
  active: boolean;
}
```

- [ ] **Step 2: Write mock data**

Create `src/lib/mock-data.ts`:

```typescript
import type {
  Transaction, Wallet, Category, Budget, SavingsGoal,
} from "@/types";

export const mockWallets: Wallet[] = [
  { id: "w1", name: "กระเป๋าสตางค์", type: "cash", icon: "cash", color: "#22c55e", openingBalance: 5000, sortOrder: 0 },
  { id: "w2", name: "KBANK", type: "bank", icon: "bank", color: "#3b82f6", openingBalance: 45000, sortOrder: 1 },
  { id: "w3", name: "TrueMoney", type: "ewallet", icon: "ewallet", color: "#f97316", openingBalance: 1200, sortOrder: 2 },
  { id: "w4", name: "เงินออม", type: "savings", icon: "savings", color: "#a855f7", openingBalance: 100000, sortOrder: 3 },
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

// Generate transactions for current month
function generateMockTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const txns: Transaction[] = [];

  const entries: Array<[number, string, string, string, string]> = [
    // [day, type, amount, categoryId, note]
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
      id: `t${i + 1}`,
      type: type as Transaction["type"],
      amount,
      categoryId,
      walletId: type === "income" ? "w2" : "w1",
      date: date.toISOString(),
      note,
      tags: [],
    });
  });

  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const mockTransactions: Transaction[] = generateMockTransactions();

// Derived helpers
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
  return mockTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthExpense(): number {
  return mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getCategorySpending(categoryId: string): number {
  return mockTransactions
    .filter((t) => t.type === "expense" && t.categoryId === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: types + mock data layer with seed transactions"
```

---

## Task 4: i18n Setup (TH/EN)

**Files:**
- Create: `src/i18n/config.ts`, `src/i18n/messages.th.json`, `src/i18n/messages.en.json`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `useI18n()` hook, `messages` for both languages, locale switcher available in settings

- [ ] **Step 1: Write Thai messages**

Create `src/i18n/messages.th.json`:

```json
{
  "app": { "name": "จดตัง" },
  "nav": {
    "home": "หน้าแรก",
    "transactions": "รายการ",
    "add": "เพิ่ม",
    "reports": "รายงาน",
    "settings": "ตั้งค่า"
  },
  "home": {
    "greeting": "สวัสดี",
    "totalBalance": "ยอดรวมทั้งหมด",
    "income": "รายรับ",
    "expense": "รายจ่าย",
    "net": "คงเหลือ",
    "spendingTrend": "แนวโน้ม 7 วัน",
    "categoryBreakdown": "สัดส่วนรายจ่าย",
    "budgets": "งบประมาณ",
    "recentTransactions": "ล่าสุด",
    "seeAll": "ดูทั้งหมด"
  },
  "transactions": {
    "title": "รายการทั้งหมด",
    "search": "ค้นหา...",
    "all": "ทั้งหมด",
    "income": "รายรับ",
    "expense": "รายจ่าย",
    "transfer": "โอนย้าย",
    "noResults": "ไม่พบรายการ",
    "today": "วันนี้",
    "yesterday": "เมื่อวาน"
  },
  "add": {
    "title": "เพิ่มรายการ",
    "expense": "รายจ่าย",
    "income": "รายรับ",
    "transfer": "โอนย้าย",
    "amount": "จำนวนเงิน",
    "category": "หมวดหมู่",
    "wallet": "กระเป๋าเงิน",
    "date": "วันที่",
    "note": "หมายเหตุ",
    "save": "บันทึก",
    "cancel": "ยกเลิก"
  },
  "reports": {
    "title": "รายงาน",
    "overview": "ภาพรวม",
    "budgets": "งบประมาณ",
    "goals": "เป้าหมาย",
    "monthlyComparison": "เปรียบเทียบรายเดือน",
    "categoryBreakdown": "สัดส่วนหมวดหมู่",
    "trend": "แนวโน้ม",
    "budgetLeft": "เหลือ",
    "budgetUsed": "ใช้แล้ว",
    "budgetOver": "เกินงบ",
    "contribute": "เติมเงิน",
    "target": "เป้าหมาย",
    "saved": "ออมแล้ว"
  },
  "settings": {
    "title": "ตั้งค่า",
    "profile": "โปรไฟล์",
    "wallets": "กระเป๋าเงิน",
    "categories": "หมวดหมู่",
    "preferences": "การตั้งค่า",
    "language": "ภาษา",
    "thai": "ไทย",
    "english": "English",
    "theme": "ธีม",
    "dark": "มืด",
    "light": "สว่าง",
    "system": "ตามระบบ",
    "export": "ส่งออกข้อมูล",
    "signOut": "ออกจากระบบ"
  }
}
```

- [ ] **Step 2: Write English messages**

Create `src/i18n/messages.en.json`:

```json
{
  "app": { "name": "Jodtang" },
  "nav": {
    "home": "Home",
    "transactions": "Transactions",
    "add": "Add",
    "reports": "Reports",
    "settings": "Settings"
  },
  "home": {
    "greeting": "Hello",
    "totalBalance": "Total Balance",
    "income": "Income",
    "expense": "Expense",
    "net": "Net",
    "spendingTrend": "7-Day Trend",
    "categoryBreakdown": "Spending by Category",
    "budgets": "Budgets",
    "recentTransactions": "Recent",
    "seeAll": "See all"
  },
  "transactions": {
    "title": "All Transactions",
    "search": "Search...",
    "all": "All",
    "income": "Income",
    "expense": "Expense",
    "transfer": "Transfer",
    "noResults": "No transactions found",
    "today": "Today",
    "yesterday": "Yesterday"
  },
  "add": {
    "title": "Add Transaction",
    "expense": "Expense",
    "income": "Income",
    "transfer": "Transfer",
    "amount": "Amount",
    "category": "Category",
    "wallet": "Wallet",
    "date": "Date",
    "note": "Note",
    "save": "Save",
    "cancel": "Cancel"
  },
  "reports": {
    "title": "Reports",
    "overview": "Overview",
    "budgets": "Budgets",
    "goals": "Goals",
    "monthlyComparison": "Monthly Comparison",
    "categoryBreakdown": "Category Breakdown",
    "trend": "Trend",
    "budgetLeft": "Left",
    "budgetUsed": "Used",
    "budgetOver": "Over budget",
    "contribute": "Contribute",
    "target": "Target",
    "saved": "Saved"
  },
  "settings": {
    "title": "Settings",
    "profile": "Profile",
    "wallets": "Wallets",
    "categories": "Categories",
    "preferences": "Preferences",
    "language": "Language",
    "thai": "ไทย",
    "english": "English",
    "theme": "Theme",
    "dark": "Dark",
    "light": "Light",
    "system": "System",
    "export": "Export Data",
    "signOut": "Sign Out"
  }
}
```

- [ ] **Step 3: Write i18n config + provider**

Create `src/i18n/config.ts`:

```typescript
import th from "./messages.th.json";
import en from "./messages.en.json";

export type Locale = "th" | "en";

export const messages = { th, en } as const;

export const defaultLocale: Locale = "th";

// Simple context-based i18n for Phase 1 (no URL routing)
import { createContext, useContext } from "react";

type Messages = typeof th;

const I18nContext = createContext<{
  locale: Locale;
  messages: Messages;
  setLocale: (l: Locale) => void;
}>({
  locale: defaultLocale,
  messages: th,
  setLocale: () => {},
});

export function useI18n() {
  const ctx = useContext(I18nContext);
  function t(path: string): string {
    const keys = path.split(".");
    let value: unknown = ctx.messages;
    for (const key of keys) {
      if (typeof value === "object" && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }
    return typeof value === "string" ? value : path;
  }
  return { t, locale: ctx.locale, setLocale: ctx.setLocale };
}

export { I18nContext };
```

- [ ] **Step 4: Wire provider into root layout**

Overwrite `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useCallback } from "react";
import { I18nContext, defaultLocale, messages, type Locale } from "@/i18n/config";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin", "thai"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Jodtang — จดตัง",
  description: "Mobile-first personal finance tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <I18nContext.Provider value={{ locale, messages: messages[locale], setLocale }}>
          <AppShell>{children}</AppShell>
        </I18nContext.Provider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: i18n setup with TH/EN messages and context provider"
```

---

## Task 5: UI Primitives

**Files:**
- Create: `src/components/ui/animated-number.tsx`, `src/components/ui/progress-ring.tsx`, `src/components/ui/bottom-sheet.tsx`, `src/components/ui/segmented-control.tsx`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/transaction-item.tsx`

**Interfaces:**
- Produces: reusable components used across all pages

- [ ] **Step 1: AnimatedNumber (count-up on mount)**

Create `src/components/ui/animated-number.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString("th-TH"),
  duration = 0.8,
  className,
}: AnimatedNumberProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => format(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded, duration]);

  return <motion.span ref={ref} className={className}>0</motion.span>;
}
```

- [ ] **Step 2: ProgressRing (animated SVG circle)**

Create `src/components/ui/progress-ring.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  color = "var(--color-income)",
  trackColor = "var(--color-border)",
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clampedProgress) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
```

- [ ] **Step 3: BottomSheet (slide-up modal with drag-to-dismiss)**

Create `src/components/ui/bottom-sheet.tsx`:

```tsx
"use client";

import { motion, AnimatePresence, type PanInfo } from "framer-motion";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > 100) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-10 rounded-full bg-[var(--color-text-muted)]" />
            </div>
            {title && (
              <h2 className="px-6 pb-2 text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
            )}
            <div className="max-h-[80vh] overflow-y-auto no-scrollbar">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: SegmentedControl (animated tab selector)**

Create `src/components/ui/segmented-control.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  segments: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  segments, value, onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex rounded-xl bg-[var(--color-surface-hover)] p-1">
      {segments.map((seg) => (
        <button
          key={seg.value}
          onClick={() => onChange(seg.value)}
          className={cn(
            "relative flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            value === seg.value ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
          )}
        >
          {value === seg.value && (
            <motion.div
              layoutId="segmented-control"
              className="absolute inset-0 rounded-lg bg-[var(--color-surface)]"
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative z-10">{seg.label}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Button + Card**

Create `src/components/ui/button.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "rounded-xl px-5 py-3 text-sm font-semibold",
        variant === "primary" && "bg-[var(--color-text-primary)] text-[var(--color-bg)]",
        variant === "secondary" && "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]",
        variant === "ghost" && "text-[var(--color-text-secondary)]",
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
```

Create `src/components/ui/card.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
        hoverable && "transition-colors hover:bg-[var(--color-surface-hover)]",
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 6: TransactionItem (single row with icon + amount)**

Create `src/components/ui/transaction-item.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { getCategoryById, getWalletById } from "@/lib/mock-data";
import type { Transaction } from "@/types";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const category = getCategoryById(transaction.categoryId);
  const wallet = getWalletById(transaction.walletId);
  const Icon = category ? CATEGORY_ICONS[category.icon] ?? CATEGORY_ICONS.other_expense : CATEGORY_ICONS.other_expense;
  const color = category ? CATEGORY_COLORS[category.icon] ?? "#525252" : "#525252";
  const isIncome = transaction.type === "income";

  return (
    <motion.div
      layout
      className="flex items-center gap-3 py-3"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}22` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
          {transaction.note || category?.name}
        </p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {wallet?.name} · {formatRelativeDate(transaction.date)}
        </p>
      </div>
      <span
        className="shrink-0 text-sm font-semibold"
        style={{ color: isIncome ? "var(--color-income)" : "var(--color-text-primary)" }}
      >
        {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
      </span>
    </motion.div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: UI primitives — AnimatedNumber, ProgressRing, BottomSheet, SegmentedControl, Button, Card, TransactionItem"
```

---

## Task 6: App Shell + Bottom Navigation

**Files:**
- Create: `src/components/layout/app-shell.tsx`, `src/components/layout/bottom-nav.tsx`, `src/components/layout/page-transition.tsx`

**Interfaces:**
- Produces: phone-frame container, fixed bottom tab bar with animated active indicator, page transition wrapper

- [ ] **Step 1: AppShell (phone-frame container centered on desktop)**

Create `src/components/layout/app-shell.tsx`:

```tsx
"use client";

import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-black">
      <div className="relative w-full max-w-[480px] bg-[var(--color-bg)]">
        <main className="min-h-dvh pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: BottomNav (5 tabs with animated layoutId indicator)**

Create `src/components/layout/bottom-nav.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, ReceiptText, BarChart3, Settings } from "lucide-react";
import { useI18n } from "@/i18n/config";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "nav.home", icon: LayoutDashboard },
  { href: "/transactions", labelKey: "nav.transactions", icon: ReceiptText },
  { href: "/reports", labelKey: "nav.reports", icon: BarChart3 },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

export function BottomNav() {
  const { t } = useI18n();
  const [activePath, setActivePath] = useState("/");
  const [addOpen, setAddOpen] = useState(false);

  // Sync with current pathname on client
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path !== activePath && !addOpen) setActivePath(path);
  }

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[480px] items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl safe-area-bottom h-[var(--spacing-tab-bar)] -translate-x-1/2">
        {navItems.slice(0, 2).map((item) => (
          <NavButton key={item.href} item={item} active={activePath === item.href} onClick={() => { setActivePath(item.href); window.location.href = item.href; }} t={t} />
        ))}

        {/* Center add button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => setAddOpen(true)}
          className="flex h-12 w-12 -translate-y-2 items-center justify-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] shadow-lg"
        >
          <Plus size={24} />
        </motion.button>

        {navItems.slice(2).map((item) => (
          <NavButton key={item.href} item={item} active={activePath === item.href} onClick={() => { setActivePath(item.href); window.location.href = item.href; }} t={t} />
        ))}
      </nav>

      <AddTransactionSheetLazy open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

function NavButton({ item, active, onClick, t }: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  t: (k: string) => string;
}) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} className="relative flex flex-col items-center gap-1 px-2 py-2">
      <Icon
        size={22}
        className={cn(active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]")}
        strokeWidth={active ? 2.5 : 2}
      />
      <span className={cn("text-[10px]", active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]")}>
        {t(item.labelKey)}
      </span>
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-[var(--color-text-primary)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}
```

> **Note:** Import `Plus` from `lucide-react` at top. The `AddTransactionSheetLazy` component will be built in Task 8. For now, create a temporary placeholder:

Add to top of `bottom-nav.tsx` imports:
```tsx
import { Plus } from "lucide-react";
```

And replace the `<AddTransactionSheetLazy>` usage temporarily with nothing until Task 8.

- [ ] **Step 3: PageTransition wrapper**

Create `src/components/layout/page-transition.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: app shell + bottom navigation with animated tab indicator"
```

---

## Task 7: Home/Dashboard Page

**Files:**
- Create: `src/components/home/balance-card.tsx`, `src/components/home/spending-trend-chart.tsx`, `src/components/home/category-breakdown-chart.tsx`, `src/components/home/budget-mini-cards.tsx`, `src/components/home/recent-transactions.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: complete dashboard with animated balance, charts, recent transactions

- [ ] **Step 1: BalanceCard (large balance + income/expense bars)**

Create `src/components/home/balance-card.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { getTotalBalance, getMonthIncome, getMonthExpense } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function BalanceCard() {
  const total = getTotalBalance();
  const income = getMonthIncome();
  const expense = getMonthExpense();
  const net = income - expense;
  const maxVal = Math.max(income, expense, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)] p-5"
    >
      <p className="text-sm text-[var(--color-text-secondary)]">ยอดรวมทั้งหมด</p>
      <div className="mt-1 text-3xl font-bold tracking-tight">
        <AnimatedNumber value={total} format={(n) => `฿${n.toLocaleString("th-TH")}`} />
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1 rounded-xl bg-[var(--color-surface-hover)] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-income)]">
            <TrendingUp size={14} /> รายรับ
          </div>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(income)}</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <motion.div
              className="h-full rounded-full bg-[var(--color-income)]"
              initial={{ width: 0 }}
              animate={{ width: `${(income / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        <div className="flex-1 rounded-xl bg-[var(--color-surface-hover)] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-expense)]">
            <TrendingDown size={14} /> รายจ่าย
          </div>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(expense)}</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <motion.div
              className="h-full rounded-full bg-[var(--color-expense)]"
              initial={{ width: 0 }}
              animate={{ width: `${(expense / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: SpendingTrendChart (7-day area chart)**

Create `src/components/home/spending-trend-chart.tsx`:

```tsx
"use client";

import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { mockTransactions } from "@/lib/mock-data";

export function SpendingTrendChart() {
  // Build last 7 days spending data
  const days: Array<{ day: string; amount: number }> = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString("th-TH", { weekday: "short" });
    const amount = mockTransactions
      .filter((t) => {
        const td = new Date(t.date);
        return t.type === "expense" &&
          td.getDate() === date.getDate() &&
          td.getMonth() === date.getMonth();
      })
      .reduce((s, t) => s + t.amount, 0);
    days.push({ day: dayStr, amount });
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-[var(--color-text-secondary)]">แนวโน้ม 7 วัน</p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={days} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-expense)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-expense)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`฿${v}`, "รายจ่าย"]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="var(--color-expense)"
            strokeWidth={2}
            fill="url(#trendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

- [ ] **Step 3: CategoryBreakdownChart (pie chart top 5)**

Create `src/components/home/category-breakdown-chart.tsx`:

```tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { mockTransactions, mockCategories, getCategoryById } from "@/lib/mock-data";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export function CategoryBreakdownChart() {
  const spending = mockCategories
    .filter((c) => c.type === "expense")
    .map((c) => ({
      name: c.name,
      value: mockTransactions
        .filter((t) => t.categoryId === c.id && t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
      color: CATEGORY_COLORS[c.icon] ?? "#525252",
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const total = spending.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-[var(--color-text-secondary)]">สัดส่วนรายจ่าย</p>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={100} height={100}>
          <PieChart>
            <Pie data={spending} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={2}>
              {spending.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-1.5">
          {spending.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </span>
              <span className="text-[var(--color-text-secondary)]">{Math.round((s.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: BudgetMiniCards (top 3 budgets near limit)**

Create `src/components/home/budget-mini-cards.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { mockBudgets, getCategoryById, getCategorySpending } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function BudgetMiniCards() {
  const budgets = mockBudgets
    .map((b) => {
      const cat = getCategoryById(b.categoryId);
      const spent = getCategorySpending(b.categoryId);
      return { ...b, category: cat, spent, pct: spent / b.amount };
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">งบประมาณ</p>
      </div>
      <div className="space-y-2">
        {budgets.map((b, i) => {
          const Icon = b.category ? CATEGORY_ICONS[b.category.icon] : null;
          const color = b.category ? CATEGORY_COLORS[b.category.icon] : "#525252";
          const overBudget = b.spent > b.amount;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
                  {Icon && <Icon size={16} style={{ color }} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{b.category?.name}</span>
                    <span className={`text-xs ${overBudget ? "text-[var(--color-expense)]" : "text-[var(--color-text-secondary)]"}`}>
                      {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: overBudget ? "var(--color-expense)" : color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(b.pct * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + 0.1 * i }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: RecentTransactions (last 5, staggered)**

Create `src/components/home/recent-transactions.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { TransactionItem } from "@/components/ui/transaction-item";
import { mockTransactions } from "@/lib/mock-data";

export function RecentTransactions() {
  const recent = mockTransactions.slice(0, 5);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">ล่าสุด</p>
        <button className="text-xs text-[var(--color-text-muted)]">ดูทั้งหมด</button>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {recent.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <TransactionItem transaction={tx} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Assemble Home page**

Overwrite `src/app/page.tsx`:

```tsx
"use client";

import { PageTransition } from "@/components/layout/page-transition";
import { BalanceCard } from "@/components/home/balance-card";
import { SpendingTrendChart } from "@/components/home/spending-trend-chart";
import { CategoryBreakdownChart } from "@/components/home/category-breakdown-chart";
import { BudgetMiniCards } from "@/components/home/budget-mini-cards";
import { RecentTransactions } from "@/components/home/recent-transactions";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="space-y-4 p-4 pt-6">
        <BalanceCard />
        <SpendingTrendChart />
        <CategoryBreakdownChart />
        <BudgetMiniCards />
        <RecentTransactions />
      </div>
    </PageTransition>
  );
}
```

- [ ] **Step 7: Verify home page renders**

```bash
pnpm dev
```

Expected: Dashboard with animated balance card, trend chart, category pie, budget cards, recent transactions. All numbers animate on load. Kill server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: home dashboard — balance card, charts, budgets, recent transactions"
```

---

## Task 8: Add Transaction Bottom Sheet

**Files:**
- Create: `src/components/add/add-transaction-sheet.tsx`
- Modify: `src/components/layout/bottom-nav.tsx` (wire AddTransactionSheet)

**Interfaces:**
- Consumes: `BottomSheet`, `SegmentedControl`, `Button` from Task 5
- Produces: full add-transaction modal with category grid

- [ ] **Step 1: Write AddTransactionSheet**

Create `src/components/add/add-transaction-sheet.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { mockCategories, mockWallets } from "@/lib/mock-data";
import { mockTransactions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

interface AddTransactionSheetProps {
  open: boolean;
  onClose: () => void;
}

export function AddTransactionSheet({ open, onClose }: AddTransactionSheetProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState(mockWallets[0]?.id ?? "");
  const [note, setNote] = useState("");

  const categories = mockCategories.filter((c) => c.type === type);

  const handleSave = () => {
    // Phase 1: just add to mock array (non-persistent)
    const newTx = {
      id: `t${mockTransactions.length + 1}`,
      type,
      amount: parseFloat(amount) || 0,
      categoryId: categoryId ?? categories[0]!.id,
      walletId,
      date: new Date().toISOString(),
      note,
      tags: [],
    };
    mockTransactions.unshift(newTx);
    setAmount("");
    setCategoryId(null);
    setNote("");
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="เพิ่มรายการ">
      <div className="space-y-4 p-6">
        <SegmentedControl<TransactionType>
          segments={[
            { value: "expense", label: "รายจ่าย" },
            { value: "income", label: "รายรับ" },
            { value: "transfer", label: "โอนย้าย" },
          ]}
          value={type}
          onChange={(v) => { setType(v); setCategoryId(null); }}
        />

        {/* Amount input */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl text-[var(--color-text-secondary)]">฿</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-40 bg-transparent text-center text-4xl font-bold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
          </div>
        </div>

        {/* Category grid */}
        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">หมวดหมู่</p>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon];
              const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
              const selected = categoryId === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-2.5",
                    selected ? "border-[var(--color-text-primary)]" : "border-[var(--color-border)]"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
                    {Icon && <Icon size={16} style={{ color }} />}
                  </div>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Wallet selector */}
        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">กระเป๋าเงิน</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {mockWallets.map((w) => (
              <button
                key={w.id}
                onClick={() => setWalletId(w.id)}
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-2 text-sm",
                  walletId === w.id ? "border-[var(--color-text-primary)]" : "border-[var(--color-border)]"
                )}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <input
          type="text"
          placeholder="หมายเหตุ"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
        />

        <Button onClick={handleSave} className="w-full">
          บันทึก
        </Button>
      </div>
    </BottomSheet>
  );
}
```

- [ ] **Step 2: Wire into BottomNav**

Update `src/components/layout/bottom-nav.tsx`:
- Add import: `import { AddTransactionSheet } from "@/components/add/add-transaction-sheet";`
- Replace the `AddTransactionSheetLazy` placeholder with: `<AddTransactionSheet open={addOpen} onClose={() => setAddOpen(false)} />`

- [ ] **Step 3: Verify add sheet works**

```bash
pnpm dev
```

Expected: Tap center "+" button → bottom sheet slides up with spring → select type/category/wallet → type amount → tap "บันทึก" → sheet closes. Kill server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add transaction bottom sheet with category grid"
```

---

## Task 9: Transactions Page

**Files:**
- Create: `src/components/transactions/transaction-filters.tsx`, `src/components/transactions/transaction-list.tsx`
- Modify: `src/app/transactions/page.tsx`

- [ ] **Step 1: TransactionFilters (chip filters)**

Create `src/components/transactions/transaction-filters.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

type FilterType = "all" | TransactionType;

interface TransactionFiltersProps {
  type: FilterType;
  onTypeChange: (t: FilterType) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export function TransactionFilters({ type, onTypeChange, search, onSearchChange }: TransactionFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="ค้นหา..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      <SegmentedControl<FilterType>
        segments={[
          { value: "all", label: "ทั้งหมด" },
          { value: "expense", label: "รายจ่าย" },
          { value: "income", label: "รายรับ" },
        ]}
        value={type}
        onChange={onTypeChange}
      />
    </div>
  );
}
```

- [ ] **Step 2: TransactionList (grouped by date, staggered)**

Create `src/components/transactions/transaction-list.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { TransactionItem } from "@/components/ui/transaction-item";
import { formatRelativeDate } from "@/lib/utils";
import type { Transaction } from "@/types";

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  // Group by date string
  const groups = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const key = formatRelativeDate(tx.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});

  if (transactions.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">ไม่พบรายการ</p>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(groups).map(([dateLabel, items], groupIdx) => (
        <div key={dateLabel}>
          <div className="sticky top-0 z-10 bg-[var(--color-bg)] py-2">
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">{dateLabel}</p>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {items.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
              >
                <TransactionItem transaction={tx} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Assemble Transactions page**

Overwrite `src/app/transactions/page.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { mockTransactions } from "@/lib/mock-data";

type FilterType = "all" | "income" | "expense";

export default function TransactionsPage() {
  const [type, setType] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockTransactions.filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (search && !tx.note.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [type, search]);

  return (
    <PageTransition>
      <div className="space-y-4 p-4 pt-6">
        <h1 className="text-xl font-bold">รายการทั้งหมด</h1>
        <TransactionFilters type={type} onTypeChange={setType} search={search} onSearchChange={setSearch} />
        <TransactionList transactions={filtered} />
      </div>
    </PageTransition>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: transactions page with filters and grouped list"
```

---

## Task 10: Reports Page

**Files:**
- Create: `src/components/reports/overview-tab.tsx`, `src/components/reports/budgets-tab.tsx`, `src/components/reports/goals-tab.tsx`
- Modify: `src/app/reports/page.tsx`

- [ ] **Step 1: OverviewTab (income vs expense bar chart + category pie + trend line)**

Create `src/components/reports/overview-tab.tsx`:

```tsx
"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { CategoryBreakdownChart } from "@/components/home/category-breakdown-chart";
import { getMonthIncome, getMonthExpense } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function OverviewTab() {
  const income = getMonthIncome();
  const expense = getMonthExpense();

  const data = [
    { name: "รายรับ", amount: income, fill: "var(--color-income)" },
    { name: "รายจ่าย", amount: expense, fill: "var(--color-expense)" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <p className="mb-3 text-sm font-medium text-[var(--color-text-secondary)]">เปรียบเทียบรายเดือน</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-between text-xs text-[var(--color-text-secondary)]">
          <span>รายรับ: {formatCurrency(income)}</span>
          <span>รายจ่าย: {formatCurrency(expense)}</span>
        </div>
      </Card>
      <CategoryBreakdownChart />
    </div>
  );
}
```

- [ ] **Step 2: BudgetsTab (all budgets with progress bars + status)**

Create `src/components/reports/budgets-tab.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { mockBudgets, getCategoryById, getCategorySpending } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function BudgetsTab() {
  const budgets = mockBudgets.map((b) => {
    const cat = getCategoryById(b.categoryId);
    const spent = getCategorySpending(b.categoryId);
    return { ...b, category: cat, spent, pct: spent / b.amount, over: spent > b.amount };
  });

  return (
    <div className="space-y-3">
      {budgets.map((b, i) => {
        const Icon = b.category ? CATEGORY_ICONS[b.category.icon] : null;
        const color = b.category ? CATEGORY_COLORS[b.category.icon] : "#525252";
        return (
          <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
                  {Icon && <Icon size={18} style={{ color }} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{b.category?.name}</span>
                    <span className={`text-xs ${b.over ? "text-[var(--color-expense)]" : "text-[var(--color-text-secondary)]"}`}>
                      {b.over ? "เกินงบ" : `เหลือ ${formatCurrency(b.amount - b.spent)}`}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: b.over ? "var(--color-expense)" : color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(b.pct * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + 0.05 * i }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
                    <span>{formatCurrency(b.spent)}</span>
                    <span>{formatCurrency(b.amount)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: GoalsTab (savings goals with progress rings)**

Create `src/components/reports/goals-tab.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { mockGoals } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function GoalsTab() {
  return (
    <div className="space-y-3">
      {mockGoals.map((goal, i) => {
        const Icon = CATEGORY_ICONS[goal.icon] ?? CATEGORY_ICONS.savings;
        const color = CATEGORY_COLORS[goal.icon] ?? "#a855f7";
        const pct = goal.currentAmount / goal.targetAmount;

        return (
          <motion.div key={goal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card>
              <div className="flex items-center gap-4">
                <ProgressRing progress={pct} size={64} color={color}>
                  <Icon size={20} style={{ color }} />
                </ProgressRing>
                <div className="flex-1">
                  <p className="text-sm font-medium">{goal.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                  {goal.deadline && (
                    <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                      เป้าหมาย: {new Date(goal.deadline).toLocaleDateString("th-TH")}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold" style={{ color }}>
                  {Math.round(pct * 100)}%
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Assemble Reports page**

Overwrite `src/app/reports/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { OverviewTab } from "@/components/reports/overview-tab";
import { BudgetsTab } from "@/components/reports/budgets-tab";
import { GoalsTab } from "@/components/reports/goals-tab";

type Tab = "overview" | "budgets" | "goals";

export default function ReportsPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <PageTransition>
      <div className="space-y-4 p-4 pt-6">
        <h1 className="text-xl font-bold">รายงาน</h1>
        <SegmentedControl<Tab>
          segments={[
            { value: "overview", label: "ภาพรวม" },
            { value: "budgets", label: "งบประมาณ" },
            { value: "goals", label: "เป้าหมาย" },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === "overview" && <OverviewTab />}
        {tab === "budgets" && <BudgetsTab />}
        {tab === "goals" && <GoalsTab />}
      </div>
    </PageTransition>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: reports page — overview, budgets, goals tabs"
```

---

## Task 11: Settings Page

**Files:**
- Create: `src/components/settings/wallet-list.tsx`, `src/components/settings/category-list.tsx`
- Modify: `src/app/settings/page.tsx`

- [ ] **Step 1: WalletList (manage wallets)**

Create `src/components/settings/wallet-list.tsx`:

```tsx
"use client";

import { Card } from "@/components/ui/card";
import { CATEGORY_ICONS } from "@/lib/constants";
import { mockWallets } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function WalletList() {
  return (
    <div className="space-y-2">
      {mockWallets.map((w) => {
        const Icon = CATEGORY_ICONS[w.icon] ?? CATEGORY_ICONS.cash;
        return (
          <Card key={w.id} className="flex items-center gap-3 py-3" hoverable>
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${w.color}22` }}>
              <Icon size={18} style={{ color: w.color }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{w.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{w.type}</p>
            </div>
            <span className="text-sm font-semibold">{formatCurrency(w.openingBalance)}</span>
          </Card>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: CategoryList (manage categories)**

Create `src/components/settings/category-list.tsx`:

```tsx
"use client";

import { Card } from "@/components/ui/card";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { mockCategories } from "@/lib/mock-data";

export function CategoryList() {
  const expense = mockCategories.filter((c) => c.type === "expense");
  const income = mockCategories.filter((c) => c.type === "income");

  const renderCategory = (id: string) => {
    // Helper inline
    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">รายจ่าย</p>
        <div className="space-y-1">
          {expense.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
            return (
              <div key={cat.id} className="flex items-center gap-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
                  {Icon && <Icon size={14} style={{ color }} />}
                </div>
                <span className="text-sm">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">รายรับ</p>
        <div className="space-y-1">
          {income.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
            return (
              <div key={cat.id} className="flex items-center gap-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${color}22` }}>
                  {Icon && <Icon size={14} style={{ color }} />}
                </div>
                <span className="text-sm">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Assemble Settings page**

Overwrite `src/app/settings/page.tsx`:

```tsx
"use client";

import { PageTransition } from "@/components/layout/page-transition";
import { Card } from "@/components/ui/card";
import { WalletList } from "@/components/settings/wallet-list";
import { CategoryList } from "@/components/settings/category-list";
import { useI18n } from "@/i18n/config";
import { Globe, Download, LogOut } from "lucide-react";
import type { Locale } from "@/i18n/config";

export default function SettingsPage() {
  const { locale, setLocale } = useI18n();

  return (
    <PageTransition>
      <div className="space-y-6 p-4 pt-6">
        <h1 className="text-xl font-bold">ตั้งค่า</h1>

        {/* Profile */}
        <Card className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-lg font-bold">
            จ
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">ผู้ใช้ทดสอบ</p>
            <p className="text-xs text-[var(--color-text-secondary)]">user@example.com</p>
          </div>
        </Card>

        {/* Language */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)] flex items-center gap-2">
            <Globe size={14} /> ภาษา
          </p>
          <div className="flex gap-2">
            {(["th", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm ${
                  locale === l
                    ? "border-[var(--color-text-primary)] text-[var(--color-text-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                }`}
              >
                {l === "th" ? "ไทย" : "English"}
              </button>
            ))}
          </div>
        </div>

        {/* Wallets */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">กระเป๋าเงิน</p>
          <WalletList />
        </div>

        {/* Categories */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">หมวดหมู่</p>
          <CategoryList />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm">
            <Download size={16} /> ส่งออกข้อมูล
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--color-expense)]">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: settings page — profile, language, wallets, categories, actions"
```

---

## Task 12: Final Polish + Verification

**Files:**
- Modify: various — check all transitions, fix any TypeScript errors, verify all pages

- [ ] **Step 1: Run TypeScript check**

```bash
pnpm exec tsc --noEmit
```

Expected: zero errors. Fix any type issues found.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: zero errors. Fix any lint issues.

- [ ] **Step 3: Run dev server and visual QA**

```bash
pnpm dev
```

Check each page:
- `/` Home: balance animates up, charts render, budget bars animate, recent transactions stagger in
- `/transactions` Filter + search work, list grouped by date, items animate
- Bottom nav: active indicator slides between tabs, center "+" opens sheet
- Add sheet: slides up with spring, drag down to dismiss, category grid tappable
- `/reports` All 3 tabs switch with animated indicator, charts/budgets/goals render
- `/settings` Language toggle switches TH/EN live, wallet/category lists render

- [ ] **Step 4: Fix the BottomNav pathname sync**

The BottomNav uses `window.location.href` for navigation which causes full page reloads. Replace with Next.js `useRouter`:

Update `src/components/layout/bottom-nav.tsx`:
- Add: `import { useRouter, usePathname } from "next/navigation";`
- Replace `const [activePath, setActivePath] = useState("/")` with `const pathname = usePathname()`
- Replace `window.location.href = item.href` with `router.push(item.href)`
- Use `pathname === item.href` for active state

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "polish: fix navigation, TypeScript errors, final animation tweaks"
```

- [ ] **Step 6: Tag Phase 1 complete**

```bash
git tag phase1-prototype
git log --oneline
```

Expected: see ~12 commits showing the full build progression.
