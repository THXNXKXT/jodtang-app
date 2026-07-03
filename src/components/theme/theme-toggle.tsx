"use client";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon, MonitorSmartphoneIcon } from "@/components/svg/icons";
import { useTheme } from "./theme-provider";
import { useI18n } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const options: Array<{ value: "light" | "dark" | "system"; icon: typeof SunIcon; label: string }> = [
    { value: "light", icon: SunIcon, label: t("settings.themeLight") },
    { value: "dark", icon: MoonIcon, label: t("settings.themeDark") },
    { value: "system", icon: MonitorSmartphoneIcon, label: t("settings.themeSystem") },
  ];
  return (
    <div className="flex rounded-xl bg-[var(--color-surface-hover)] p-1">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button key={opt.value} onClick={() => setTheme(opt.value)} className={cn("relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]")}>
            {active && <motion.div layoutId="theme-toggle" className="absolute inset-0 rounded-lg bg-[var(--color-surface)] shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon size={15} /> <span className="hidden sm:inline">{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}