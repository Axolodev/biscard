"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { THEME_COOKIE, THEME_COOKIE_MAX_AGE, type Theme } from "./config";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Returns the active theme and a setter that also stores it in the cookie. */
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return value;
}

function writeThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

interface ThemeProviderProps {
  /** Theme resolved on the server from the cookie (already on `<html>`). */
  initialTheme: Theme;
  children: ReactNode;
}

/**
 * Owns the active theme. The server renders `data-theme` from the cookie,
 * so there is no flash on load; changing the theme updates `<html>`
 * instantly and persists it in the cookie for the next visit.
 */
export function ThemeProvider({ initialTheme, children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    writeThemeCookie(next);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
