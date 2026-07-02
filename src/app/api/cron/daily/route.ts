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

    function txRow(label: string, amount: string, color: string): Record<string, unknown> {
      return {
        type: "box", layout: "horizontal",
        contents: [
          { type: "text", text: label, size: "xs", color, flex: 1 },
          { type: "text", text: amount, size: "xs", color, flex: 0 },
        ],
      };
    }

    // Card 1: Summary
    const summaryBody: Record<string, unknown>[] = [];
    if (incTxns.length > 0) {
      summaryBody.push(txRow("รายรับ", `+${formatCurrency(income)}`, "#10b981"));
      summaryBody.push(txRow("รายจ่าย", `-${formatCurrency(expense)}`, "#ef4444"));
    } else {
      summaryBody.push(txRow("รายจ่าย", `-${formatCurrency(expense)}`, "#ef4444"));
    }
    summaryBody.push({ type: "separator", margin: "sm" });
    summaryBody.push(txRow("ยอดสุทธิ", `${net >= 0 ? "+" : ""}${formatCurrency(net)}`, net >= 0 ? "#10b981" : "#ef4444"));

    const cards: Record<string, unknown>[] = [{
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
      body: { type: "box", layout: "vertical", paddingAll: "16px", contents: summaryBody },
    }];

    // Card 2: Income details (all items)
    if (incTxns.length > 0) {
      const items = incTxns.map(t => txRow(t.catName ?? "-", formatCurrency(Number(t.amount)), "#10b981"));
      cards.push({
        type: "bubble", size: "kilo",
        header: {
          type: "box", layout: "vertical",
          backgroundColor: "#10b981", paddingAll: "16px",
          contents: [{ type: "text", text: `💚 รายรับ ${incTxns.length} รายการ`, size: "sm", color: "#ffffff", weight: "bold" }],
        },
        body: { type: "box", layout: "vertical", paddingAll: "12px", contents: items },
      });
    }

    // Card 3: Expense details (all items)
    if (expTxns.length > 0) {
      const items = expTxns.map(t => txRow(t.catName ?? "-", formatCurrency(Number(t.amount)), "#ef4444"));
      cards.push({
        type: "bubble", size: "kilo",
        header: {
          type: "box", layout: "vertical",
          backgroundColor: "#ef4444", paddingAll: "16px",
          contents: [{ type: "text", text: `❤️ รายจ่าย ${expTxns.length} รายการ`, size: "sm", color: "#ffffff", weight: "bold" }],
        },
        body: { type: "box", layout: "vertical", paddingAll: "12px", contents: items },
      });
    }

    const flex = { type: "carousel", contents: cards };

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
