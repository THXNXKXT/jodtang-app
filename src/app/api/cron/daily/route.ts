import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, transactions, categories } from "@/server/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ponytail: ICT=UTC+7, Vercel runs in UTC — shift before extracting date parts
  const ICT = 7 * 60 * 60 * 1000;
  const ict = new Date(Date.now() + ICT);
  const y = ict.getUTCFullYear(), m = ict.getUTCMonth(), d = ict.getUTCDate() - 1;
  const dayStart = new Date(Date.UTC(y, m, d) - ICT);
  const dayEnd = new Date(Date.UTC(y, m, d + 1) - ICT);

  const dailyUsers = await db.select().from(users).where(eq(users.notifyFreq, "daily"));
  let sent = 0;
  const errors: string[] = [];

  for (const user of dailyUsers) {
    if (!user.lineId || user.lineId.startsWith("pending:")) continue;

    const txns = await db
      .select({ amount: transactions.amount, type: categories.type, catName: categories.name })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(eq(transactions.userId, user.id), gte(transactions.date, dayStart), lte(transactions.date, dayEnd)));

    if (txns.length === 0) continue;

    const incTxns = txns.filter(t => t.type === "income");
    const expTxns = txns.filter(t => t.type === "expense");
    const income = incTxns.reduce((s, t) => s + Number(t.amount), 0);
    const expense = expTxns.reduce((s, t) => s + Number(t.amount), 0);
    const net = income - expense;
    const dateStr = new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short" }).format(new Date(Date.UTC(y, m, d)));

    function row(label: string, amount: string, color: string, bold = false): Record<string, unknown> {
      return {
        type: "box", layout: "horizontal",
        contents: [
          { type: "text", text: label, size: "xs", color, flex: 1, weight: bold ? "bold" : "regular" },
          { type: "text", text: amount, size: "xs", color, flex: 0, weight: bold ? "bold" : "regular" },
        ],
      };
    }

    const body: Record<string, unknown>[] = [];

    if (incTxns.length > 0) {
      body.push(row(`รายรับ (${incTxns.length})`, `+${formatCurrency(income)}`, "#10b981", true));
      for (const t of incTxns) body.push(row(`  ${t.catName}`, formatCurrency(Number(t.amount)), "#999999"));
    }
    if (expTxns.length > 0) {
      if (incTxns.length > 0) body.push({ type: "separator", margin: "sm" });
      body.push(row(`รายจ่าย (${expTxns.length})`, `-${formatCurrency(expense)}`, "#ef4444", true));
      for (const t of expTxns) body.push(row(`  ${t.catName}`, formatCurrency(Number(t.amount)), "#999999"));
    }
    body.push({ type: "separator", margin: "sm" });
    body.push(row("ยอดสุทธิ", `${net >= 0 ? "+" : ""}${formatCurrency(net)}`, net >= 0 ? "#10b981" : "#ef4444", true));

    const flex = {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box", layout: "vertical",
        backgroundColor: net >= 0 ? "#10b981" : "#ef4444",
        paddingAll: "16px",
        contents: [
          { type: "text", text: "จดตัง", size: "xs", color: "#ffffff80", weight: "bold" },
          { type: "text", text: `สรุปประจำวันที่ ${dateStr}`, size: "lg", color: "#ffffff", weight: "bold" },
        ],
      },
      body: {
        type: "box", layout: "vertical", paddingAll: "16px", spacing: "xs",
        contents: body,
      },
      styles: { footer: { separator: true } },
    };

    try {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.lineId, messages: [{ type: "flex", altText: `จดตัง — สรุปประจำวัน ${dateStr} (${txns.length} รายการ)`, contents: flex }] }),
      });
      if (!res.ok) errors.push(`${user.email}: ${res.status} ${await res.text()}`);
      else sent++;
    } catch (e) { errors.push(`${user.email}: ${String(e)}`); }
  }

  return NextResponse.json({ sent, total: dailyUsers.length, errors });
}
