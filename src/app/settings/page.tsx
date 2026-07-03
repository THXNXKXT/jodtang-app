"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { GlobeIcon, LogOutIcon, PaletteIcon, ChevronRightIcon } from "@/components/svg/icons";

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("ผู้ใช้");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((p) => { setName(p.name); setEmail(p.email ?? ""); setAvatar(p.image ?? null); }).catch(() => {});
  }, [profileOpen]);

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/login";
  }

  return (
    <PageTransition>
      <div className="space-y-6 p-4 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <h1 className="text-lg font-bold tracking-tight">{t("app.name")}</h1>
        </div>

        {/* UserIcon card */}
        <motion.div whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
          <Card className="relative overflow-hidden p-4" onClick={() => setProfileOpen(true)}>
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--color-primary)] opacity-[0.06]" />
            <div className="relative flex items-center gap-3">
              {isAvatarUrl(avatar) ? (
                <img src={avatar ?? undefined} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--color-border)]" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xl font-bold text-[var(--color-primary)] ring-2 ring-[var(--color-border)]">
                  {(name || "?")[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="text-base font-semibold">{name}</p>
                <div className="flex flex-col"><p className="text-xs text-[var(--color-text-secondary)]">{email}</p><p className="text-xs text-[var(--color-text-muted)]">{t("settings.editProfile")}</p></div>
              </div>
              <ChevronRightIcon size={18} className="text-[var(--color-text-muted)]" />
            </div>
          </Card>
        </motion.div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">
            <GlobeIcon size={14} /> {t("settings.language")}
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
            <PaletteIcon size={14} /> {t("settings.theme")}
          </p>
          <ThemeToggle />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">{t("settings.wallets")}</p>
          <WalletList />
        </div>

        <LineSection />

        <button onClick={handleSignOut} className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-expense)]">
          <LogOutIcon size={16} /> {t("settings.signOut")}
        </button>
      </div>

      <ProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} currentName={name} currentAvatar={avatar} />
    </PageTransition>
  );
}