"use client";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-black">
      <div className="relative w-full max-w-[480px] bg-[var(--color-bg)]">
        <main className="min-h-dvh pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
