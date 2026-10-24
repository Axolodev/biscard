import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/i18n/testUtils";

import useMeshStore from "@/store/meshStore";
import { Visualizer } from "./Visualizer";

describe("Visualizer", () => {
  it("renders children inside the 3d space", () => {
    renderWithIntl(
      <Visualizer>
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
      renderWithIntl(<Visualizer />);

      const resetButton = screen.getByRole("button", { name: "Reset View" });
      expect(resetButton).toHaveClass("btn", "btn-outline", "btn-accent");
      expect(resetButton.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders a filled primary 'Download .stl' button with a leading icon", () => {
      renderWithIntl(<Visualizer />);

      const downloadButton = screen.getByRole("button", {
        name: /Download \.stl/,
      });
      expect(downloadButton).toHaveClass("btn", "btn-primary");
      expect(downloadButton).not.toHaveClass("btn-outline");
      expect(downloadButton.querySelector("svg")).toBeInTheDocument();
      expect(downloadButton).toHaveTextContent("Download .stl");
    });

    it("centers both buttons together in the button bar", () => {
      renderWithIntl(<Visualizer />);

      const resetButton = screen.getByRole("button", { name: "Reset View" });
      const downloadButton = screen.getByRole("button", {
        name: /Download \.stl/,
      });

      expect(resetButton.parentElement).toContainElement(downloadButton);
      expect(resetButton.parentElement).toHaveClass(
        "justify-center",
        "items-center",
      );
    });
  });

  it("animates the camera back to its initial view when 'Reset View' is clicked", () => {
    const reset = vi.fn();
    useMeshStore.setState({
      cameraControls: { reset } as unknown as ReturnType<
        typeof useMeshStore.getState
      >["cameraControls"],
    });
    renderWithIntl(<Visualizer />);

    fireEvent.click(screen.getByRole("button", { name: "Reset View" }));

    expect(reset).toHaveBeenCalledWith(true);
    useMeshStore.setState({ cameraControls: null });
  });
});
