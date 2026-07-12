"use client";
import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";

// ponytail: shared rename modal — used by wallet + category settings
export function RenameSheet({
  open, currentName, title, onClose, onSave,
}: {
  open: boolean;
  currentName: string;
  title: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}) {
  const [value, setValue] = useState(currentName);
  // ponytail: no effect to sync — caller uses key={currentName} to remount on target change

  async function handleSave() {
    if (value.trim() && value.trim() !== currentName) await onSave(value.trim());
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="space-y-4 p-6 pb-8">
        <input
          type="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-text-secondary)]">
            ยกเลิก
          </button>
          <button onClick={handleSave} className="flex-1 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white">
            บันทึก
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
