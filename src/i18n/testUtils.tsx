import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import type { Locale } from "./config";
import { DEFAULT_THEME } from "@/theme/config";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { LocaleProvider } from "./LocaleProvider";

/** Renders `ui` inside the app's locale provider (English by default). */
export function renderWithIntl(ui: ReactElement, locale: Locale = "en") {
  return render(
    <ThemeProvider initialTheme={DEFAULT_THEME}>
      <LocaleProvider initialLocale={locale}>{ui}</LocaleProvider>
    </ThemeProvider>,
  );
}
