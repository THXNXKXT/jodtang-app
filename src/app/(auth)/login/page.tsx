"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Logo } from "@/components/svg/logo";
import { useI18n } from "@/i18n/config";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn.email({ email, password });
    if (res.error) {
      setError(t("auth.loginError"));
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex flex-col items-center gap-3">
        <Logo size={56} />
        <h1 className="text-2xl font-bold">จดตัง</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{t("auth.loginSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>
        {error && <p className="text-sm text-[var(--color-expense)]">{error}</p>}
        <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? t("auth.loginLoading") : t("auth.loginBtn")}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        {t("auth.noAccount")} <a href="/signup" className="font-medium text-[var(--color-primary)]">{t("auth.signupBtn")}</a>
      </p>
    </motion.div>
  );
}
