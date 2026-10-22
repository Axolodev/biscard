import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { Suspense } from "react";
import type { ReactNode } from "react";
import "./globals.css";
import { LOCALE_COOKIE, MESSAGES, resolveLocale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";

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
      data-theme="biscard"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense>
          <Localized>{children}</Localized>
        </Suspense>
      </body>
    </html>
  );
}
