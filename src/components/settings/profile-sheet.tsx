"use client";
import { useState, useRef } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { authClient } from "@/lib/auth-client";
import { useAppData } from "@/lib/data-provider";
import { PRESET_AVATARS } from "@/components/svg/avatars";
import { Camera, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSheet({ open, onClose, currentName, currentAvatar }: { open: boolean; onClose: () => void; currentName: string; currentAvatar: string | null }) {
  const { reload } = useAppData();
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar ?? "");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function selectPreset(id: string) { setAvatar("preset:" + id); }
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 200_000) { alert("รูปต้องมีขนาดไม่เกิน 200KB"); return; }
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

  return (
    <BottomSheet open={open} onClose={onClose} title="โปรไฟล์">
      <div className="space-y-5 p-6 pb-8">
        <div className="flex justify-center">
          <div className="relative">
            {avatar.startsWith("data:") ? (
              <img src={avatar} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-2xl font-bold text-[var(--color-primary)]">
                {(name || "?")[0]?.toUpperCase()}
              </div>
            )}
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">ชื่อที่แสดง</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อของคุณ"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none" />
        </div>
        <div>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">เลือกรูปประจำตัว</p>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_AVATARS.map((a) => {
              const id = "preset:" + a.id;
              return (
                <button key={a.id} onClick={() => selectPreset(a.id)}
                  className={cn("flex aspect-square items-center justify-center rounded-xl border-2 transition-colors",
                    avatar === id ? "border-[var(--color-primary)]" : "border-transparent")}
                  style={{ backgroundColor: a.color + "1a" }}>
                  <svg viewBox="0 0 32 32" className="h-7 w-7" dangerouslySetInnerHTML={{ __html: '<g fill="' + a.color + '" fill-opacity="0.7">' + a.svg + "</g>" }} />
                </button>
              );
            })}
          </div>
        </div>
        <button type="button" onClick={handleSave} disabled={saving || !name.trim()}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>
    </BottomSheet>
  );
}
