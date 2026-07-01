import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nContext, defaultLocale, messages, type Locale } from "@/i18n/config";
import { useState, useCallback } from "react";

const inter = Inter({ subsets: ["latin", "thai"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Jodtang — จดตัง",
  description: "Mobile-first personal finance tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <I18nContext.Provider value={{ locale, messages: messages[locale], setLocale }}>
          {children}
        </I18nContext.Provider>
      </body>
    </html>
  );
}
