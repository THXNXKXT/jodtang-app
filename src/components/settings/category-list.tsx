"use client";
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { PencilIcon } from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { useAppData } from "@/lib/data-provider";
import { useI18n } from "@/i18n/config";
import { updateCategory } from "@/server/actions/categories";
import { catName } from "@/lib/utils";
import { RenameSheet } from "@/components/ui/rename-sheet";
import type { Category } from "@/types";

export function CategoryList() {
  const { locale } = useI18n();
  const { categories, reload } = useAppData();

  async function handleRename(id: number, name: string) {
    await updateCategory(id, { name });
    await reload();
  }

  const expense = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");

  return (
    <div className="space-y-5">
      <Section title="รายจ่าย" items={expense} onRename={handleRename} locale={locale} />
      <Section title="รายรับ" items={income} onRename={handleRename} locale={locale} />
    </div>
  );
}

function Section({
  title, items, onRename, locale,
}: {
  title: string;
  items: Category[];
  onRename: (id: number, name: string) => Promise<void>;
  locale: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase text-[var(--color-text-muted)]">{title}</p>
      <div className="space-y-2">
        {items.map((cat) => (
          <CategoryRow key={cat.id} cat={cat} onRename={onRename} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({
  cat, onRename, locale,
}: {
  cat: Category;
  onRename: (id: number, name: string) => Promise<void>;
  locale: string;
}) {
  const controls = useAnimation();
  const Icon = CATEGORY_ICONS[cat.icon];
  const color = CATEGORY_COLORS[cat.icon] ?? "#525252";
  const id = Number(cat.id);
  const displayName = catName(cat, locale);
  const [renameOpen, setRenameOpen] = useState(false);

  async function snapBack() {
    await controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 40 } });
  }

  async function openRename() {
    await snapBack();
    setRenameOpen(true);
  }

  async function saveRename(name: string) {
    await onRename(id, name);
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={openRename}
        className="absolute inset-y-0 right-0 flex w-20 flex-col items-center justify-center gap-0.5 bg-[var(--color-primary)] text-white"
        aria-label="edit"
      >
        <PencilIcon size={16} />
        <span className="text-[10px]">แก้ไข</span>
      </button>
      <motion.div
        animate={controls}
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x > -40) controls.start({ x: 0 });
          else if (info.offset.x < -80) openRename();
        }}
        className="relative flex items-center gap-3 bg-[var(--color-surface)] px-3 py-2.5"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: color + "1a", color }}>
          {Icon ? <Icon size={14} /> : null}
        </span>
        <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-primary)]">
          {displayName}
        </span>
      </motion.div>

      <RenameSheet
        key={renameOpen ? displayName : "closed"}
        open={renameOpen}
        currentName={displayName}
        title="แก้ไขหมวดหมู่"
        onClose={() => setRenameOpen(false)}
        onSave={saveRename}
      />
    </div>
  );
}
