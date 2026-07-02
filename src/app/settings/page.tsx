"use client";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { Card } from "@/components/ui/card";
import { WalletList } from "@/components/settings/wallet-list";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/svg/logo";
import { useI18n, type Locale } from "@/i18n/config";
import { authClient } from "@/lib/auth-client";
import { Globe, Download, LogOut, Palette } from "lucide-react";

export default function SettingsPage() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <PageTransition>
      <div className="space-y-6 p-4 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <h1 className="text-lg font-bold tracking-tight">จดตัง</h1>
        </div>

        <Card className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-lg font-bold text-[var(--color-primary)]">จ</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("settings.profile")}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{t("settings.loggedIn")}</p>
          </div>
        </Card>

        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">
            <Globe size={14} /> {t("settings.language")}
          </p>
          <div className="flex gap-2">
            {(["th", "en"] as Locale[]).map((l) => (
              <button key={l} onClick={() => setLocale(l)} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm ${locale === l ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-[var(--color-border)] text-[var(--color-text-secondary)]"}`}>
                {l === "th" ? t("settings.thai") : t("settings.english")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">
            <Palette size={14} /> {t("settings.theme")}
          </p>
          <ThemeToggle />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">{t("settings.wallets")}</p>
          <WalletList />
        </div>

        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm">
            <Download size={16} /> {t("settings.export")}
          </button>
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--color-expense)]">
            <LogOut size={16} /> {t("settings.signOut")}
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
