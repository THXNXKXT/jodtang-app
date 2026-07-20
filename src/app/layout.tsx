import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppShell } from "@/components/layout/app-shell";

const plex = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jodtang-app.vercel.app"),
  title: {
    default: "จดตัง — แอปจดบันทึกรายรับรายจ่าย",
    template: "%s | จดตัง",
  },
  description: "จดบันทึกรายรับรายจ่ายง่ายๆ บนมือถือ สรุปยอดรายวัน รายเดือน แจ้งเตือนผ่าน LINE",
  manifest: "/manifest.webmanifest",
  keywords: ["จดตัง", "จดบันทึกเงิน", "รายรับรายจ่าย", "การเงินส่วนบุคคล", "personal finance", "expense tracker", "thai"],
  authors: [{ name: "Jodtang" }],
  openGraph: {
    type: "website",
    locale: "th_TH",
    title: "จดตัง — แอปจดบันทึกรายรับรายจ่าย",
    description: "จดบันทึกรายรับรายจ่ายง่ายๆ สรุปยอดรายวัน แจ้งเตือนผ่าน LINE",
    siteName: "จดตัง",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "จดตัง — แอปจดบันทึกรายรับรายจ่าย" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "จดตัง — แอปจดบันทึกรายรับรายจ่าย",
    description: "จดบันทึกรายรับรายจ่ายง่ายๆ สรุปยอดรายวัน แจ้งเตือนผ่าน LINE",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "จดตัง",
  },
};

export const viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={plex.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(() => { try { const t = localStorage.getItem('jodtang-theme'); if (!t || t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark'); } catch(e) { document.documentElement.classList.add('dark'); } })()` }} />
        {/* ponytail: register SW only in production — dev server cache fights HMR */}
        {process.env.NODE_ENV === "production" && (
          <script dangerouslySetInnerHTML={{ __html: `if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));` }} />
        )}
      </head>
      <body>
        <ThemeProvider>
          <I18nProvider>
            <AppShell>{children}</AppShell>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
