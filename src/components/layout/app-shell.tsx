"use client";
import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/signup";
  const mainClass = isAuth
    ? "min-h-dvh"
    : "min-h-dvh pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]";

  return (
    <div className="flex min-h-dvh justify-center bg-black">
      <div className="relative w-full max-w-[480px] bg-[var(--color-bg)]">
        <main className={mainClass}>
          {children}
        </main>
        {!isAuth && <BottomNav />}
      </div>
    </div>
  );
}
