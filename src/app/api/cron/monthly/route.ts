import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, transactions, categories } from "@/server/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ponytail: ICT=UTC+7, Vercel runs in UTC — shift before extracting month parts
  const ICT = 7 * 60 * 60 * 1000;
  const ict = new Date(Date.now() + ICT);
  const cy = ict.getUTCFullYear(), cm = ict.getUTCMonth();
  const my = cm === 0 ? cy - 1 : cy;
  const mm = cm === 0 ? 11 : cm - 1;
  const mStart = new Date(Date.UTC(my, mm, 1) - ICT);
  const mEnd = new Date(Date.UTC(cy, cm, 1) - ICT);

  const monthlyUsers = await db.select().from(users).where(eq(users.notifyFreq, "monthly"));
  let sent = 0;

  for (const user of monthlyUsers) {
    if (!user.lineId || user.lineId.startsWith("pending:")) continue;

    const txns = await db
      .select({ amount: transactions.amount, type: categories.type })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(eq(transactions.userId, user.id), gte(transactions.date, mStart), lte(transactions.date, mEnd)));

    const income = txns.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = txns.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const net = income - expense;
    const rate = income > 0 ? Math.round((net / income) * 100) : 0;
    const monthName = new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" }).format(new Date(Date.UTC(my, mm, 1)));

    function row(label: string, amount: string, color: string, bold = false): Record<string, unknown> {
      return {
        type: "box", layout: "horizontal",
        contents: [
          { type: "text", text: label, size: "xs", color, flex: 1, weight: bold ? "bold" : "regular" },
          { type: "text", text: amount, size: "xs", color, flex: 0, weight: bold ? "bold" : "regular" },
        ],
      };
    }

    const flex = {
      type: "bubble", size: "kilo",
      header: {
        type: "box", layout: "vertical",
        backgroundColor: net >= 0 ? "#3b82f6" : "#ef4444",
        paddingAll: "16px",
        contents: [
          { type: "text", text: "จดตัง", size: "xs", color: "#ffffff80", weight: "bold" },
          { type: "text", text: monthName, size: "lg", color: "#ffffff", weight: "bold" },
        ],
      },
      body: {
        type: "box", layout: "vertical", paddingAll: "16px",
        contents: [
          row("รายรับ", `+${formatCurrency(income)}`, "#10b981", true),
          { type: "separator", margin: "sm" },
          row("รายจ่าย", `-${formatCurrency(expense)}`, "#ef4444", true),
          { type: "separator", margin: "md" },
          row("ยอดสุทธิ", `${net >= 0 ? "+" : ""}${formatCurrency(net)}`, net >= 0 ? "#10b981" : "#ef4444", true),
          row("อัตราการออม", `${rate >= 0 ? rate : 0}%`, "#999999"),
          { type: "text", text: `${txns.length} รายการ`, size: "xs", color: "#aaaaaa", margin: "sm" },
        ],
      },
    };

    try {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.lineId, messages: [{ type: "flex", altText: `จดตัง — สรุปประจำเดือน ${monthName}`, contents: flex }] }),
      });
      if (res.ok) sent++;
    } catch {}
  }

  return NextResponse.json({ sent, total: monthlyUsers.length });
}
