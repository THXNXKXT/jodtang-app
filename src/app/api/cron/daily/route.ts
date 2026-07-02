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
  let sent = 0;
  const errors: string[] = [];

  for (const user of dailyUsers) {
    if (!user.lineId || user.lineId.startsWith("pending:")) continue;

    const userTxns = await db
      .select({ amount: transactions.amount, type: categories.type, catName: categories.name })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(eq(transactions.userId, user.id), gte(transactions.date, todayStart), lte(transactions.date, todayEnd)));

    if (userTxns.length === 0) continue;

    const incomeTxns = userTxns.filter(t => t.type === "income");
    const expenseTxns = userTxns.filter(t => t.type === "expense");
    const income = incomeTxns.reduce((s, t) => s + Number(t.amount), 0);
    const expense = expenseTxns.reduce((s, t) => s + Number(t.amount), 0);
    const net = income - expense;
    const dateStr = todayStart.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

    const lines: string[] = [];
    lines.push(`📊 สรุปรายวัน • ${dateStr}`);
    lines.push(`━━━━━━━━━━━━━━━━`);
    lines.push(``);

    if (incomeTxns.length > 0) {
      lines.push(`💚 รายรับ +${formatCurrency(income)}`);
      for (const t of incomeTxns) lines.push(`   · ${t.catName}  ${formatCurrency(Number(t.amount))}`);
      lines.push(``);
    }
    if (expenseTxns.length > 0) {
      lines.push(`❤️ รายจ่าย -${formatCurrency(expense)}`);
      for (const t of expenseTxns) lines.push(`   · ${t.catName}  ${formatCurrency(Number(t.amount))}`);
      lines.push(``);
    }

    lines.push(`━━━━━━━━━━━━━━━━`);
    lines.push(`${net >= 0 ? "🟢" : "🔴"} ยอดสุทธิ ${net >= 0 ? "+" : ""}${formatCurrency(net)}`);
    lines.push(``);
    lines.push(`จำนวนรายการ: ${userTxns.length} รายการ`);

    const message = lines.join("\n");

    try {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.lineId, messages: [{ type: "text", text: message }] }),
      });
      if (!res.ok) errors.push(`${user.email}: ${res.status}`);
      else sent++;
    } catch (e) { errors.push(`${user.email}: ${String(e)}`); }
  }

  return NextResponse.json({ sent, total: dailyUsers.length, errors });
}
