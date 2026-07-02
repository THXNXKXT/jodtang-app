<div align="center">

# 💰 จดตัง · Jodtang

### Mobile-first Personal Finance PWA

จดบันทึกรายรับ-รายจ่าย ตั้งงบประมาณ ออมเป้าหมาย และรับรายงานอัตโนมัติผ่าน LINE — ทุกบัญชีแยกข้อมูลอิสระ (multi-user data isolation)

**License:** © THXNXKXT. All rights reserved.

</div>

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict mode) |
| **UI** | React 19 + Tailwind CSS v4 + Framer Motion |
| **Database** | Neon (Serverless PostgreSQL) + Drizzle ORM |
| **Auth** | Better-Auth (email + password, rate limited) |
| **Validation** | Zod schemas (every mutation) |
| **Charts** | Recharts |
| **i18n** | Custom provider (TH/EN, real-time switch) |
| **Icons** | lucide-react |
| **Notifications** | LINE Messaging API (push daily/monthly reports) |
| **Deploy** | Vercel + Vercel Cron |
| **Package Manager** | pnpm |

---

## ✨ Core Features

### การเงิน
- **ธุรกรรม** — บันทึกรายรับ/รายจ่าย พร้อมหมวดหมู่และกระเป๋าเงิน
- **งบประมาณรายเดือน** — ตั้งวงเงินต่อหมวดหมู่ เลื่อนดูประวัติย้อนหลัง
- **เป้าหมายออม** — ตั้งเป้าหมาย เติมเงิน ติดตามด้วย Progress Ring
- **กระเป๋าเงิน** — หลายกระเป๋า (เงินสด บัญชี อิเล็กตรอนิกส์)

### รายงาน & กราฟ
- **แดชบอร์ด** — ภาพรวมยอดคงเหลือ รายรับ-รายจ่าย งบประมาณ
- **กราฟแนวโน้ม** — ยอดรายวัน 7 วัน พร้อม AnimatedNumber
- **สัดส่วนรายจ่าย** — Pie chart ตามหมวดหมู่

### การแจ้งเตือน LINE
- **รายงานรายวัน** — ส่งสรุปธุรกรรมทุกเที่ยงคืน ICT
- **รายงานรายเดือน** — ส่งสรุปรายรับ-รายจ่ายทุกวันที่ 1
- **เชื่อมต่อง่าย** — เพิ่มบอทเป็นเพื่อน → ส่งรหัส 8 หลัก → เสร็จ (หมดอายุ 5 นาที)

### อื่นๆ
- **2 ภาษา** — ไทย / English เปลี่ยนได้ในแอปแบบ real-time
- **3 โหมดธีม** — Dark / Light / System (กัน FOUC)
- **โปรไฟล์** — อวตาร DiceBear (10 แบบ) หรืออัพโหลดเอง
- **Multi-user** — แยกข้อมูลอิสระต่อบัญชี

---

## 🏗 Architecture & Security

> - **Ownership checks:** ทุก query มี `and(eq(id), eq(userId))` — ไม่มีทางเห็นข้อมูลคนอื่น
> - **Zod validation:** ทุก input ผ่าน schema validation ก่อนเข้า DB
> - **Rate limiting:** ป้องกัน brute force บน auth endpoints
> - **Proxy/middleware:** redirect unauthenticated users ไป /login
> - **Error handling:** try/catch ทุก server action + ErrorBoundary

```
User Browser
    |
Next.js App Router
    |-- Server Actions (CRUD, Zod validated, userId scoped)
    |-- API Routes
    |   |-- /api/auth/*        (Better-Auth)
    |   |-- /api/line/webhook  (LINE bot PIN matching)
    |   |-- /api/cron/daily    (Vercel Cron: midnight ICT)
    |   |-- /api/cron/monthly  (Vercel Cron: 1st of month)
    |
Drizzle ORM
    |
Neon PostgreSQL (Serverless)
    |
LINE Messaging API (push reports)
```

---

## 🚀 Quick Start

