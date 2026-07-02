import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, transactions, categories } from "@/server/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dailyUsers = await db.select().from(users).where(eq(users.notifyFreq, "daily"));
  let actuallySent = 0;
  const errors: string[] = [];

  for (const user of dailyUsers) {
    if (!user.lineId || user.lineId.startsWith("pending:")) continue;

    const userTxns = await db
      .select({ amount: transactions.amount, type: categories.type, categoryName: categories.name })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(eq(transactions.userId, user.id), gte(transactions.date, todayStart), lte(transactions.date, todayEnd)));

    if (userTxns.length === 0) continue;

    let income = 0, expense = 0;
    const lines: string[] = [];
    const incomeTxns = userTxns.filter(t => t.type === "income");
    const expenseTxns = userTxns.filter(t => t.type === "expense");

    if (incomeTxns.length > 0) {
      income = incomeTxns.reduce((s, t) => s + Number(t.amount), 0);
      lines.push(`\n💰 รายรับ  +${formatCurrency(income)}`);
      incomeTxns.forEach(t => lines.push(`  • ${t.categoryName} ${formatCurrency(Number(t.amount))}`));
    }
    if (expenseTxns.length > 0) {
      expense = expenseTxns.reduce((s, t) => s + Number(t.amount), 0);
      lines.push(`\n💸 รายจ่าย -${formatCurrency(expense)}`);
      expenseTxns.forEach(t => lines.push(`  • ${t.categoryName} ${formatCurrency(Number(t.amount))}`));
    }

    const net = income - expense;
    lines.push(`\n━━━━━━━━━━━━`);
    lines.push(`ยอดสุทธิ ${net >= 0 ? "+" : ""}${formatCurrency(net)}`);

    const dateStr = todayStart.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
    const message = `📊 จดตัง — สรุปประจำวันที่ ${dateStr}${lines.join("\n")}`;

    try {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.lineId, messages: [{ type: "text", text: message }] }),
      });
      if (!res.ok) {
        const errText = await res.text();
        errors.push(`${user.email}: LINE ${res.status} ${errText}`);
      } else {
        actuallySent++;
      }
    } catch (e) {
      errors.push(`${user.email}: ${String(e)}`);
    }
  }

  return NextResponse.json({ sent: actuallySent, total: dailyUsers.length, errors });
}
