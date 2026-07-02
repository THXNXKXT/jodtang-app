<div align="center">

# จดตัง · Jodtang

**Mobile-first Personal Finance PWA**

จดบันทึกรายรับ-รายจ่าย ตั้งงบประมาณ ออมเป้าหมาย และรับรายงานอัตโนมัติผ่าน LINE

<br>

<img alt="Next.js" src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
<img alt="Neon" src="https://img.shields.io/badge/Neon_Postgres-312E81?style=flat-square&logo=neon&logoColor=white">
<img alt="Tailwind" src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
<img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-FF0066?style=flat-square&logo=framer&logoColor=white">
<img alt="License" src="https://img.shields.io/badge/License-All_Rights_Reserved-6B7280?style=flat-square">

<br><br>

[ฟีเจอร์](#-ฟีเจอร์) · [Tech Stack](#-tech-stack) · [เริ่มต้นใช้งาน](#-เริ่มต้นใช้งาน) · [LINE Bot](#-line-bot-setup) · [Deploy](#-deployment-vercel)

</div>

---

## ✦ ฟีเจอร์

### การเงิน

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| ธุรกรรม | บันทึกรายรับ/รายจ่าย พร้อมหมวดหมู่และกระเป๋าเงิน |
| งบประมาณ | ตั้งวงเงินรายเดือนต่อหมวดหมู่ พร้อมดูประวัติย้อนหลัง |
| เป้าหมายออม | ตั้งเป้าหมาย เติมเงิน ติดตามความคืบหน้าด้วย Progress Ring |
| กระเป๋าเงิน | หลายกระเป๋า — เงินสด บัญชีธนาคาร กระเป๋าอิเล็กตรอนิกส์ |

### รายงาน & กราฟ

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| แดชบอร์ด | ภาพรวมยอดคงเหลือ รายรับ-รายจ่าย งบประมาณล่าสุด |
| กราฟแนวโน้ม | ยอดรายวัน 7 วัน พร้อม AnimatedNumber |
| สัดส่วนรายจ่าย | Pie chart แสดงสัดส่วนตามหมวดหมู่ |

### การแจ้งเตือน LINE

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| รายงานรายวัน | ส่งสรุปธุรกรรมทุกเที่ยงคืน ICT |
| รายงานรายเดือน | ส่งสรุปรายรับ-รายจ่ายทุกวันที่ 1 |
| เชื่อมต่อง่าย | เพิ่มบอทเป็นเพื่อน ส่งรหัส 8 หลัก เป็นอันใช้ได้ |

### อื่นๆ

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| 2 ภาษา | ไทย / English — เปลี่ยนได้ในแอปแบบ real-time |
| 3 โหมดธีม | Dark / Light / System — กัน FOUC |
| โปรไฟล์ | อวตาร DiceBear (10 แบบ) หรืออัพโหลดเอง |
| Multi-user | แยกข้อมูลอิสระต่อบัญชี (data isolation) |

---

## ✦ Tech Stack

<table>
<tr><td valign="top" width="50%">

**Frontend**
- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- Framer Motion
- Recharts
- lucide-react

</td><td valign="top" width="50%">

**Backend**
- Neon (Serverless PostgreSQL)
- Drizzle ORM
- Better-Auth (email + password)
- Server Actions + API Routes
- Zod validation
- Vercel Cron

</td></tr>
</table>

---

## ✦ เริ่มต้นใช้งาน

### สิ่งที่ต้องมี

- Node.js 18+
- pnpm
- Neon database account
- LINE Developers account *(สำหรับ LINE bot)*

### ติดตั้ง

```bash
git clone https://github.com/THXNXKXT/jodtang-app.git
cd jodtang-app
pnpm install
```

### Environment Variables

สร้าง `.env.local`:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=..._URL=http://localhost:3000

# LINE (optional)
LINE_CHANNEL_ACCESS_TOKEN=...

# Cron
CRON_SECRET=...
```

### รัน Development

```bash
pnpm dev                # start dev server
npx drizzle-kit push    # create database tables
```

เปิด `http://localhost:3000`

---

## ✦ วิธีใช้งานแอพ

**1. สมัคร / เข้าสู่ระบบ** — หน้า /signup หรือ /login กรอกอีเมล + รหัสผ่าน

**2. บันทึกธุรกรรม** — กดปุ่ม + กลางแท็บบาร์ → เลือกหมวดหมู่ → ใส่จำนวนเงิน → บันทึก (ลาก sheet ลงเพื่อปิด)

**3. ตั้งงบประมาณ** — แท็บรายงาน → งบประมาณ → กด + เลือกหมวดหมู่ + วงเงิน (เลื่อนดูเดือนก่อนหน้าได้)

**4. ตั้งเป้าหมายออม** — แท็บรายงาน → เป้าหมาย → กด + ตั้งชื่อ + จำนวน (แตะเป้าหมายเพื่อเติมเงิน/ลบ)

**5. เชื่อมต่อ LINE** — หน้าตั้งค่า → เชื่อมต่อ LINE → เพิ่มเพื่อน [@071fddut](https://line.me/R/ti/p/@071fddut) → ส่งรหัส → เลือกรายวัน/รายเดือน

**6. แก้ไขโปรไฟล์** — หน้าตั้งค่า → แตะการ์ดผู้ใช้ → เปลี่ยนชื่อ / เลือกอวตาร / อัพโหลด

---

## ✦ LINE Bot Setup

<details>
<summary><b>คลิกเพื่อดูวิธีตั้งค่า LINE Bot</b></summary>

#### 1. สร้าง LINE Official Account
- ไปที่ [LINE Official Account Manager](https://manager.line.biz) → สมัคร
- สร้างบัญชี (เช่น "Jodtang")
- เปิด **Messaging API** ในการตั้งค่า

#### 2. เอา Channel Access Token
- ไปที่ [LINE Developers Console](https://developers.line.biz/console)
- เลือก Messaging API channel → แท็บ **Messaging API**
- **Channel access token (long-lived)** → กด **Issue** → คัดลอก

#### 3. ตั้งค่า Webhook
- Webhook URL: `https://your-domain/api/line/webhook`
- เปิด **Use webhook** = ON
- ปิด **Auto-reply** และ **Greeting messages**

#### 4. สำหรับ Dev (ngrok)
```bash
ngrok http 3000
# ใส่ URL ที่ได้ใน Webhook URL + trustedOrigins + allowedDevOrigins
```

</details>

---

## ✦ สถาปัตยกรรม

```
+-------------------------------------+
|           User Browser               |
|         (Next.js App Router)         |
+----------+----------+---------------+
| Server   | API      | Cron           |
| Actions  | Routes   | (Vercel)       |
| (CRUD)   |          |                |
|          | Auth     | Daily Report   |
| Zod      | LINE     | Monthly Report |
| Validate | Webhook  |                |
+----------+----------+---------------+
|          Drizzle ORM                 |
|      (ownership-scoped queries)      |
+--------------------------------------+
|      Neon PostgreSQL (Serverless)    |
+--------------------------------------+
            |
            v
    LINE Messaging API
    (push daily/monthly reports)
```

### Security
- **Ownership checks** — ทุก query มี `and(eq(id), eq(userId))`
- **Zod validation** — ทุก input ผ่าน schema validation
- **Rate limiting** — ป้องกัน brute force บน auth
- **Proxy/middleware** — redirect unauthenticated users

---

## ✦ Deployment (Vercel)

```bash
pnpm build    # verify production build
vercel        # deploy
```

เพิ่ม Environment Variables ใน Vercel Dashboard:

| Variable | ใช้สำหรับ |
|----------|----------|
| `DATABASE_URL` | Neon connection |
| `BETTER_AUTH_SECRET` | Session encryption |
| `BETTER_AUTH_URL` | Production domain |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE push messages |
| `CRON_SECRET` | Protect cron endpoints |

> Cron: รายวัน `0 17 * * *` (00:00 ICT) · รายเดือน `0 17 1 * *` (วันที่ 1)

---

## ✦ Project Structure

```
src/
|-- app/
|   |-- (auth)/              # login + signup
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

## ✦ Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `npx tsc --noEmit` | Type check |
| `npx drizzle-kit push` | Push schema to database |

---

<div align="center">

<br>

## License

© THXNXKXT. All rights reserved.

<br>

---

<sub>Built with Next.js 16 · Neon · Drizzle · Better-Auth · Tailwind v4 · Framer Motion</sub>

</div>
