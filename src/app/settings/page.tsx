"use client";
import { PageTransition } from "@/components/layout/page-transition";
import { Card } from "@/components/ui/card";
import { WalletList } from "@/components/settings/wallet-list";
import { CategoryList } from "@/components/settings/category-list";
import { useI18n, type Locale } from "@/i18n/config";
import { Globe, Download, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { locale, setLocale } = useI18n();
  return (
    <PageTransition>
      <div className="space-y-6 p-4 pt-6">
        <h1 className="text-xl font-bold">ตั้งค่า</h1>
        <Card className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-lg font-bold">จ</div>
          <div className="flex-1">
            <p className="text-sm font-medium">ผู้ใช้ทดสอบ</p>
            <p className="text-xs text-[var(--color-text-secondary)]">user@example.com</p>
          </div>
        </Card>
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">
            <Globe size={14} /> ภาษา
          </p>
          <div className="flex gap-2">
            {(["th", "en"] as Locale[]).map((l) => (
              <button key={l} onClick={() => setLocale(l)} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm ${locale === l ? "border-[var(--color-text-primary)] text-[var(--color-text-primary)]" : "border-[var(--color-border)] text-[var(--color-text-secondary)]"}`}>
                {l === "th" ? "ไทย" : "English"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">กระเป๋าเงิน</p>
          <WalletList />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">หมวดหมู่</p>
          <CategoryList />
        </div>
        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm">
            <Download size={16} /> ส่งออกข้อมูล
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--color-expense)]">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
