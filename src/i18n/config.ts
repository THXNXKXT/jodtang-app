import { createContext, useContext } from "react";
import th from "./messages.th.json";
import en from "./messages.en.json";

export type Locale = "th" | "en";

export const messages = { th, en } as const;
export const defaultLocale: Locale = "th";

type Messages = typeof th;

export const I18nContext = createContext<{
  locale: Locale;
  messages: Messages;
  setLocale: (l: Locale) => void;
}>({
  locale: defaultLocale,
  messages: th,
  setLocale: () => {},
});

export function useI18n() {
  const ctx = useContext(I18nContext);
  function t(path: string): string {
    const keys = path.split(".");
    let value: unknown = ctx.messages;
    for (const key of keys) {
      if (typeof value === "object" && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }
    return typeof value === "string" ? value : path;
  }
  return { t, locale: ctx.locale, setLocale: ctx.setLocale };
}
