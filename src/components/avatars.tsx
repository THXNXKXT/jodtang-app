import React from "react";
import type { IconProps } from "@/components/icons";
import { Coin, Wallet, House, Briefcase, ChartBar, Bank, ShoppingBag, Coffee, Airplane, Gift } from "phosphor-react";

export type AvatarDef = { id: string; color: string; Icon: React.ComponentType<IconProps> };

export const PRESET_AVATARS: AvatarDef[] = [
  { id: "piggy", color: "#3b82f6", Icon: Coin },
  { id: "wallet", color: "#10b981", Icon: Wallet },
  { id: "home", color: "#f59e0b", Icon: House },
  { id: "work", color: "#8b5cf6", Icon: Briefcase },
  { id: "chart", color: "#ec4899", Icon: ChartBar },
  { id: "bank", color: "#0891b2", Icon: Bank },
  { id: "shop", color: "#f97316", Icon: ShoppingBag },
  { id: "coffee", color: "#92400e", Icon: Coffee },
  { id: "travel", color: "#14b8a6", Icon: Airplane },
  { id: "gift", color: "#d946ef", Icon: Gift },
];

export function isAvatarUrl(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:"));
}

export function getAvatarIcon(value: string | null | undefined): AvatarDef | null {
  if (!value || isAvatarUrl(value)) return null;
  const id = value.startsWith("avatar:") ? value.slice(7) : value;
  return PRESET_AVATARS.find((a) => a.id === id) ?? null;
}
