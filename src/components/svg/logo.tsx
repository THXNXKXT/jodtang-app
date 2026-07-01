export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="var(--color-primary)" />
      <path d="M16 18C16 16.3431 17.3431 15 19 15H24C25.6569 15 27 16.3431 27 18V30C27 31.6569 25.6569 33 24 33H19C17.3431 33 16 31.6569 16 30V18Z" fill="white" fillOpacity="0.95"/>
      <path d="M27 21L31.5 18.5C32.5 18 33.5 18.7 33.5 19.8V28.2C33.5 29.3 32.5 30 31.5 29.5L27 27V21Z" fill="white" fillOpacity="0.95"/>
      <circle cx="21.5" cy="24" r="2" fill="var(--color-primary)"/>
      <path d="M14 33L34 15" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round"/>
    </svg>
  );
}
