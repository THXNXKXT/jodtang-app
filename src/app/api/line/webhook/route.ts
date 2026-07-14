import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq, like } from "drizzle-orm";
import { env } from "@/lib/env";
import { isExpired } from "@/lib/budget-utils";
import { createHmac } from "crypto";

async function verifySignature(req: NextRequest): Promise<boolean> {
  const sig = req.headers.get("x-line-signature");
  if (!sig) return false;
  const body = await req.text();
  const expected = createHmac("SHA256", env.LINE_CHANNEL_ACCESS_TOKEN).update(body).digest("base64");
  return sig === expected;
}

export async function POST(req: NextRequest) {
  // ponytail: LINE webhook signature uses Channel Secret, not Access Token — was always failing
  const rawBody = await req.text();
  const sig = req.headers.get("x-line-signature");
  const expected = sig ? createHmac("SHA256", env.LINE_CHANNEL_SECRET).update(rawBody).digest("base64") : "";
  if (sig !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const events = body.events ?? [];

  for (const ev of events) {
    if (ev.type === "message" && ev.message.type === "text") {
      const lineUserId = ev.source.userId;
      const text = ev.message.text.trim();

      const row = await db
        .select()
        .from(users)
        .where(like(users.lineId, `pending:${text}:%`))
        .limit(1);

      if (row.length > 0 && row[0] && !isExpired(row[0].lineId!)) {
        await db.update(users).set({ lineId: lineUserId, notifyFreq: "daily" }).where(eq(users.id, row[0].id));
        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ replyToken: ev.replyToken, messages: [{ type: "text", text: "เชื่อมต่อสำเร็จ! คุณจะได้รับรายงานรายวันจาก Jodtang" }] }),
        });
      } else if (row.length > 0 && row[0]) {
        await db.update(users).set({ lineId: null }).where(eq(users.id, row[0].id));
        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ replyToken: ev.replyToken, messages: [{ type: "text", text: "รหัสหมดอายุแล้ว กรุณาสร้างรหัสใหม่ในแอพ Jodtang" }] }),
        });
      }
    }

    if (ev.type === "follow") {
      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ replyToken: ev.replyToken, messages: [{ type: "text", text: "ยินดีต้อนรับ! กรุณาส่งรหัสจากแอพ Jodtang เพื่อเชื่อมต่อบัญชี" }] }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
