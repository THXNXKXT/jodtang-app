"use client";
import { useState, useCallback } from "react";
import { I18nContext, defaultLocale, messages, type Locale } from "./config";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  return (
    <I18nContext.Provider value={{ locale, messages: messages[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