**Prerequisites:** Node.js 18+, pnpm, Neon database account.

```bash
# Clone & install
git clone https://github.com/THXNXKXT/jodtang-app.git
cd jodtang-app
pnpm install

# Configure environment
cp .env.example .env.local   # or create manually (see below)

# Create database tables
npx drizzle-kit push

# Run!
pnpm dev
```

**Required Environment Variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Session encryption secret |
| `BETTER_AUTH_URL` | Yes | App URL (localhost:3000 or production) |
| `LINE_CHANNEL_ACCESS_TOKEN` | Optional | LINE Messaging API token |
| `CRON_SECRET` | Optional | Protects cron endpoints |

---

## 📡 API Reference

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/*` | GET, POST | Better-Auth (login, signup, session) |
| `/api/line/webhook` | POST | LINE bot webhook (follow + PIN matching) |
| `/api/cron/daily` | GET | Daily LINE report (Vercel Cron, midnight ICT) |
| `/api/cron/monthly` | GET | Monthly LINE report (Vercel Cron, 1st of month) |

> CRUD operations use **Server Actions** (not REST routes) — typed, validated, userId-scoped.

---

## 📁 Project Structure

```text
src/
|-- app/
|   |-- (auth)/              # login + signup pages
|   |-- api/
|   |   |-- auth/[...all]/   # Better-Auth handler
|   |   |-- cron/daily/      # LINE daily report
|   |   |-- cron/monthly/    # LINE monthly report
|   |   `-- line/webhook/    # LINE bot webhook
|   |-- home/                # dashboard
|   |-- transactions/        # transaction list
|   |-- reports/             # budgets + goals + charts
|   `-- settings/            # profile + theme + LINE
|-- components/
|   |-- add/                 # add transaction sheet
|   |-- home/                # balance, charts, mini cards
|   |-- layout/              # app shell + bottom nav
|   |-- reports/             # budget/goal tabs + sheets
|   |-- settings/            # profile, wallet, LINE
|   |-- svg/                 # logo, add button, avatars
|   |-- theme/               # theme provider + toggle
|   `-- ui/                  # primitives (card, sheet, etc)
|-- i18n/                    # TH/EN messages + provider
|-- lib/                     # utils, env, data-provider
|-- server/
|   |-- actions/             # wallets, categories, transactions...
|   |-- db/                  # drizzle schema + connection
|   `-- validations/         # Zod schemas
`-- proxy.ts                 # auth middleware
```

---

## 📷 Screenshots

> Screenshots coming soon.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `npx tsc --noEmit` | Type check |
| `npx drizzle-kit push` | Push schema to database |

---

## 📐 LINE Bot Setup

<details>
<summary><b>คลิกเพื่อดูวิธีตั้งค่า</b></summary>

1. สร้าง LINE Official Account ที่ [manager.line.biz](https://manager.line.biz)
2. เปิด **Messaging API** ในการตั้งค่า
3. ไปที่ [LINE Developers Console](https://developers.line.biz/console) → Messaging API channel
4. **Channel access token (long-lived)** → Issue → คัดลอก
5. ตั้ง Webhook URL: `https://your-domain/api/line/webhook`
6. เปิด **Use webhook** = ON
7. ปิด Auto-reply และ Greeting messages
8. ใส่ token ใน `.env.local`: `LINE_CHANNEL_ACCESS_TOKEN=...`

**สำหรับ Dev (ngrok):**
```bash
ngrok http 3000
# ใส่ URL ใน Webhook + trustedOrigins (auth.ts) + allowedDevOrigins (next.config.ts)
```

</details>

---

## 🚀 Deployment (Vercel)

```bash
pnpm build    # verify production build
vercel        # deploy
```

เพิ่ม Environment Variables ใน Vercel Dashboard → Settings → Environment Variables (see table above).

> Cron: รายวัน `0 17 * * *` (00:00 ICT) · รายเดือน `0 17 1 * *` (วันที่ 1)

---

<div align="center">

## License

© THXNXKXT. All rights reserved.

</div>
