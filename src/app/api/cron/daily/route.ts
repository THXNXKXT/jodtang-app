import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, transactions, categories } from "@/server/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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
    const dateStr = dayStart.toLocaleDateString("th-TH", { day: "numeric", month: "short" });

    function row(label: string, amount: string, color: string, bold = false): Record<string, unknown> {
      return {
        type: "box", layout: "horizontal",
        contents: [
          { type: "text", text: label, size: "xs", color, flex: 1, weight: bold ? "bold" : "regular" },
          { type: "text", text: amount, size: "xs", color, flex: 0, weight: bold ? "bold" : "regular" },
        ],
      };
    }

    const bodyContents: Record<string, unknown>[] = [];

    if (incTxns.length > 0) {
      bodyContents.push(row("รายรับ", `+${formatCurrency(income)}`, "#10b981", true));
      for (const t of incTxns.slice(0, 5)) bodyContents.push(row(`  ${t.catName}`, formatCurrency(Number(t.amount)), "#999999"));
    }
    if (incTxns.length > 0 && expTxns.length > 0) bodyContents.push({ type: "separator", margin: "sm" });
    if (expTxns.length > 0) {
      bodyContents.push(row("รายจ่าย", `-${formatCurrency(expense)}`, "#ef4444", true));
      for (const t of expTxns.slice(0, 5)) bodyContents.push(row(`  ${t.catName}`, formatCurrency(Number(t.amount)), "#999999"));
    }

    const flex = {
      type: "bubble", size: "kilo",
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
        type: "box", layout: "vertical", paddingAll: "16px",
        contents: [
          ...bodyContents,
          { type: "separator", margin: "md" },
          row("ยอดสุทธิ", `${net >= 0 ? "+" : ""}${formatCurrency(net)}`, net >= 0 ? "#10b981" : "#ef4444", true),
          { type: "text", text: `${txns.length} รายการ`, size: "xs", color: "#aaaaaa", margin: "sm" },
        ],
      },
    };

    try {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.lineId, messages: [{ type: "flex", altText: `จดตัง — สรุปประจำวัน ${dateStr}`, contents: flex }] }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        errors.push(`${user.email}: ${res.status} ${errBody}`);
      } else sent++;
    } catch (e) { errors.push(`${user.email}: ${String(e)}`); }
  }

  return NextResponse.json({ sent, total: dailyUsers.length, errors });
}
