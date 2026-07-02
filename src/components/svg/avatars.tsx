const API = "https://api.dicebear.com/9.x";

export const PRESET_AVATARS = [
  { id: "bot1", url: API + "/bottts-neutral/svg?seed=Felix&backgroundColor=3b82f6" },
  { id: "bot2", url: API + "/bottts-neutral/svg?seed=Avery&backgroundColor=10b981" },
  { id: "bot3", url: API + "/bottts-neutral/svg?seed=Milo&backgroundColor=f97316" },
  { id: "bot4", url: API + "/bottts-neutral/svg?seed=Luna&backgroundColor=a855f7" },
  { id: "bot5", url: API + "/bottts-neutral/svg?seed=Zoe&backgroundColor=ef4444" },
  { id: "bot6", url: API + "/bottts-neutral/svg?seed=Ruby&backgroundColor=06b6d4" },
  { id: "bot7", url: API + "/bottts-neutral/svg?seed=Leo&backgroundColor=eab308" },
  { id: "bot8", url: API + "/bottts-neutral/svg?seed=Ivy&backgroundColor=ec4899" },
  { id: "bot9", url: API + "/bottts-neutral/svg?seed=Finn&backgroundColor=14b8a6" },
  { id: "bot10", url: API + "/bottts-neutral/svg?seed=Nina&backgroundColor=6366f1" },
];

export function isAvatarUrl(s: string | null | undefined): s is string {
  return !!s && (s.startsWith("http") || s.startsWith("data:"));
}
