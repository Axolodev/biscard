import { GithubLogo, Gear } from "@phosphor-icons/react";

/**
 * Repository the GitHub icon links out to. Fixed per the design — not configurable.
 */
export const HEADING_GITHUB_URL = "https://github.com/Axolodev/biscard";

export interface HeadingProps {
  /** Title text shown in the heading. */
  title?: string;
  /**
   * Called when the settings (gear) button is clicked. The caller is
   * expected to use this to open a settings modal.
   */
  onSettingsClick: () => void;
}

/**
 * Page heading: a title plus a GitHub link and a settings button.
 *
 * - The GitHub icon opens this repository in a new tab.
 * - The gear icon is a plain button — it invokes `onSettingsClick` and
 *   leaves opening any modal to the caller.
 */
export function Heading({ title = "CardGen", onSettingsClick }: HeadingProps) {
  return (
    <header className="navbar bg-base-200 text-base-content rounded-box">
      <div className="flex-1">
        <h1 className="px-2 text-xl font-bold">{title}</h1>
      </div>
      <div className="flex flex-none items-center gap-1">
        <a
          href={HEADING_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="btn btn-ghost btn-circle"
        >
          <GithubLogo className="h-5 w-5" weight="fill" />
        </a>
        <button
          type="button"
          onClick={onSettingsClick}
          aria-label="Open settings"
          className="btn btn-ghost btn-circle"
        >
          <Gear className="h-5 w-5" weight="regular" />
        </button>
      </div>
    </header>
  );
}
