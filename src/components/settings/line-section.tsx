"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/config";
import { generateLinkCode, updateNotifyFreq, getLineSettings } from "@/server/actions/line";
import { CODE_EXPIRY_MS } from "@/lib/budget-utils";
import { Bell, Copy, Check, MessageCircle, ExternalLink, Clock } from "lucide-react";

export function LineSection() {
  const { t } = useI18n();
  const [lineId, setLineId] = useState<string | null>(null);
  const [freq, setFreq] = useState<"daily" | "monthly" | "off">("off");
  const [code, setCode] = useState<string | null>(null);
  const [codeExpiry, setCodeExpiry] = useState<number>(0);
  const [remaining, setRemaining] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getLineSettings().then(s => {
      if (s) { setLineId(s.lineId); setFreq((s.notifyFreq ?? "off") as typeof freq); }
    }).catch(() => {});
  }, []);

  // Countdown
  useEffect(() => {
    if (!codeExpiry) return;
    const tick = () => {
      const left = codeExpiry - Date.now();
      if (left <= 0) {
        setCode(null);
        setCodeExpiry(0);
        setRemaining(0);
        return;
      }
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [codeExpiry]);

  const connected = lineId && !lineId.startsWith("pending:");
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  async function handleConnect() {
    const c = await generateLinkCode();
    setCode(c);
    setCodeExpiry(Date.now() + CODE_EXPIRY_MS);
    setLineId(`pending:${c}`);
    navigator.clipboard.writeText(c);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleFreq(f: typeof freq) {
    setFreq(f);
    await updateNotifyFreq(f);
  }

  if (connected) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <MessageCircle size={16} className="text-[var(--color-primary)]" />
          <span className="text-sm font-medium">{t("settings.lineNotifications")}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500">
            <Check size={12} /> {t("settings.connected")}
          </span>
        </div>
        <Card className="space-y-3 p-4">
          <div className="flex gap-2">
            {(["daily", "monthly", "off"] as const).map(f => (
              <button
                key={f}
                onClick={() => handleFreq(f)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-colors ${
                  freq === f
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]"
                }`}
              >
                {t(`settings.freq_${f}`)}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (code) {
    const steps = t("settings.lineSteps").split("\n");
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <MessageCircle size={16} className="text-[var(--color-primary)]" />
          <span className="text-sm font-medium">{t("settings.lineNotifications")}</span>
        </div>
        <Card className="space-y-4 p-4">
          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-xs font-bold text-[var(--color-text-primary)]">{i + 1}</span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
          <a
            href="https://line.me/R/ti/p/@071fddut"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#06C755] py-3 text-sm font-medium text-white transition-opacity active:opacity-80"
          >
            <MessageCircle size={16} />
            {t("settings.addFriend")}
            <ExternalLink size={12} className="opacity-70" />
          </a>
          <div className="space-y-3">
            <div className="rounded-xl bg-[var(--color-surface-2)] px-4 py-4 text-center">
              <span className="text-2xl font-bold tracking-[0.2em] tabular-nums">{code}</span>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="mx-auto flex items-center gap-2 rounded-xl bg-[var(--color-surface-2)] px-4 py-2.5 text-xs"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? t("settings.copied") : t("settings.copy")}</span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Clock size={12} />
            <span className={remaining < 60000 ? "text-[var(--color-expense)]" : ""}>
              {t("settings.expiresIn")} {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </div>
          <button onClick={() => { setCode(null); setCodeExpiry(0); }} className="text-xs text-[var(--color-text-secondary)] underline">
            {t("settings.cancel")}
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Bell size={16} className="text-[var(--color-primary)]" />
        <span className="text-sm font-medium">{t("settings.lineNotifications")}</span>
      </div>
      <Card className="cursor-pointer p-4" onClick={handleConnect}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
            <MessageCircle size={20} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.connectLine")}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{t("settings.connectLineDesc")}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
