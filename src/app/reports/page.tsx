"use client";

import { useState } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { BudgetsTab } from "@/components/reports/budgets-tab";
import { GoalsTab } from "@/components/reports/goals-tab";
import { OverviewTab } from "@/components/reports/overview-tab";
import { useI18n } from "@/i18n/config";

export default function ReportsPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState("overview");

  return (
    <PageTransition>
      <div className="space-y-4 p-4">
        <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
          {t("reports.title")}
        </h1>
        <SegmentedControl
          segments={[
            { value: "overview", label: t("reports.overview") },
            { value: "budgets", label: t("reports.budgets") },
            { value: "goals", label: t("reports.goals") },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === "overview" ? <OverviewTab /> : null}
        {tab === "budgets" ? <BudgetsTab /> : null}
        {tab === "goals" ? <GoalsTab /> : null}
      </div>
    </PageTransition>
  );
}
