export function EmptyWalletIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="140" rx="60" ry="6" fill="var(--color-border)" />
      <rect x="50" y="50" width="100" height="70" rx="12" fill="var(--color-surface-hover)" stroke="var(--color-border)" strokeWidth="2"/>
      <rect x="50" y="62" width="100" height="14" rx="7" fill="var(--color-primary)" fillOpacity="0.1"/>
      <circle cx="130" cy="90" r="14" fill="var(--color-primary)" fillOpacity="0.15" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="3 3"/>
      <path d="M125 90L128.5 93.5L135 87" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="62" y="85" width="50" height="6" rx="3" fill="var(--color-text-muted)" fillOpacity="0.4"/>
      <rect x="62" y="97" width="35" height="5" rx="2.5" fill="var(--color-text-muted)" fillOpacity="0.3"/>
      <path d="M70 40C70 35 75 32 80 34" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4"/>
      <path d="M120 35C120 30 125 27 130 29" stroke="var(--color-income)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4"/>
    </svg>
  );
}
