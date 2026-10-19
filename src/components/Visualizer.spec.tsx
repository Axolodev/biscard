import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/i18n/testUtils";
import userEvent from "@testing-library/user-event";

import { Visualizer } from "./Visualizer";

describe("Visualizer", () => {
  it("triggers onResetView when the Reset View button is pressed", async () => {
    const onResetView = vi.fn();
    const user = userEvent.setup();
    renderWithIntl(<Visualizer onResetView={onResetView} onDownloadStl={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Reset View" }));

    expect(onResetView).toHaveBeenCalledTimes(1);
  });

  it("triggers onDownloadStl when the Download .stl button is pressed", async () => {
    const onDownloadStl = vi.fn();
    const user = userEvent.setup();
    renderWithIntl(<Visualizer onResetView={vi.fn()} onDownloadStl={onDownloadStl} />);

    await user.click(screen.getByRole("button", { name: /Download \.stl/ }));

    expect(onDownloadStl).toHaveBeenCalledTimes(1);
  });

  it("renders children inside the 3d space", () => {
    renderWithIntl(
      <Visualizer onResetView={vi.fn()} onDownloadStl={vi.fn()}>
        <div data-testid="scene" />
      </Visualizer>,
    );

    expect(screen.getByTestId("scene")).toBeInTheDocument();
  });

  // "Visual comparison" of the button area against the Figma design
  // (node 21:9544): the design shows a "Reset View" outline/accent button
  // with no icon, followed by a filled primary "Download .stl" button with
  // a leading download-tray icon, both centered in their own bar. A literal
  // pixel screenshot diff is out of scope for a unit test, so this asserts
  // the structural/markup equivalent instead.
  describe("button area (vs. Figma node 21:9544)", () => {
    it("renders an outline accent 'Reset View' button with no icon", () => {
      renderWithIntl(<Visualizer onResetView={vi.fn()} onDownloadStl={vi.fn()} />);

      const resetButton = screen.getByRole("button", { name: "Reset View" });
      expect(resetButton).toHaveClass("btn", "btn-outline", "btn-accent");
      expect(resetButton.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders a filled primary 'Download .stl' button with a leading icon", () => {
      renderWithIntl(<Visualizer onResetView={vi.fn()} onDownloadStl={vi.fn()} />);

      const downloadButton = screen.getByRole("button", {
        name: /Download \.stl/,
      });
      expect(downloadButton).toHaveClass("btn", "btn-primary");
      expect(downloadButton).not.toHaveClass("btn-outline");
      expect(downloadButton.querySelector("svg")).toBeInTheDocument();
      expect(downloadButton).toHaveTextContent("Download .stl");
    });

    it("centers both buttons together in the button bar", () => {
      renderWithIntl(<Visualizer onResetView={vi.fn()} onDownloadStl={vi.fn()} />);

      const resetButton = screen.getByRole("button", { name: "Reset View" });
      const downloadButton = screen.getByRole("button", {
        name: /Download \.stl/,
      });

      expect(resetButton.parentElement).toBe(downloadButton.parentElement);
      expect(resetButton.parentElement).toHaveClass(
        "justify-center",
        "items-center",
      );
    });
  });
});
