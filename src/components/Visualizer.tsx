import type { ReactNode } from "react";

import { DownloadSimple } from "@phosphor-icons/react";

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
  return (
    <div className="border-base-content/10 bg-base-300 flex flex-col overflow-hidden rounded-box border">
      <div className="bg-base-200 flex items-center justify-center gap-4 p-6">
        <button
          type="button"
          onClick={onResetView}
          className="btn btn-outline btn-accent"
        >
          Reset View
        </button>
        <button
          type="button"
          onClick={onDownloadStl}
          className="btn btn-primary"
        >
          <DownloadSimple className="h-4 w-4" weight="fill" />
          Download .stl
        </button>
      </div>
      <div className="flex min-h-96 flex-1 items-center justify-center p-6">
        {children ?? <div />}
      </div>
    </div>
  );
}
