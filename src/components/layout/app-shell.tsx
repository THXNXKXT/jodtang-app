"use client";
import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // ponytail: landing (/) = full screen no constraints, auth = no nav, app = mobile-first with nav
  const isLanding = pathname === "/";
  const isAuth = pathname === "/login" || pathname === "/signup";
  const showChrome = !isLanding && !isAuth;

  if (isLanding) return <>{children}</>;

  return (
    <div className="flex min-h-dvh justify-center bg-black">
      <div className="relative w-full max-w-[480px] bg-[var(--color-bg)]">
        <main className={showChrome ? "min-h-dvh pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]" : "min-h-dvh"}>
          {children}
        </main>
        {showChrome && <BottomNav />}
      </div>
    </div>
  );
}
