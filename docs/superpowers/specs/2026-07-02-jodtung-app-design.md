# Jodtung-app Design Spec

> **Jodtung** (จดทุก) = "record everything" — a mobile-first personal finance PWA

## Goal

Build a mobile-first, multi-user income/expense tracking web app with comprehensive features: multi-wallet, budgets, savings goals, recurring transactions, visual reports, and PWA offline support. Beautiful UI with fluid motion. Frontend-first delivery so the user can see and feel the product before backend wiring.

## Architecture

Next.js 16 (App Router, Server Components, Server Actions) monolith. PostgreSQL on Neon (serverless) accessed via Drizzle ORM. Authentication via Better-Auth (email/password + Google OAuth). PWA layer with next-pwa for installability and basic offline caching. State management via React Server Components + Client Components with optimistic updates on Server Actions.

**Approach A (Standard):** Server-rendered with PWA caching + optimistic UI. Offline support is page-level caching + action queuing, not a full IndexedDB sync engine. This keeps complexity moderate while leveraging a stack the user already knows from AquaVolt.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Runtime | React | 19.x |
| Database | Neon PostgreSQL (serverless) | — |
| ORM | Drizzle ORM + drizzle-kit | 0.45+ |
| Auth | Better-Auth | 1.6+ |
| Validation | Zod | 4.x |
| Forms | react-hook-form + @hookform/resolvers | latest |
| Styling | Tailwind CSS v4 + class-variance-authority + tailwind-merge | 4.x |
| Icons | lucide-react (NO emojis anywhere) | latest |
| Animation | Framer Motion | 12.x |
| Charts | Recharts | 3.x |
| i18n | next-intl (TH/EN) | 4.x |
| PWA | next-pwa or @ducanh2912/next-pwa | latest |
| Date utils | date-fns | 4.x |
| Package manager | pnpm | latest |
| Deploy | Vercel + Neon | — |

## Feature Scope

### Core Features (Full "comprehensive" set)

1. **Transactions** — Record income/expense/transfer. Fields: amount, type, category, wallet, date, note, tags. Quick-add from any screen.
2. **Multi-Wallet** — Multiple accounts (cash, bank, e-wallet). Each has a name, type, icon, opening balance, and currency field (THB default, schema supports multi-currency).
3. **Categories** — Custom income/expense categories with icon + color. Pre-seeded defaults.
4. **Budgets** — Monthly budget per category. Progress bar + warning when approaching/exceeding limit.
5. **Savings Goals** — Named targets with target amount + deadline. Progress tracking with contribution log.
6. **Recurring Transactions** — Auto-create transactions on schedule (daily/weekly/monthly). CRUD + toggle active/paused.
7. **Dashboard** — Net worth summary, today's balance, spending trend chart, category breakdown (pie), recent transactions, budget status mini-cards.
8. **Reports** — Monthly/yearly summaries, category breakdown, income vs expense comparison, trend line charts. Filterable by date range and wallet.
9. **Export** — CSV and Excel (.xlsx) export of transactions.
10. **PWA** — Installable on mobile, basic offline caching, app-like experience.
11. **i18n** — Thai and English, toggle in settings.
12. **Settings** — Profile, wallets, categories, preferences (language, theme, default currency), data export/import.

### Out of Scope (MVP / future)

- Multi-currency conversion (schema ready, UI not built)
- Receipt/photo scanning (OCR)
- Bank API integration (Open Banking)
- Social/sharing features
- Push notifications (can add later)

## Design Principles

1. **Mobile-first, always.** Every screen designed for 375px width first, scales up to desktop.
2. **No emojis.** Use lucide-react icons exclusively for all iconography.
3. **Fluid motion.** Framer Motion spring animations on every interactive element: page transitions (shared layout), tab bar, modals/sheets (bottom sheet slide-up), list item entrance (staggered), button press (scale spring), number count-up animations for balances.
4. **Monochrome minimal aesthetic.** Per user's design taste: greyscale palette, no loud brand colors. Income/expense distinguished by subtle accent (green tint for income, red tint for expense — muted, not neon).
5. **Bottom sheet pattern.** Mobile-native feel: modals slide from bottom, swipe-to-dismiss, backdrop blur.
6. **Thumb-friendly.** Primary actions in bottom half of screen. Floating action button for quick-add.

## UI Structure

### Navigation: Bottom Tab Bar (fixed, safe-area aware)

| Tab | Icon (lucide) | Route | Purpose |
|-----|---------------|-------|---------|
| Home | `LayoutDashboard` | `/` | Dashboard: balance, charts, recent activity |
| Transactions | `ReceiptText` | `/transactions` | Full transaction history, filter/search |
| Add | `Plus` (elevated center button) | `/add` (bottom sheet) | Quick-add transaction modal |
| Reports | `BarChart3` | `/reports` | Charts, budgets, savings goals |
| Settings | `Settings` | `/settings` | Wallets, categories, profile, preferences |

### Page Descriptions

**Home (Dashboard)**
- Top: Greeting + current month net balance (animated count-up)
- Net balance card: total income, total expense, net (horizontal bars)
- Spending trend: 7-day mini area chart
- Category breakdown: top 5 categories (pie chart + legend)
- Budget mini-cards: 3 budgets nearest to limit
- Recent transactions: last 5 items (slide-in stagger)

