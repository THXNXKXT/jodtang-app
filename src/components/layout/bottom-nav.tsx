"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, ReceiptText, BarChart3, Settings, Plus } from "lucide-react";
import { AddTransactionSheet } from "@/components/add/add-transaction-sheet";
import { useI18n } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface NavItem { href: string; labelKey: string; icon: typeof LayoutDashboard; }

const navItems: NavItem[] = [
  { href: "/", labelKey: "nav.home", icon: LayoutDashboard },
  { href: "/transactions", labelKey: "nav.transactions", icon: ReceiptText },
  { href: "/reports", labelKey: "nav.reports", icon: BarChart3 },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

export function BottomNav() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[480px] items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl safe-area-bottom h-[var(--spacing-tab-bar)] -translate-x-1/2">
      {navItems.slice(0, 2).map((item) => (
        <NavButton key={item.href} item={item} active={pathname === item.href} onClick={() => router.push(item.href)} t={t} />
      ))}
      <motion.button
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={() => setAddOpen(true)}
        aria-label={t("nav.add")}
        className="flex h-14 w-14 -translate-y-3 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 ring-4 ring-[var(--color-surface)]"
      >
        <Plus size={24} />
      </motion.button>
      {navItems.slice(2).map((item) => (
        <NavButton key={item.href} item={item} active={pathname === item.href} onClick={() => router.push(item.href)} t={t} />
      ))}
      <AddTransactionSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </nav>
  );
}

function NavButton({ item, active, onClick, t }: {
  item: NavItem; active: boolean; onClick: () => void; t: (k: string) => string;
}) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} className="relative flex flex-col items-center gap-1 px-2 py-2">
      <Icon size={22} className={cn(active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]")} strokeWidth={active ? 2.5 : 2} />
      <span className={cn("text-[10px]", active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]")}>
        {t(item.labelKey)}
      </span>
      {active && (
        <motion.div layoutId="nav-active" className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-[var(--color-text-primary)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
      )}
    </button>
  );
}
