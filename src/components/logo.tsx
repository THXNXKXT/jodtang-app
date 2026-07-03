import { Coins } from "phosphor-react";

export function Logo({ size = 48 }: { size?: number }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
      <Coins size={size * 0.55} weight="bold" />
    </div>
  );
}
