"use client";
import Link from "next/link";
import { Home } from "lucide-react";
import { useI18n } from "@/i18n/config";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-4xl font-bold text-[var(--color-text-muted)]">404</p>
      <p className="text-sm text-[var(--color-text-secondary)]">{t("error.notFound")}</p>
      <Link href="/" className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
        <Home size={16} /> {t("error.goHome")}
      </Link>
    </div>
  );
}
