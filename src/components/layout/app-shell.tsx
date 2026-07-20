"use client";
import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // ponytail: hide nav on full-page routes (login, signup, landing at /)
  const isFullPage = pathname === "/login" || pathname === "/signup" || pathname === "/";

  return (
    <div className="flex min-h-dvh justify-center bg-black">
      <div className={`relative w-full ${isFullPage ? "max-w-2xl" : "max-w-[480px]"} bg-[var(--color-bg)]`}>
        <main className={isFullPage ? "min-h-dvh" : "min-h-dvh pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]"}>
          {children}
        </main>
        {!isFullPage && <BottomNav />}
      </div>
    </div>
  );
}
