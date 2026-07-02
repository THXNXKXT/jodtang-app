export function AddButtonSVG({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="addGrad" x1="0" y1="0" x2="0" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <filter id="addGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect x="4" y="4" width="48" height="48" rx="16" fill="url(#addGrad)" />
      <rect x="4.5" y="4.5" width="47" height="47" rx="15.5" stroke="white" strokeOpacity="0.15" />
      <path d="M28 16V40M16 28H40" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="28" cy="28" r="22" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" fill="none" />
    </svg>
  );
}
