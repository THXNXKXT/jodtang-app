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
  const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyUsers = await db.select().from(users).where(eq(users.notifyFreq, "monthly"));
  let sent = 0;

  for (const user of monthlyUsers) {
    if (!user.lineId || user.lineId.startsWith("pending:")) continue;

    const userTxns = await db
      .select({ amount: transactions.amount, type: categories.type })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(eq(transactions.userId, user.id), gte(transactions.date, monthStart), lte(transactions.date, monthEnd)));

    const income = userTxns.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = userTxns.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const net = income - expense;
    const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;
    const monthName = monthStart.toLocaleDateString("th-TH", { month: "long", year: "numeric" });

    const lines: string[] = [];
    lines.push(`📊 สรุปประจำเดือน ${monthName}`);
    lines.push(`━━━━━━━━━━━━━━━━`);
    lines.push(``);
    lines.push(`💚 รายรับ    +${formatCurrency(income)}`);
    lines.push(`❤️ รายจ่าย  -${formatCurrency(expense)}`);
    lines.push(``);
    lines.push(`━━━━━━━━━━━━━━━━`);
    lines.push(`${net >= 0 ? "🟢" : "🔴"} ยอดสุทธิ  ${net >= 0 ? "+" : ""}${formatCurrency(net)}`);
    lines.push(``);
    lines.push(`💰 อัตราการออม: ${savingsRate >= 0 ? savingsRate : 0}%`);
    lines.push(`📝 จำนวนรายการ: ${userTxns.length} รายการ`);
    lines.push(``);
    lines.push(`ดูรายละเอียด → jodtang.app`);

    const message = lines.join("\n");

    try {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.lineId, messages: [{ type: "text", text: message }] }),
      });
      if (res.ok) sent++;
    } catch {}
  }

  return NextResponse.json({ sent, total: monthlyUsers.length });
}
