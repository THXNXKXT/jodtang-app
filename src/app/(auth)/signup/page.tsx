"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { Logo } from "@/components/svg/logo";
import { useI18n } from "@/i18n/config";

export default function SignupPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError(t("auth.passwordShort")); return; }
    setLoading(true);
    setError("");
    const res = await signUp.email({ name, email, password });
    if (res.error) {
      setError(t("auth.signupError"));
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <motion.div initial={false}>
      <div className="mb-8 flex flex-col items-center gap-3">
        <Logo size={56} />
        <h1 className="text-2xl font-bold">{t("auth.signupTitle")}</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{t("auth.signupSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">{t("auth.name")}</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.namePlaceholder")} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">{t("auth.email")}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">{t("auth.password")}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.passwordPlaceholder")} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>
        {error && <p className="text-sm text-[var(--color-expense)]">{error}</p>}
        <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? t("auth.signupLoading") : t("auth.signupBtn")}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        {t("auth.haveAccount")} <a href="/login" className="font-medium text-[var(--color-primary)]">{t("auth.loginBtn")}</a>
      </p>
    </motion.div>
  );
}
