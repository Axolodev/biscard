export const WELCOME_COOKIE = "WELCOME_SEEN";
const MAX_AGE = 60 * 60 * 24 * 365;

/** Client-only: has the visitor already dismissed the welcome modal? */
export function hasSeenWelcome(): boolean {
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${WELCOME_COOKIE}=`));
}

/** Client-only: remember that the welcome modal was dismissed (1 year). */
export function markWelcomeSeen(): void {
  document.cookie = `${WELCOME_COOKIE}=1; path=/; max-age=${MAX_AGE}; samesite=lax`;
}
