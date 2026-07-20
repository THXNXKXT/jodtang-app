"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PencilLineIcon, BellIcon, PieChartIcon, WalletIcon,
  WifiOffIcon, ShieldCheckIcon, MessageCircleIcon, ArrowRightIcon,
} from "lucide-react";
import { Logo } from "@/components/svg/logo";

// ponytail: mobile-first single-file landing. No external deps, uses existing CSS vars + framer-motion.
// Hallmark · macrostructure: Stat-Led · tone: playful · theme: in-app tokens

const spring = { stiffness: 300, damping: 30, mass: 0.8 };
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { margin: "0px 0px 400px 0px" },
  transition: spring,
};

const features = [
  { icon: PencilLineIcon, title: "จดรายรับรายจ่าย", desc: "บันทึกรวดเร็ว 3 วินาที พร้อมแนะนำหมวดหมู่อัตโนมัติจากชื่อรายการ" },
  { icon: BellIcon, title: "สรุปยอดทุกเช้า", desc: "รับสรุปรายรับรายจ่ายประจำวันผ่าน LINE ไม่ต้องเปิดแอป" },
  { icon: PieChartIcon, title: "งบประมาณและกราฟ", desc: "ตั้งงบรายเดือน เตือนเมื่อใกล้เกิน พร้อมกราฟแสดงแนวโน้มการใช้จ่าย" },
  { icon: WalletIcon, title: "หลายกระเป๋าเงิน", desc: "แยกเงินสด บัญชีธนาคาร e-Wallet และเงินออม รู้ยอดคงเหลือแบบเรียลไทม์" },
  { icon: WifiOffIcon, title: "ใช้งานออฟไลน์", desc: "PWA ติดตั้งบนหน้าจอ เปิดได้แม้ไม่มีเน็ต ข้อมูลเก็บในเครื่อง" },
  { icon: ShieldCheckIcon, title: "ปลอดภัย", desc: "รหัสผ่านเข้ารหัส scrypt ลบบัญชีได้ทุกเมื่อ ข้อมูลเป็นของคุณเพียงคนเดียว" },
];

export function LandingContent() {
  return (
    <div className="mx-auto min-h-dvh max-w-4xl bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-base font-bold">จดตัง</span>
        </div>
        <Link href="/login" className="text-sm font-medium text-[var(--color-text-secondary)]">
          เข้าสู่ระบบ
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-5 pb-16 pt-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.1 }}
          className="mx-auto mb-6 w-fit"
        >
          <Logo size={96} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
        >
          จดทุกบาท<br />
          <span className="text-[var(--color-primary)]">เข้าใจทุกเงิน</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
          className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--color-text-muted)]"
        >
          แอปจดบันทึกรายรับรายจ่ายที่ง่ายและน่ารัก
          สรุปยอดส่ง LINE ทุกเช้า ไม่ต้องนั่งเปิดแอป
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <Link
            href="/signup"
            className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-4 text-base font-semibold text-white transition-opacity active:opacity-80"
          >
            เริ่มต้นใช้งานฟรี <ArrowRightIcon size={18} />
          </Link>
          <p className="text-xs text-[var(--color-text-muted)]">ฟรี ไม่มีโฆษณา ไม่ต้องใส่บัตร</p>
        </motion.div>
      </section>

      {/* Feature list */}
      <section className="px-5 py-12">
        <motion.h2
          {...reveal}
          className="mb-8 text-center text-xl font-bold"
        >
          ทำอะไรได้บ้าง?
        </motion.h2>

        <div className="space-y-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...reveal}
              transition={{ ...spring, delay: i * 0.06 }}
              className="flex gap-4 rounded-2xl bg-[var(--color-surface)] p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
                <f.icon size={22} className="text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold">{f.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-muted)]">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LINE highlight */}
      <section className="bg-[#06C755] py-14">
        <motion.div
          {...reveal}
          className="px-5 text-center text-white"
        >
          <MessageCircleIcon size={40} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold">สรุปยอดส่ง LINE ทุกเช้า</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/90">
            เพิ่มเพื่อน LINE ส่งรหัสเชื่อมบัญชี — รับสรุปรายรับรายจ่ายอัตโนมัติทุกวันที่ 00:00 น.
            และสรุปรายเดือนทุกวันที่ 1 ของเดือน
          </p>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-5 py-14">
        <motion.h2 {...reveal} className="mb-8 text-center text-xl font-bold">ใช้งานง่าย 3 ขั้นตอน</motion.h2>
        <div className="space-y-6">
          {[
            { n: "1", t: "สมัครบัญชี", d: "อีเมล + รหัสผ่าน ใช้เวลา 10 วินาที" },
            { n: "2", t: "จดรายการ", d: "กรอกยอด + เลือกหมวดหมู่ แอปแนะนำให้เอง" },
            { n: "3", t: "รับสรุปยอด", d: "เปิดแอปหรือรอ LINE ส่งสรุปมาให้" },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              {...reveal}
              transition={{ ...spring, delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-base font-bold text-white">
                {s.n}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold">{s.t}</h3>
                <p className="text-[13px] text-[var(--color-text-muted)]">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 text-center">
        <motion.div {...reveal}>
          <Logo size={72} className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold">เริ่มจดตังวันนี้</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">ฟรีตลอดไป ไม่มีค่าใช้จ่ายแอบแฝง</p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-white transition-opacity active:opacity-80"
          >
            สมัครเลย <ArrowRightIcon size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="px-5 text-center text-xs text-[var(--color-text-muted)]">
          <p>จดตัง — Jodtang · Personal Finance Tracker</p>
        </div>
      </footer>
    </div>
  );
}
