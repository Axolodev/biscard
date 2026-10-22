import { useTranslations } from "next-intl";

/**
 * Repository the GitHub icon links out to. Fixed per the design — not configurable.
 */
export const HEADING_GITHUB_URL = "https://github.com/Axolodev/g3co";

/** Title text shown in the heading. */
export const HEADING_TITLE = "G3co";

export interface HeadingProps {
  /**
   * Called when the settings (gear) button is clicked. The caller is
   * expected to use this to open a settings modal.
   */
  onSettingsClick: () => void;
  /** Called when the help (question mark) button is clicked; opens the welcome modal. */
  onWelcomeClick: () => void;
}

/**
 * Page heading: a title plus a GitHub link and a settings button.
 *
 * - The GitHub icon opens this repository in a new tab.
 * - The gear icon is a plain button — it invokes `onSettingsClick` and
 *   leaves opening any modal to the caller.
 */
export function Heading({ onSettingsClick, onWelcomeClick }: HeadingProps) {
  const t = useTranslations("heading");
  return (
    <header className="navbar text-base-content border-base-content border-b px-0">
      <div className="flex-1">
        <h1 className="px-2 text-4xl font-bold">{HEADING_TITLE}</h1>
      </div>
      <div className="flex flex-none items-center gap-1">
        <a
          href={HEADING_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("githubLabel")}
          className="btn btn-ghost btn-circle"
        >
          <GithubIcon className="h-5 w-5" />
        </a>
        <button
          type="button"
          onClick={onWelcomeClick}
          aria-label={t("welcomeLabel")}
          className="btn btn-ghost btn-circle"
        >
          <QuestionIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onSettingsClick}
          aria-label={t("settingsLabel")}
          className="btn btn-ghost btn-circle"
        >
          <GearIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .321.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/** heroicons micro question-mark-circle (Figma node 21:11048). */
function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.75 18C33.75 26.6985 26.6985 33.75 18 33.75C9.30152 33.75 2.25 26.6985 2.25 18C2.25 9.30152 9.30152 2.25 18 2.25C26.6985 2.25 33.75 9.30152 33.75 18ZM20.25 25.875C20.25 27.1176 19.2426 28.125 18 28.125C16.7574 28.125 15.75 27.1176 15.75 25.875C15.75 24.6324 16.7574 23.625 18 23.625C19.2426 23.625 20.25 24.6324 20.25 25.875ZM16.4093 11.909C17.288 11.0303 18.7126 11.0303 19.5913 11.909C20.47 12.7877 20.47 14.2123 19.5913 15.091C19.313 15.3693 18.9842 15.5572 18.6361 15.6591C17.6041 15.9612 16.3128 16.933 16.3128 18.5625V19.1255C16.3128 20.0575 17.0683 20.813 18.0003 20.813C18.9323 20.813 19.6878 20.0575 19.6878 19.1255V18.8668C20.527 18.6034 21.3163 18.139 21.9778 17.4775C24.1745 15.2808 24.1745 11.7192 21.9778 9.52252C19.7811 7.32583 16.2195 7.32583 14.0228 9.52252C13.3638 10.1815 13.3638 11.25 14.0228 11.909C14.6818 12.568 15.7503 12.568 16.4093 11.909Z"
      />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.991l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}
