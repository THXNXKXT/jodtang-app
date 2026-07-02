export function AddButtonSVG({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="abg" x1="14" y1="6" x2="42" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e40af" />
        </linearGradient>
        <radialGradient id="aglow" cx="28" cy="24" r="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93c5fd" stopOpacity="0.6" />
          <stop offset="1" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="28" r="28" fill="#1e40af" fillOpacity="0.15" />
      <circle cx="28" cy="28" r="24" fill="url(#abg)" />
      <circle cx="28" cy="28" r="24" fill="url(#aglow)" />
      <circle cx="28" cy="28" r="23" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
      <path d="M28 17V39M17 28H39" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
