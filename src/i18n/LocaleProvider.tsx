"use client";

import { NextIntlClientProvider } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  MESSAGES,
  type Locale,
} from "./config";

const SetLocaleContext = createContext<((locale: Locale) => void) | null>(null);

/** Returns a function that switches the language and stores it in the cookie. */
export function useSetLocale() {
  const setLocale = useContext(SetLocaleContext);
  if (!setLocale) {
    throw new Error("useSetLocale must be used inside <LocaleProvider>");
  }
  return setLocale;
}

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

interface LocaleProviderProps {
  /** Locale resolved on the server (cookie, else Accept-Language). */
  initialLocale: Locale;
  children: ReactNode;
}

/**
 * Provides next-intl messages and owns the active locale. Changing the
 * locale re-renders instantly on the client and persists it in a cookie so
 * the server renders the same language on the next visit.
 */
export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeLocaleCookie(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <SetLocaleContext.Provider value={setLocale}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
        {children}
      </NextIntlClientProvider>
    </SetLocaleContext.Provider>
  );
}
