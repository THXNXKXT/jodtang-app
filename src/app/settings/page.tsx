"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { Card } from "@/components/ui/card";
import { WalletList } from "@/components/settings/wallet-list";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ProfileSheet } from "@/components/settings/profile-sheet";
import { LineSection } from "@/components/settings/line-section";
import { Logo } from "@/components/svg/logo";
import { useI18n, type Locale } from "@/i18n/config";
import { authClient } from "@/lib/auth-client";
import { getProfile } from "@/server/actions/profile";
import { isAvatarUrl } from "@/components/svg/avatars";
import { Globe, Download, LogOut, Palette } from "lucide-react";

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("ผู้ใช้");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((p) => { setName(p.name); setAvatar(p.image ?? null); }).catch(() => {});
  }, [profileOpen]);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login"); router.refresh();
  }

  return (
    <PageTransition>
      <div className="space-y-6 p-4 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <h1 className="text-lg font-bold tracking-tight">{t("app.name")}</h1>
        </div>

        <Card className="flex cursor-pointer items-center gap-3" onClick={() => setProfileOpen(true)}>
          {isAvatarUrl(avatar) ? (
            <img src={avatar ?? undefined} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-lg font-bold text-[var(--color-primary)]">
              {(name || "?")[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{name}</p>
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
        <LineSection />

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

      <ProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} currentName={name} currentAvatar={avatar} />
    </PageTransition>
  );
}
