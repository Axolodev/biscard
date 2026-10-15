"use client";

import { useId, useState } from "react";

/**
 * Languages the language dropdown offers. English is the default; no
 * translation behavior is wired up for either value yet — selecting one
 * just calls `onLanguageChange` with the code below.
 */
export type Language = "en" | "es";

interface LanguageOption {
  label: string;
  value: Language;
}

const LANGUAGES: LanguageOption[] = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
];

interface ThemeOption {
  /** Label shown in the theme-controller dropdown. */
  label: string;
  /** DaisyUI theme name this option switches to. */
  value: string;
}

/**
 * Themes offered in the theme-controller dropdown, per the Figma design
 * (node 26:11929, "Modal + Backdrop"): this app's own theme first — labeled
 * "Default" in this dropdown — followed by four of DaisyUI's built-in
 * themes. All five are enabled via the `themes:` list in
 * `src/app/globals.css`.
 */
const THEMES: ThemeOption[] = [
  { label: "Default", value: "biscard" },
  { label: "Retro", value: "retro" },
  { label: "Cyberpunk", value: "cyberpunk" },
  { label: "Valentine", value: "valentine" },
  { label: "Aqua", value: "aqua" },
];

export interface ModalProps {
  /**
   * Called whenever the user picks a different option in the language
   * dropdown, with the selected language code. The caller owns any actual
   * translation behavior — nothing happens here beyond the callback.
   */
  onLanguageChange: (language: Language) => void;
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
  const [theme, setTheme] = useState<string>(THEMES[0].value);
  const [language, setLanguage] = useState<Language>(LANGUAGES[0].value);

  const selectedThemeLabel =
    THEMES.find((option) => option.value === theme)?.label ?? THEMES[0].label;

  function selectLanguage(option: LanguageOption) {
    setLanguage(option.value);
    onLanguageChange(option.value);
  }

  return (
    <dialog open aria-label="Settings" className="modal">
      <div className="modal-box relative max-w-[512px]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
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

        <h3 className="text-lg font-bold">Settings</h3>

        <div className="flex flex-col gap-3 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex-1 font-semibold">Theme</span>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-sm">
                {selectedThemeLabel}
              </div>
              <ul className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
                {THEMES.map((option) => (
                  <li key={option.value}>
                    <input
                      type="radio"
                      name={`theme-dropdown-${themeGroupName}`}
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label={option.label}
                      value={option.value}
                      checked={theme === option.value}
                      onChange={() => setTheme(option.value)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1 font-semibold">Language</span>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label="Language"
                className="btn btn-sm flex items-center gap-1.5 px-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element --
                    see the close-icon comment above for why these local
                    SVGs stay plain <img> rather than next/image. */}
                <img
                  src="/modal-flag-en.svg"
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
                  <li key={option.value}>
                    <button
                      type="button"
                      className="btn btn-sm btn-block btn-ghost justify-start"
                      aria-pressed={language === option.value}
                      onClick={() => selectLanguage(option)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-action justify-end">
          <button type="button" onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close backdrop"
        className="modal-backdrop"
      />
    </dialog>
  );
}
