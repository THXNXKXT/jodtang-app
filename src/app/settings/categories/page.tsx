"use client";
import { PageTransition } from "@/components/layout/page-transition";
import { CategoryList } from "@/components/settings/category-list";
import { useI18n } from "@/i18n/config";

export default function CategoriesPage() {
  const { t } = useI18n();
  return (
    <PageTransition>
      <div className="space-y-4 p-4 pt-6">
        <h1 className="text-lg font-bold text-[var(--color-text-primary)]">{t("settings.categories")}</h1>
        <CategoryList />
      </div>
    </PageTransition>
  );
}
