import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/i18n/testUtils";

import { WelcomeModal } from "./WelcomeModal";

describe("WelcomeModal", () => {
  it("renders content and links", () => {
    renderWithIntl(<WelcomeModal onClose={vi.fn()} />);
    expect(screen.getByText(/Welcome!/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Roberto Reyes" })).toHaveAttribute(
      "href",
      "https://github.com/Axolodev",
    );
    expect(
      screen.getByRole("link", { name: "GitHub Issues Page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "@robruizr.dev" }),
    ).toBeInTheDocument();
  });

  it("closes from every close affordance", () => {
    const onClose = vi.fn();
    renderWithIntl(<WelcomeModal onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close welcome" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Close backdrop" }));
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
