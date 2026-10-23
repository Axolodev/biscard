"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";

import { useSetLocale } from "@/i18n/LocaleProvider";
import { THEMES } from "@/theme/config";
import { useTheme } from "@/theme/ThemeProvider";

/**
 * Languages the language dropdown offers. English is the default; no
 * translation behavior is wired up for either value yet — selecting one
 * just calls `onLanguageChange` with the code below.
 */
export type Language = "en" | "es";

const LANGUAGES: Language[] = ["en", "es"];

export interface ModalProps {
  /**
   * Optional notification fired after the user picks a different option in
   * the language dropdown. The modal itself already switches the app's
   * language and stores the choice in the locale cookie.
   */
  onLanguageChange?: (language: Language) => void;
  /**
   * Called whenever the modal should close: the upper "✕" button in the
   * corner, the lower "Close" button, or a click on the backdrop.
   */
  onClose: () => void;
}

/**
 * Settings modal: a DaisyUI theme-controller dropdown (built-in themes plus
 * this app's own "Default" theme), a language dropdown (English / Spanish,
 * no i18n behavior wired up beyond `onLanguageChange`), and a single
 * primary "Close" action. Matches Figma node 26:11929 ("Modal + Backdrop").
 *
 * Renders open whenever mounted — the caller (e.g. the gear icon in
 * `Heading`) is responsible for mounting/unmounting it.
 */
export function Modal({ onLanguageChange, onClose }: ModalProps) {
  const themeGroupName = useId();
  const t = useTranslations("modal");
  const language = useLocale() as Language;
  const setLocale = useSetLocale();
  const { theme, setTheme } = useTheme();

  function selectLanguage(next: Language) {
    setLocale(next);
    onLanguageChange?.(next);
  }

  return (
    <dialog open aria-label={t("ariaLabel")} className="modal">
      <div className="modal-box relative max-w-[512px]">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeSettings")}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image's
              optimizer rejects local SVGs unless `images.dangerouslyAllowSvg`
              is set, which this project doesn't opt into; a plain <img> for
              a tiny static icon is simpler and has no LCP impact here. */}
          <img
            src="/modal-close.svg"
            width={12}
            height={12}
            alt=""
            className="h-3 w-3"
          />
        </button>

        <h3 className="text-lg font-bold">{t("title")}</h3>

        <div className="flex flex-col gap-3 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex-1 font-semibold">{t("theme")}</span>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-sm">
                {t(`themes.${theme}`)}
              </div>
              <ul className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
                {THEMES.map((option) => (
                  <li key={option}>
                    <input
                      type="radio"
                      name={`theme-dropdown-${themeGroupName}`}
                      className="btn btn-sm btn-block btn-ghost justify-start"
                      aria-label={t(`themes.${option}`)}
                      value={option}
                      checked={theme === option}
                      onChange={() => setTheme(option)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1 font-semibold">{t("language")}</span>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label={t("language")}
                className="btn btn-sm flex items-center gap-1.5 px-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element --
                    see the close-icon comment above for why these local
                    SVGs stay plain <img> rather than next/image. */}
                <img
                  src={`/modal-flag-${language}.svg`}
                  width={24}
                  height={24}
                  alt=""
                  className="h-6 w-6"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/modal-chevron.svg"
                  width={20}
                  height={20}
                  alt=""
                  className="h-5 w-5 rotate-180"
                />
              </div>
              <ul className="dropdown-content bg-base-300 rounded-box z-1 w-36 p-2 shadow-2xl">
                {LANGUAGES.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      className="btn btn-sm btn-block btn-ghost justify-start"
                      aria-pressed={language === option}
                      onClick={() => selectLanguage(option)}
                    >
                      {t(`languages.${option}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-action justify-end">
          <button type="button" onClick={onClose} className="btn btn-primary">
            {t("close")}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={t("closeBackdrop")}
        className="modal-backdrop"
      />
    </dialog>
  );
}
