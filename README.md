<div align="center">

# จดตัง · Jodtang

### Mobile-first Personal Finance PWA

จดบันทึกรายรับ-รายจ่าย ตั้งงบประมาณ ออมเป้าหมาย และรับรายงานอัตโนมัติผ่าน LINE

<br>

**Next.js 16** · **Neon PostgreSQL** · **Drizzle ORM** · **Better-Auth** · **Tailwind v4** · **Framer Motion**

<br>

[Features](#-ฟีเจอร์) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [LINE Bot](#-line-bot-setup) · [Deploy](#-deployment)

</div>

---

## ✦ ฟีเจอร์

### การเงิน
- **ธุรกรรม** — บันทึกรายรับ/รายจ่าย พร้อมหมวดหมู่และกระเป๋าเงิน
- **งบประมาณรายเดือน** — ตั้งวงเงินต่อหมวดหมู่ เลื่อนดูประวัติย้อนหลังได้
- **เป้าหมายออม** — ตั้งเป้าหมาย เพิ่มเงินเข้า ติดตามความคืบหน้า
- **กระเป๋าเงิน** — จัดการหลายกระเป๋า (เงินสด บัญชี กระเป๋าอิเล็กตรอนิกส์)

### รายงาน
- **แดชบอร์ด** — ภาพรวมยอดคงเหลือ รายรับ-รายจ่าย งบประมาณ
- **กราฟ** — แนวโน้ม 7 วัน สัดส่วนรายจ่ายตามหมวดหมู่
- **สรุปรายเดือน** — รายงานประจำเดือนอัตโนมัติ

### การแจ้งเตือน LINE
- **รายงานรายวัน** — ส่งสรุปธุรกรรมประจำวันทุกเที่ยงคืน
- **รายงานรายเดือน** — ส่งสรุปรายรับ-รายจ่ายประจำเดือนวันที่ 1
- **เชื่อมต่อง่าย** — เพิ่มบอทเป็นเพื่อน ส่งรหัส 6 หลัก เป็นอันใช้ได้

### อื่นๆ
- **2 ภาษา** — ไทย / English (เปลี่ยนได้ในแอป)
- **Dark / Light / System** — 3 โหมดธีม
- **โปรไฟล์** — เลือกอวตารจาก DiceBear หรืออัพโหลดเอง
- **Multi-user** — แต่ละบัญชีแยกข้อมูลอิสระ (data isolation)

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Neon (Serverless PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Better-Auth (email + password) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Charts | Recharts |
| i18n | next-intl pattern (TH/EN) |
| Icons | lucide-react |
| LINE | Messaging API (push message) |
| Deploy | Vercel |
| Package Manager | pnpm |

---

## ✦ Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Neon database account
- LINE Developers account (สำหรับ LINE bot)

### ติดตั้ง

```bash
git clone https://github.com/THXNXKXT/jodtang-app.git
cd jodtang-app
pnpm install
```

### Environment Variables

สร้าง `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Better-Auth
BETTER_AUTH_SECRET=your-secret-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# LINE Messaging API (optional)
LINE_CHANNEL_ACCESS_TOKEN=your-line-token

# Cron protection
CRON_SECRET=your-cron-secret
```

### รัน

```bash
pnpm dev
```

เปิด `http://localhost:3000`

### เชื่อมกับ Database

```bash
# สร้างตาราง
npx drizzle-kit push
```

---

## ✦ วิธีใช้งาน

### 1. สมัคร / เข้าสู่ระบบ
- หน้า `/signup` — กรอกชื่อ อีเมล รหัสผ่าน
- หน้า `/login` — เข้าสู่ระบบด้วยอีเมล + รหัสผ่าน

### 2. บันทึกธุรกรรม
- กดปุ่ม **+** กลางแท็บบาร์
- เลือกหมวดหมู่ → ใส่จำนวนเงิน → บันทึก
- ลาก sheet ลงเพื่อปิด

### 3. ตั้งงบประมาณ
- แท็บ **รายงาน** → **งบประมาณ**
- กด **+** เพื่อตั้งงบต่อหมวดหมู่
- แตะงบที่มีเพื่อแก้ไข/ลบ
- เลื่อนดูเดือนก่อนหน้าได้

### 4. ตั้งเป้าหมายออม
- แท็บ **รายงาน** → **เป้าหมาย**
- กด **+** ตั้งเป้าหมาย (ชื่อ + จำนวน)
- แตะเป้าหมายเพื่อเติมเงิน/ลบ

### 5. เชื่อมต่อ LINE
- หน้า **ตั้งค่า** → **เชื่อมต่อ LINE**
- เพิ่มเพื่อน LINE [@071fddut](https://line.me/R/ti/p/@071fddut)
- ส่งรหัส 8 หลักไปยังบอท (หมดอายุใน 5 นาที)
- เลือกรับรายงาน: รายวัน / รายเดือน / ปิด

### 6. แก้ไขโปรไฟล์
- หน้า **ตั้งค่า** → แตะการ์ดผู้ใช้
- เปลี่ยนชื่อ, เลือกอวตาร DiceBear, หรืออัพโหลดเอง

---

## ✦ LINE Bot Setup

### สร้าง LINE Official Account

1. ไป [LINE Official Account Manager](https://manager.line.biz) → สมัคร
2. สร้างบัญชีใหม่ (เช่น "Jodtang")
3. เปิด **Messaging API** ในการตั้งค่า

### เอา Channel Access Token

1. ไป [LINE Developers Console](https://developers.line.biz/console)
2. เลือก Messaging API channel
3. แท็บ **Messaging API** → **Channel access token (long-lived)** → **Issue**
4. คัดลอก token ใส่ใน `.env.local`

### ตั้งค่า Webhook

- Webhook URL: `https://your-domain/api/line/webhook`
- เปิด **Use webhook** = ON
- ปิด **Auto-reply messages** และ **Greeting messages**

> สำหรับ dev ใช้ [ngrok](https://ngrok.com): `ngrok http 3000` แล้วเอา URL ใส่ใน webhook

---

## ✦ สถาปัตยกรรม

```
User Browser
    ↓
Next.js App Router (Server Actions + API Routes)
    ├── Better-Auth (/api/auth/*)
    ├── LINE Webhook (/api/line/webhook)
    ├── Cron Jobs (/api/cron/daily, /api/cron/monthly)
    └── Server Actions (CRUD scoped by userId)
            ↓
        Drizzle ORM → Neon PostgreSQL
            ↓
        LINE Messaging API (push messages)
```

### Security
- ทุก mutation มี **ownership check** (`and(eq(id), eq(userId))`)
- **Zod validation** ทุก input
- **try/catch** ทุก server action
- **Rate limiting** สำหรับ auth endpoints
- **Proxy/middleware** ป้องกัน unauthorized access

---

## ✦ Deployment (Vercel)

```bash
# สร้าง production build
pnpm build

# Deploy
vercel
```

### Vercel Environment Variables
เพิ่มใน Vercel Dashboard → Settings → Environment Variables:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (domain จริง)
- `LINE_CHANNEL_ACCESS_TOKEN`
- `CRON_SECRET`

> Cron jobs ทำงานอัตโนมัติผ่าน `vercel.json` — ส่งรายวันเที่ยงคืน ICT, รายเดือนวันที่ 1

---

## ✦ Project Structure

```
src/
├── app/
│   ├── (auth)/           # login, signup pages
│   ├── api/
│   │   ├── auth/         # Better-Auth handler
│   │   ├── cron/         # daily + monthly LINE reports
│   │   └── line/         # LINE webhook
│   ├── home/             # dashboard
│   ├── transactions/     # transaction list
│   ├── reports/          # budgets + goals + charts
│   └── settings/         # profile + theme + LINE
├── components/
│   ├── add/              # add transaction sheet
│   ├── home/             # balance card, charts, mini cards
│   ├── layout/           # app shell, bottom nav
│   ├── reports/          # budgets/goals tabs + sheets
│   ├── settings/         # profile, wallet, LINE sections
│   ├── svg/              # logo, add button, avatars
│   ├── theme/            # theme provider + toggle
│   └── ui/               # primitives (card, sheet, etc.)
├── i18n/                 # messages + provider (TH/EN)
├── lib/                  # utils, env, data-provider
├── server/
│   ├── actions/          # server actions (wallets, categories, etc.)
│   ├── db/               # drizzle schema + connection
│   └── validations/      # Zod schemas
└── proxy.ts              # auth middleware
```

---

## ✦ Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `npx tsc --noEmit` | Type check |
| `npx drizzle-kit push` | Push schema to database |

---

<div align="center">

## License

© THXNXKXT. All rights reserved.

</div>
