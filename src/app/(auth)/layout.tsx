export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-bg)] px-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
