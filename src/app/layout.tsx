import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { Suspense } from "react";
import type { ReactNode } from "react";
import "./globals.css";
import { LOCALE_COOKIE, MESSAGES, resolveLocale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { DEFAULT_THEME, THEMES, THEME_COOKIE, resolveTheme } from "@/theme/config";
import { ThemeProvider } from "@/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Language for this request: the stored cookie wins (returning visitor),
 * otherwise the browser's `Accept-Language` preference (first visit).
 */
async function getRequestLocale() {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  return resolveLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headerList.get("accept-language"),
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = MESSAGES[await getRequestLocale()].metadata;
  return { title, description };
}

/**
 * Runs before first paint (the cookie is only readable at request time, which
 * the static shell can't do) and applies the stored theme to `<html>`, so
 * returning visitors never see the default theme flash.
 */
const THEME_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);if(m&&${JSON.stringify(THEMES)}.indexOf(m[1])>-1)document.documentElement.dataset.theme=m[1]}catch(e){}})()`;

async function Themed({ children }: { children: ReactNode }) {
  const theme = resolveTheme((await cookies()).get(THEME_COOKIE)?.value);
  return <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>;
}

async function Localized({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider initialLocale={await getRequestLocale()}>
      {children}
    </LocaleProvider>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Suspense>
          <Themed>
            <Localized>{children}</Localized>
          </Themed>
        </Suspense>
      </body>
    </html>
  );
}