**Transactions**
- Search bar + filter chips (type, category, wallet, date range)
- Grouped by date (sticky date headers)
- Infinite scroll / pagination
- Swipe-to-delete (animated)

**Add (Bottom Sheet)**
- Segmented control: Expense / Income / Transfer
- Amount input (large, centered, number keypad on mobile)
- Category grid (icon + label, tap to select)
- Wallet selector
- Date picker
- Note field
- Save button (spring animation on press)

**Reports**
- Tab switcher: Overview / Budgets / Goals
- Overview: monthly bar chart (income vs expense), category pie, trend line
- Budgets: list of category budgets with progress bars + status badges
- Goals: list of savings goals with circular progress + contribute button

**Settings**
- Profile section (avatar, name, email)
- Wallets list (manage: add/edit/delete/reorder)
- Categories list (manage: add/edit/delete)
- Preferences: language toggle (TH/EN), theme (system/light/dark)
- Data: export CSV, export Excel
- Account: sign out, delete account

## Data Model (High-Level)

```
users (from Better-Auth)
wallets: id, userId, name, type (cash|bank|ewallet), icon, color, openingBalance, currency, sortOrder, createdAt
categories: id, userId, name, type (income|expense), icon, color, sortOrder, createdAt
transactions: id, userId, walletId, categoryId, type (income|expense|transfer), amount, note, tags[], date, toWalletId? (for transfers), recurringId?, createdAt
budgets: id, userId, categoryId, amount, period (monthly), startDate, active, createdAt
savings_goals: id, userId, name, targetAmount, currentAmount, deadline, icon, createdAt
savings_contributions: id, goalId, amount, date, note, createdAt
recurring_transactions: id, userId, walletId, categoryId, type, amount, note, frequency (daily|weekly|monthly), nextDate, active, createdAt
```

All tables include `userId` for multi-tenant data isolation. RLS-equivalent enforced at the application layer (every query scoped by `session.userId`).

## Color System (Monochrome + Subtle Accents)

- Background: `#0a0a0a` (dark) / `#fafafa` (light)
- Surface: `#141414` / `#ffffff`
- Border: `#262626` / `#e5e5e5`
- Text primary: `#fafafa` / `#0a0a0a`
- Text secondary: `#a3a3a3` / `#737373`
- Income accent: `#22c55e` at 80% opacity (muted green)
- Expense accent: `#ef4444` at 80% opacity (muted red)
- Transfer: `#3b82f6` at 60% opacity (muted blue)
- All other UI: greyscale only

## Motion System (Framer Motion)

| Element | Animation |
|---------|-----------|
| Page transition | Fade + slide-up, 300ms spring (stiffness 300, damping 30) |
| Bottom sheet | Slide from bottom, spring (stiffness 400, damping 35), backdrop fade |
| Tab bar active indicator | `layoutId` shared transition |
| List items | Staggered fade-in, 50ms delay per item |
| Buttons | `whileTap: scale(0.97)`, spring |
| Balance numbers | Animated count-up on mount (use `animate` + `useMotionValue`) |
| Budget/goal progress | Animated width/circle on mount |
| Pull-to-refresh | Drag down -> spinner -> bounce back |

## Frontend-First Delivery Strategy

Since the user wants to see the UI before backend, we build in phases:

**Phase 1: Visual Prototype (Frontend only)**
- Scaffold Next.js with Tailwind + Framer Motion + lucide-react
- Build all 5 main screens with mock data (hardcoded/seeded)
- Implement bottom tab navigation with page transitions
- Build the Add bottom sheet with category grid
- Implement charts with mock data (Recharts)
- Wire up i18n (TH/EN)
- Polish all motion and interactions
- Goal: user can click through the entire app and feel the product

**Phase 2: Backend Wiring**
- Set up Neon + Drizzle schema + migrations
- Better-Auth setup (email/password + Google)
- Server Actions for all CRUD operations
- Replace mock data with real queries
- Data isolation (userId scoping)
- Recurring transaction logic

**Phase 3: Advanced Features**
- Budget calculations + alerts
- Savings goals progress
- Export (CSV/Excel)
- PWA setup (manifest, service worker, offline caching)
- Deploy to Vercel + Neon

## Error Handling

- Form validation: Zod schemas, inline error messages, react-hook-form
- Server Action errors: `useActionState` + toast notifications (react-hot-toast)
- Network errors: optimistic UI rollback + toast
- Loading states: skeleton screens (not spinners) for initial page loads
- Empty states: illustrated (icon-based, no emoji) with helpful copy

## Testing Strategy

- Unit tests: utility functions, calculations (Vitest)
- Component tests: interactive components (Vitest + Testing Library)
- E2E: critical flows (add transaction, create wallet, set budget) — Playwright (Phase 2+)
- Visual: manual review against design principles after Phase 1

## Constraints

- **No emojis** in UI code, copy, or design. lucide-react icons only.
- **Mobile-first**: design for 375px first, enhance for larger screens.
- **THB only** in Phase 1-2; schema must have `currency` field for future expansion.
- **pnpm** as package manager.
- **No `any` types** — strict TypeScript throughout.
- **Monochrome aesthetic** — greyscale palette, subtle accent colors only for income/expense.
- **Smooth motion everywhere** — no abrupt transitions.
