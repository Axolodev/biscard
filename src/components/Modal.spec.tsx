import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/i18n/testUtils";

import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders correctly and looks like the provided example on figma", () => {
    renderWithIntl(<Modal onLanguageChange={vi.fn()} onClose={vi.fn()} />);

    // Settings dialog and heading.
    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();

    // Theme-controller dropdown, built per DaisyUI's documented dropdown
    // pattern, offering this app's own theme (labeled "Default") plus the
    // four built-in DaisyUI themes enabled in globals.css.
    expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();
    const defaultThemeOption = screen.getByRole("radio", { name: "Default" });
    expect(defaultThemeOption).toBeInTheDocument();
    expect(defaultThemeOption).toHaveClass("theme-controller");
    expect(defaultThemeOption).toHaveAttribute("value", "g3co");
    expect(defaultThemeOption).toBeChecked();
    for (const label of ["Retro", "Cyberpunk", "Valentine", "Aqua"]) {
      const option = screen.getByRole("radio", { name: label });
      expect(option).toBeInTheDocument();
      expect(option).toHaveClass("theme-controller");
      expect(option).not.toBeChecked();
    }

    // Language dropdown, defaulting to English, offering Spanish.
    expect(
      screen.getByRole("button", { name: "Language" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Spanish" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    // Upper close ("x") button and the lower "Close" button. There is no
    // separate "Save" button — the design only has the one Close action.
    expect(
      screen.getByRole("button", { name: "Close settings" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
  });

  it("triggers the close function when the modal's upper close button is pressed", () => {
    const onClose = vi.fn();
    renderWithIntl(<Modal onLanguageChange={vi.fn()} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close settings" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("triggers the close function when the modal's lower close button is pressed", () => {
    const onClose = vi.fn();
    renderWithIntl(<Modal onLanguageChange={vi.fn()} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("triggers the language change function when the language is changed in the component", () => {
    const onLanguageChange = vi.fn();
    renderWithIntl(
      <Modal onLanguageChange={onLanguageChange} onClose={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Spanish" }));

    expect(onLanguageChange).toHaveBeenCalledTimes(1);
    expect(onLanguageChange).toHaveBeenCalledWith("es");
  });
});
