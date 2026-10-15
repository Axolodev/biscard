/**
 * Languages the language select offers. English is the default; no
 * translation behavior is wired up for either value yet — selecting one
 * just calls `onLanguageChange` with the code below.
 */
export type Language = "en" | "es";

interface ThemeOption {
  label: string;
  value: string;
}

/**
 * Themes available in the theme-controller dropdown. Sourced from the
 * DaisyUI theme(s) actually defined in `src/app/globals.css` — "biscard" is
 * the only one right now, so the dropdown has a single choice until more
 * themes are added there.
 */
const THEMES: ThemeOption[] = [{ label: "Biscard", value: "biscard" }];

export interface ModalProps {
  /**
   * Called whenever the user picks a different option in the language
   * select, with the selected language code. The caller owns any actual
   * translation behavior — nothing happens here beyond the callback.
   */
  onLanguageChange: (language: Language) => void;
  /**
   * Called whenever the modal should close: the upper "✕" button in the
   * corner, the lower "Close" button, the "Save" button, or a click on the
   * backdrop. There is no separate save callback — Save closes the modal
   * the same way every other control here does.
   */
  onClose: () => void;
}

/**
 * Settings modal: a DaisyUI theme-controller dropdown, a language select
 * (English / Spanish, no i18n behavior wired up), and Close/Save actions.
 *
 * Renders open whenever mounted — the caller (e.g. the gear icon in
 * `Heading`) is responsible for mounting/unmounting it.
 */
export function Modal({ onLanguageChange, onClose }: ModalProps) {
  return (
    <dialog open aria-label="Settings" className="modal">
      <div className="modal-box">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-bold">Settings</h3>

        <div className="mt-4 flex flex-col gap-4">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              Theme
              <ChevronIcon className="inline-block h-2 w-2 fill-current opacity-60" />
            </div>
            <ul className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
              {THEMES.map((theme) => (
                <li key={theme.value}>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label={theme.label}
                    value={theme.value}
                    defaultChecked
                  />
                </li>
              ))}
            </ul>
          </div>

          <label className="flex flex-col gap-1">
            <span className="label-text">Language</span>
            <select
              aria-label="Language"
              className="select"
              defaultValue="en"
              onChange={(event) =>
                onLanguageChange(event.target.value as Language)
              }
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
        </div>

        <div className="modal-action">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Close
          </button>
          <button type="button" onClick={onClose} className="btn btn-primary">
            Save
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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12px"
      height="12px"
      viewBox="0 0 2048 2048"
      className={className}
      aria-hidden="true"
    >
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
    </svg>
  );
}
