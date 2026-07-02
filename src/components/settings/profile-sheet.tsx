"use client";
import { useState, useRef, useEffect } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/i18n/config";
import { useAppData } from "@/lib/data-provider";
import { PRESET_AVATARS, isAvatarUrl } from "@/components/svg/avatars";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSheet({ open, onClose, currentName, currentAvatar }: { open: boolean; onClose: () => void; currentName: string; currentAvatar: string | null }) {
  const { t } = useI18n();
  const { reload } = useAppData();
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar ?? "");
  useEffect(() => { setAvatar(currentAvatar ?? ""); setName(currentName); }, [currentAvatar, currentName]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 200_000) { alert("Image must be under 200KB"); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await authClient.updateUser({ name, image: avatar || null });
      await reload();
      onClose();
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  const showImg = isAvatarUrl(avatar);
  const initial = (name || "?")[0]?.toUpperCase() ?? "?";

  return (
    <BottomSheet open={open} onClose={onClose} title={t("settings.profile")}>
      <div className="space-y-5 p-6 pb-8">
        <div className="flex justify-center">
          <div className="relative">
            {showImg ? (
              <img src={avatar} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-2xl font-bold text-[var(--color-primary)]">{initial}</div>
            )}
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("settings.displayName")}</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("settings.namePlaceholder")}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none" />
        </div>

        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{t("settings.chooseAvatar")}</p>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_AVATARS.map((a) => (
              <button key={a.id} onClick={() => setAvatar(a.url)}
                className={cn("aspect-square overflow-hidden rounded-xl border-2 transition-all",
                  avatar === a.url ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-surface)]" : "border-transparent")}
              >
                <img src={a.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={handleSave} disabled={saving || !name.trim()}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? t("settings.saving") : t("settings.save")}
        </button>
      </div>
    </BottomSheet>
  );
}
