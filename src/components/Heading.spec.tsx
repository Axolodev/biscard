import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Heading, HEADING_GITHUB_URL, HEADING_TITLE } from "./Heading";

describe("Heading", () => {
  it("renders correctly and looks like the provided example on figma", () => {
    render(<Heading onSettingsClick={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: HEADING_TITLE }),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "View source on GitHub" });
    expect(link).toHaveAttribute("href", HEADING_GITHUB_URL);

    expect(
      screen.getByRole("button", { name: "Open settings" }),
    ).toBeInTheDocument();
  });

  it("calls onSettingsClick when the settings button is pressed", () => {
    const onSettingsClick = vi.fn();
    render(<Heading onSettingsClick={onSettingsClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Open settings" }));

    expect(onSettingsClick).toHaveBeenCalledTimes(1);
  });
});
