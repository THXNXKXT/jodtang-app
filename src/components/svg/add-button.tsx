export function AddButtonSVG({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="24" fill="#3b82f6" />
      <path d="M28 18V38M18 28H38" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
