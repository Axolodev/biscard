/**
 * Themes the app offers: its own "g3co" theme first (labeled "Default" in
 * the UI), followed by nine of DaisyUI's built-ins. All five are enabled in
 * `src/app/globals.css`.
 */
export const THEMES = [
  "g3co",
  "luxury",
  "synthwave",
  "dracula",
  "caramellatte",
  "abyss",
  "autumn",
  "fantasy",
  "retro",
  "pastel",
] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "g3co";
export const THEME_COOKIE = "NEXT_THEME";
/** One year, in seconds. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** The stored theme if it is a known one, otherwise the default. */
export function resolveTheme(cookieValue: string | null | undefined): Theme {
  return isTheme(cookieValue) ? cookieValue : DEFAULT_THEME;
}
