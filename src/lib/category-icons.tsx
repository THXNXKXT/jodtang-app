import type React from "react";

type IconProps = { size?: number; color?: string; className?: string; style?: React.CSSProperties };

function wrap(paths: React.ReactNode, viewBox = "0 0 24 24") {
  return ({ size = 20, color = "currentColor", className, style }: IconProps) => (
    <svg width={size} height={size} viewBox={viewBox} fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      {paths}
    </svg>
  );
}

const p = (d: string, opts?: { fill?: boolean; stroke?: boolean }) => (
  <path key={d} d={d} fill={opts?.fill ? "currentColor" : "none"} stroke={opts?.fill ? undefined : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
);

export const CATEGORY_ICONS: Record<string, React.ComponentType<IconProps>> = {
  food: wrap(<><path d="M4 10h16v2a6 6 0 0 1-12 0v-2" /><path d="M8 10V5a2 2 0 0 1 4 0v5" /><path d="M16 10V5a2 2 0 0 1 4 0v5" /></>),
  transport: wrap(<><path d="M4 10h16v6H4z" /><path d="M6 16v2" /><path d="M18 16v2" /><path d="M8 10V7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3" /><circle cx="7.5" cy="13.5" r="1.5" fill="currentColor" /><circle cx="16.5" cy="13.5" r="1.5" fill="currentColor" /></>),
  shopping: wrap(<><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6L5 3H2" /><circle cx="9" cy="20" r="1.5" fill="currentColor" /><circle cx="18" cy="20" r="1.5" fill="currentColor" /></>),
  entertainment: wrap(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 9l5 3-5 3z" /></>),
  utilities: wrap(<><path d="M13 2L5 14h7l-1 8 9-12h-7l2-8z" /></>),
  health: wrap(<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>),
  education: wrap(<><path d="M12 3L1 9l11 6 9-4.91" /><path d="M5 11v5a7 7 0 0 0 14 0v-5" /></>),
  travel: wrap(<><path d="M2 12h20" /><path d="M2 12l8-4" /><path d="M2 12l8 4" /><path d="M22 12l-3-1" /><path d="M22 12l-3 1" /></>),
  gift: wrap(<><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13" /><path d="M19 8v13" /><path d="M7 8a4 4 0 0 1 4-4 4 4 0 0 1 4 4" /><path d="M8 8a3 3 0 0 1 0-6 3 3 0 0 1 3 3" /></>),
  fitness: wrap(<><path d="M6 5h2v14H6z" /><path d="M16 5h2v14h-2z" /><path d="M8 9h8" /><path d="M8 15h8" /></>),
  phone: wrap(<><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 17h2" /></>),
  water: wrap(<><path d="M12 2c-4 6-7 10-7 14a7 7 0 0 0 14 0c0-4-3-8-7-14z" /></>),
  other_expense: wrap(<><circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M8 12h8" /></>),
  salary: wrap(<><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" /></>),
  freelance: wrap(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M12 6v7" /></>),
  investment: wrap(<><path d="M3 17l6-6 4 4 8-8" /><path d="M17 3h6v6" /></>),
  gift_income: wrap(<><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13" /><path d="M19 8v13" /><path d="M7 8a4 4 0 0 1 4-4 4 4 0 0 1 4 4" /></>),
  other_income: wrap(<><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /><path d="M7 12h10" /></>),
  refund: wrap(<><path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 5v6h6" /></>),
  rent: wrap(<><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /></>),
  coffee: wrap(<><path d="M18 8h2a2 2 0 0 1 0 4h-2" /><path d="M2 8h16v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V8z" /><path d="M6 2v4" /><path d="M10 2v4" /><path d="M14 2v4" /></>),
  pet: wrap(<><circle cx="11" cy="11" r="8" /><path d="M21.8 21.8l-2.1-2.1" /><path d="M8 9h.01" /><path d="M14 9h.01" /></>),
  repair: wrap(<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.6-3.6a5 5 0 0 1-1.8 8.4" /><path d="M15 12l-4 4" /><path d="M9.3 17.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-3.6 3.6a5 5 0 0 1 1.8-8.4" /></>),
  selling: wrap(<><path d="M3 6h18" /><path d="M3 10h18" /><path d="M6 6v14" /><path d="M18 6v14" /><path d="M9 14h6" /></>),
  cash: wrap(<><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></>),
  bank: wrap(<><path d="M4 10h16" /><path d="M4 10v10" /><path d="M20 10v10" /><path d="M12 3L2 10h20L12 3z" /><path d="M8 14h8" /></>),
  ewallet: wrap(<><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M6 8h12" /><path d="M15 13h.01" /></>),
  savings: wrap(<><path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z" /><path d="M8 12h8" /><path d="M12 8v8" /></>),
};
