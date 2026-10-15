import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders correctly and looks like the provided example on figma", () => {
    render(<Modal onLanguageChange={vi.fn()} onClose={vi.fn()} />);

    // Settings dialog and heading.
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();

    // Theme-controller dropdown, built per DaisyUI's documented dropdown
    // pattern, offering the one theme defined in this app (`biscard`).
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
    const themeOption = screen.getByRole("radio", { name: "Biscard" });
    expect(themeOption).toBeInTheDocument();
    expect(themeOption).toHaveClass("theme-controller");
    expect(themeOption).toBeChecked();

    // Language select, defaulting to English, offering Spanish.
    const languageSelect = screen.getByRole("combobox", { name: "Language" });
    expect(languageSelect).toHaveValue("en");
    expect(
      screen.getByRole("option", { name: "English" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Español" })
    ).toBeInTheDocument();

    // Upper close ("x") button, lower Close button, and Save button.
    expect(screen.getByRole("button", { name: "Close settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("triggers the close function when the modal's upper close button is pressed", () => {
    const onClose = vi.fn();
    render(<Modal onLanguageChange={vi.fn()} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close settings" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("triggers the close function when the modal's lower close button is pressed", () => {
    const onClose = vi.fn();
    render(<Modal onLanguageChange={vi.fn()} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("triggers the language change function when the language is changed in the component", () => {
    const onLanguageChange = vi.fn();
    render(<Modal onLanguageChange={onLanguageChange} onClose={vi.fn()} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
      target: { value: "es" },
    });

    expect(onLanguageChange).toHaveBeenCalledTimes(1);
    expect(onLanguageChange).toHaveBeenCalledWith("es");
  });
});
