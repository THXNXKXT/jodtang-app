"use client";
import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { deleteAccount } from "@/server/actions/delete-account";
import { authClient } from "@/lib/auth-client";
import { TrashIcon } from "lucide-react";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    if (confirmText !== "ลบบัญชี") {
      setError('พิมพ์ "ลบบัญชี" ให้ตรง');
      return;
    }
    setDeleting(true);
    const res = await deleteAccount(password);
    setDeleting(false);
    if (!res.success) { setError(res.error ?? "ลบไม่สำเร็จ"); return; }
    try { await authClient.signOut(); } catch {}
    window.location.href = "/signup";
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-expense)] px-4 py-3 text-sm font-medium text-[var(--color-expense)]"
      >
        <TrashIcon size={16} /> ลบบัญชี
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="ลบบัญชี">
        <div className="space-y-4 p-6 pb-8">
          <div className="rounded-xl bg-[var(--color-expense)]/10 p-4 text-sm text-[var(--color-expense)]">
            การกระทำนี้ไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดจะถูกลบถาวร
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--color-text-secondary)]">
              พิมพ์ <span className="font-semibold">ลบบัญชี</span> เพื่อยืนยัน
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm outline-none text-[var(--color-text-primary)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--color-text-secondary)]">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm outline-none text-[var(--color-text-primary)]"
            />
          </div>

          {error && <p className="text-xs text-[var(--color-expense)]">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-text-secondary)]">
              ยกเลิก
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || !password || confirmText !== "ลบบัญชี"}
              className="flex-1 rounded-xl bg-[var(--color-expense)] py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {deleting ? "กำลังลบ..." : "ลบถาวร"}
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
