"use client";
import { useState } from "react";
import { Logo } from "@/components/svg/logo";
import { useI18n } from "@/i18n/config";
import { MailIcon, LockIcon } from "@/components/svg/icons";

export default function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then(r => r.json());
      if (!res.token && !res.user) {
        setError(res.error.message || t("auth.loginError"));
        setLoading(false);
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--color-bg)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size={56} />
          <h1 className="text-2xl font-bold">จดตัง</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{t("auth.loginSubtitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">{t("auth.email")}</label>
            <div className="relative">
              <MailIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">{t("auth.password")}</label>
            <div className="relative">
              <LockIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]" />
            </div>
          </div>
          {error && <p className="text-sm text-[var(--color-expense)]">{error}</p>}
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "..." : t("auth.loginBtn")}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          {t("auth.noAccount")} <a href="/signup" className="font-medium text-[var(--color-primary)]">{t("auth.signupBtn")}</a>
        </p>
      </div>
    </main>
  );
}