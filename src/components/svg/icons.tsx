import type React from "react";

type IconProps = { size?: number; className?: string; style?: React.CSSProperties; strokeWidth?: number };

function s(paths: React.ReactNode) {
  return ({ size = 20, className, style, strokeWidth = 2 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      {paths}
    </svg>
  );
}

export const LayoutDashboardIcon = s(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>);
export const ReceiptTextIcon = s(<><path d="M4 4h16v16H4z"/><path d="M8 9h8"/><path d="M8 13h5"/><path d="M8 17h3"/></>);
export const BarChart3Icon = s(<><path d="M3 3v18h18"/><rect x="7" y="10" width="4" height="8" rx="1"/><rect x="15" y="5" width="4" height="13" rx="1"/></>);
export const SettingsIcon = s(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>);
export const PlusIcon = s(<><path d="M12 5v14M5 12h14"/></>);
export const MinusIcon = s(<><path d="M5 12h14"/></>);
export const ArrowLeftRightIcon = s(<><path d="M8 7L4 12l4 5"/><path d="M16 17l4-5-4-5"/><path d="M4 12h16"/></>);
export const XIcon = s(<><path d="M18 6L6 18M6 6l12 12"/></>);
export const AlertTriangleIcon = s(<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>);
export const RotateCcwIcon = s(<><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 5v6h6"/></>);
export const CameraIcon = s(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>);
export const Trash2Icon = s(<><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>);
export const GlobeIcon = s(<><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>);
export const DownloadIcon = s(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>);
export const LogOutIcon = s(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></>);
export const PaletteIcon = s(<><circle cx="13.5" cy="13.5" r="1.5" fill="currentColor"/><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor"/><circle cx="20.5" cy="13.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="13.5" r="1.5" fill="currentColor"/><circle cx="13.5" cy="20.5" r="1.5" fill="currentColor"/></>);
export const SunIcon = s(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>);
export const MoonIcon = s(<><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>);
export const MonitorIcon = s(<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></>);
export const ChevronLeftIcon = s(<><path d="M15 18l-6-6 6-6"/></>);
export const ChevronRightIcon = s(<><path d="M9 18l6-6-6-6"/></>);
export const MailIcon = s(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-8.5 6.5a3 3 0 0 1-3 0L2 6"/></>);
export const LockIcon = s(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>);
export const EyeIcon = s(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>);
export const EyeOffIcon = s(<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12m-7.82 1.7L3 3m18 18l-2.12-2.12"/></>);
export const WalletIcon = s(<><path d="M4 6h16v12H4z"/><path d="M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M16 12h.01"/></>);
export const FilterIcon = s(<><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></>);
export const SearchIcon = s(<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>);
export const CalendarIcon = s(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></>);
export const TrendingUpIcon = s(<><path d="M23 6l-7.5 7.5-5-5L1 18"/><path d="M17 6h6v6"/></>);
export const HomeIcon = s(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></>);
export const UtensilsIcon = s(<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/><path d="M15 15v5"/></>);
export const CarIcon = s(<><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1.93 1.93 0 0 0-2.8-.17L8 11l-5.16 1.08a1 1 0 0 0-.84 1v3.99H4"/><circle cx="6.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></>);
export const ShoppingBagIcon = s(<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>);
export const FilmIcon = s(<><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/><path d="M2 7h5"/><path d="M2 17h5"/><path d="M17 17h5"/><path d="M17 7h5"/></>);
export const ZapIcon = s(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>);
export const HeartIcon = s(<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>);
export const GraduationCapIcon = s(<><path d="M22 10l-10-6-10 6 10 6 10-6z"/><path d="M6 12v5a6 6 0 0 0 12 0v-5"/></>);
export const PlaneIcon = s(<><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></>);
export const GiftIcon = s(<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>);
export const DumbbellIcon = s(<><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 20v-3"/><path d="M18 20v-3"/><path d="M6 10V7"/><path d="M18 10V7"/><path d="M9 7v10"/><path d="M15 7v10"/></>);
export const PhoneIcon = s(<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>);
export const DropletIcon = s(<><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></>);
export const CreditCardIcon = s(<><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></>);
export const BanknoteIcon = s(<><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></>);
export const SmartphoneIcon = s(<><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></>);
export const PiggyBankIcon = s(<><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 1.2 3.6 3 5L8 20l3-2c1 .2 2.5.3 3.5.3"/><path d="M2 8v6"/><path d="M22 12h-4"/><path d="M19 7c.7 0 1.4.3 2 1"/></>);
export const BriefcaseIcon = s(<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>);
export const CoffeeIcon = s(<><path d="M18 8h1.79A2.5 2.5 0 0 1 22.29 10h0a2.5 2.5 0 0 1-2.5 2.5H18"/><path d="M2 8h16v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V8z"/><path d="M6 2v4"/><path d="M10 2v4"/><path d="M14 2v4"/></>);
export const PawPrintIcon = s(<><ellipse cx="12" cy="17" rx="5" ry="4"/><path d="M12 9a5 5 0 0 0 0-7 5 5 0 0 0 0 7z"/><ellipse cx="5" cy="9" rx="2" ry="3"/><ellipse cx="19" cy="9" rx="2" ry="3"/><ellipse cx="8" cy="4" rx="1.5" ry="2"/><ellipse cx="16" cy="4" rx="1.5" ry="2"/></>);
export const StoreIcon = s(
<><path d="M3 7l5 5 2-2 5-5"/><path d="M21 7l-5 5-2-2-5-5"/><path d="M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/><path d="M8 20V10"/><path d="M16 20V10"/></>);
export const UserIcon = s(
<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>);
export const Loader2Icon = s(
<><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></>);
export const TrendingDownIcon = s(
<><path d="M23 18l-7.5-7.5-5 5L1 6"/><path d="M17 18h6v-6"/></>);
export const BellIcon = s(
<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>);
export const CopyIcon = s(
<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>);
export const CheckIcon = s(
<><path d="M20 6L9 17l-5-5"/></>);
export const MessageCircleIcon = s(
<><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>);
export const ExternalLinkIcon = s(
<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></>);
export const ClockIcon = s(
<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>);
export const MonitorSmartphoneIcon = s(
<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M17 10h.01"/></>);
