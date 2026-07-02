import type React from "react";
export const PRESET_AVATARS = [
  { id: "a1", color: "#3b82f6", svg: '<circle cx="16" cy="12" r="5"/><circle cx="16" cy="32" r="10"/>' },
  { id: "a2", color: "#10b981", svg: '<rect x="8" y="6" width="16" height="10" rx="5"/><circle cx="16" cy="30" r="11"/>' },
  { id: "a3", color: "#f97316", svg: '<path d="M16 6 L26 18 L6 18 Z"/><circle cx="16" cy="30" r="10"/>' },
  { id: "a4", color: "#a855f7", svg: '<polygon points="16,5 27,12 23,25 9,25 5,12"/><circle cx="16" cy="32" r="9"/>' },
  { id: "a5", color: "#ef4444", svg: '<path d="M16 5c-4 0-7 3-7 7 0 3 2 5 4 6v2h6v-2c2-1 4-3 4-6 0-4-3-7-7-7z"/><rect x="10" y="22" width="12" height="3" rx="1"/><circle cx="16" cy="32" r="9"/>' },
  { id: "a6", color: "#06b6d4", svg: '<circle cx="12" cy="13" r="2.5"/><circle cx="20" cy="13" r="2.5"/><circle cx="16" cy="8" r="2.5"/><path d="M6 32c0-6 4-10 10-10s10 4 10 10"/>' },
  { id: "a7", color: "#eab308", svg: '<path d="M16 4l4 8 9 1-6.5 6 2 9-8.5-5-8.5 5 2-9-6.5-6 9-1z"/>' },
  { id: "a8", color: "#ec4899", svg: '<rect x="6" y="6" width="20" height="20" rx="4"/><circle cx="16" cy="16" r="6"/>' },
  { id: "a9", color: "#14b8a6", svg: '<path d="M16 4C9 4 4 9 4 16s5 12 12 12 12-5 12-12S23 4 16 4zm0 4a4 4 0 110 8 4 4 0 010-8z"/>' },
  { id: "a10", color: "#6366f1", svg: '<path d="M16 2L2 16l14 14 14-14L16 2zm0 6l8 8-8 8-8-8 8-8z"/>' },
];

export function avatarSVG(avatarId: string | null | undefined, customImage: string | null | undefined, name: string): React.ReactNode {
  if (customImage) return null;
  const preset = PRESET_AVATARS.find((a) => a.id === avatarId);
  const p = preset ?? PRESET_AVATARS[0]!;
  const initial = (name || "?")[0]?.toUpperCase() ?? "?";
  return (
    <svg viewBox="0 0 32 40" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="40" rx="8" fill={p.color} fillOpacity="0.15" />
      <g fill={p.color} fillOpacity="0.7" dangerouslySetInnerHTML={{ __html: p.svg }} />
      <text x="16" y="17" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.color}>{initial}</text>
    </svg>
  );
}
