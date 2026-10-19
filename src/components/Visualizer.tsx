import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export interface VisualizerProps {
  /** Called when the "Reset View" button is clicked. */
  onResetView: () => void;
  /** Called when the "Download .stl" button is clicked. */
  onDownloadStl: () => void;
  /** Content rendered inside the 3d space (e.g. the card preview/canvas). */
  children?: ReactNode;
}

/**
 * 3d space visualizer: a button bar ("Reset View" / "Download .stl") above a
 * 3d viewport.
 *
 * The component itself only renders the frame and buttons — the actual 3d
 * scene is supplied by the caller via `children`.
 */
export function Visualizer({
  onResetView,
  onDownloadStl,
  children,
}: VisualizerProps) {
  const t = useTranslations("visualizer");
  return (
    <div className="border-base-content/10 bg-base-300 flex flex-col overflow-hidden rounded-box border">
      <div className="bg-base-200 flex items-center justify-center gap-4 p-6">
        <button
          type="button"
          onClick={onResetView}
          className="btn btn-outline btn-accent"
        >
          {t("resetView")}
        </button>
        <button
          type="button"
          onClick={onDownloadStl}
          className="btn btn-primary"
        >
          <DownloadIcon className="h-4 w-4" />
          {t("downloadStl")}
        </button>
      </div>
      <div className="flex min-h-96 flex-1 items-center justify-center p-6">
        {children ?? <div />}
      </div>
    </div>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M15.5254 10.7998C15.8979 10.8 16.2 11.1021 16.2002 11.4746V13.7246C16.2002 15.0915 15.0915 16.2002 13.7246 16.2002H4.27539C2.90849 16.2002 1.7998 15.0915 1.7998 13.7246V11.4746C1.80002 11.1021 2.10213 10.8 2.47461 10.7998C2.84727 10.7998 3.15018 11.102 3.15039 11.4746V13.7246C3.15039 14.3459 3.65407 14.8496 4.27539 14.8496H13.7246C14.3459 14.8496 14.8496 14.3459 14.8496 13.7246V11.4746C14.8498 11.102 15.1527 10.7998 15.5254 10.7998ZM9 1.7998C9.37266 1.7998 9.67459 2.102 9.6748 2.47461V10.2275L12.334 7.41113C12.5898 7.14032 13.0171 7.12827 13.2881 7.38379C13.5591 7.63976 13.5714 8.06784 13.3154 8.33887L9.49121 12.3887C9.3637 12.5237 9.18571 12.5996 9 12.5996C8.81429 12.5996 8.6363 12.5237 8.50879 12.3887L4.68457 8.33887C4.4286 8.06784 4.44089 7.63976 4.71191 7.38379C4.98294 7.12827 5.41018 7.14032 5.66602 7.41113L8.3252 10.2275V2.47461C8.32541 2.102 8.62734 1.79981 9 1.7998Z" />
    </svg>
  );
}
