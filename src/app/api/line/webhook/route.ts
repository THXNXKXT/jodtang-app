import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq, like } from "drizzle-orm";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[LINE WEBHOOK] Received:", JSON.stringify(body));
  const events = body.events ?? [];

  for (const ev of events) {
    console.log("[LINE WEBHOOK] Event type:", ev.type);

    if (ev.type === "message" && ev.message.type === "text") {
      const lineUserId = ev.source.userId;
      const text = ev.message.text.trim();
      console.log("[LINE WEBHOOK] Message from:", lineUserId, "text:", text);

      const row = await db
        .select()
        .from(users)
        .where(like(users.lineId, `pending:${text}%`))
        .limit(1);

      console.log("[LINE WEBHOOK] Matched rows:", row.length);

      if (row.length > 0 && row[0]) {
        await db
          .update(users)
          .set({ lineId: lineUserId, notifyFreq: "daily" })
          .where(eq(users.id, row[0].id));

        console.log("[LINE WEBHOOK] Updated user:", row[0].id, "->", lineUserId);

        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            replyToken: ev.replyToken,
            messages: [{ type: "text", text: "เชื่อมต่อสำเร็จ! คุณจะได้รับรายงานรายวันจาก Jodtang" }],
          }),
        });
      } else {
        console.log("[LINE WEBHOOK] No match for code:", text);
      }
    }

    if (ev.type === "follow") {
      console.log("[LINE WEBHOOK] New follower:", ev.source.userId);
      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replyToken: ev.replyToken,
          messages: [{
            type: "text",
            text: "ยินดีต้อนรับ! กรุณาส่งรหัสจากแอพ Jodtang เพื่อเชื่อมต่อบัญชี",
          }],
        }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
