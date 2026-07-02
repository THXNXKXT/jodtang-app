"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/config";
import { generateLinkCode, updateNotifyFreq, getLineSettings } from "@/server/actions/line";
import { Bell, Copy, Check, MessageCircle, ExternalLink } from "lucide-react";

export function LineSection() {
  const { t } = useI18n();
  const [lineId, setLineId] = useState<string | null>(null);
  const [freq, setFreq] = useState<"daily" | "monthly" | "off">("off");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getLineSettings().then(s => {
      if (s) { setLineId(s.lineId); setFreq((s.notifyFreq ?? "off") as typeof freq); }
    }).catch(() => {});
  }, []);

  const connected = lineId && !lineId.startsWith("pending:");

  async function handleConnect() {
    const c = await generateLinkCode();
    setCode(c);
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
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl bg-[var(--color-surface-2)] px-4 py-3 text-center">
              <span className="text-2xl font-bold tracking-[0.2em] tabular-nums">{code}</span>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface-2)]"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            </button>
          </div>
          <button onClick={() => setCode(null)} className="text-xs text-[var(--color-text-secondary)] underline">
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
