"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import dynamic from "next/dynamic";
const ProfileSheet = dynamic(() => import("@/components/settings/profile-sheet").then((m) => m.ProfileSheet), { ssr: false });
import { LineSection } from "@/components/settings/line-section";
import { DeleteAccountButton } from "@/components/settings/delete-account-button";
import { Logo } from "@/components/svg/logo";
import { useI18n, type Locale } from "@/i18n/config";
import { authClient } from "@/lib/auth-client";
import { useAppData } from "@/lib/data-provider";
import { isAvatarUrl } from "@/components/svg/avatars";
import { GlobeIcon, LogOutIcon, PaletteIcon, ChevronRightIcon } from "@/components/svg/icons";
import { WalletIcon, TagsIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { profile, reload } = useAppData();
  const [profileOpen, setProfileOpen] = useState(false);
  const name = profile.name;
  const email = profile.email ?? "";
  const avatar = profile.image;

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

        {/* ponytail: routes instead of inline — list got long, settings is a hub now */}
        <ManageLink href="/settings/wallets" label={t("settings.wallets")} icon={<WalletIcon size={18} />} />
        <ManageLink href="/settings/categories" label={t("settings.categories")} icon={<TagsIcon size={18} />} />

        <LineSection />

        <button onClick={handleSignOut} className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-expense)]">
          <LogOutIcon size={16} /> {t("settings.signOut")}
        </button>

        <DeleteAccountButton />
      </div>

      <ProfileSheet open={profileOpen} onClose={() => { setProfileOpen(false); reload(); }} currentName={name} currentAvatar={avatar} />
    </PageTransition>
  );
}

// ponytail: tiny inline Link wrapper — reuse for both, no extra file
function ManageLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href}
      className="flex items-center gap-3 rounded-xl bg-[var(--color-surface)] px-4 py-3.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-hover)]">
      <span className="text-[var(--color-text-muted)]">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRightIcon size={16} className="text-[var(--color-text-muted)]" />
    </Link>
  );
}

