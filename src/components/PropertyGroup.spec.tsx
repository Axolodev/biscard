import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { PropertyGroup } from "./PropertyGroup";

function setup(props: Partial<React.ComponentProps<typeof PropertyGroup>> = {}) {
  return render(
    <PropertyGroup label="Text Properties" {...props}>
      <input aria-label="Width" />
    </PropertyGroup>
  );
}

describe("PropertyGroup", () => {
  it("renders correctly and includes all elements of the Figma design", () => {
    setup({ defaultChecked: true });

    expect(screen.getByRole("switch")).toHaveClass("toggle");
    const group = screen.getByRole("group", { name: "Text Properties" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group.querySelector("legend")).toHaveTextContent("Text Properties");
  });

  it("enables the fields and passes true when switched from off to on", () => {
    const onToggleChange = vi.fn();
    setup({ onToggleChange });

    expect(screen.getByLabelText("Width", { selector: "input" })).toBeDisabled();
    fireEvent.click(screen.getByRole("switch"));

    expect(onToggleChange).toHaveBeenCalledTimes(1);
    expect(onToggleChange).toHaveBeenCalledWith(true);
    expect(screen.getByLabelText("Width")).toBeEnabled();
    expect(screen.getByRole("group", { name: "Text Properties" })).toBeVisible();
  });

  it("disables the fields and passes false when switched from on to off", () => {
    const onToggleChange = vi.fn();
    setup({ onToggleChange, defaultChecked: true });

    expect(screen.getByLabelText("Width")).toBeEnabled();
    fireEvent.click(screen.getByRole("switch"));

    expect(onToggleChange).toHaveBeenCalledTimes(1);
    expect(onToggleChange).toHaveBeenCalledWith(false);
    expect(screen.getByLabelText("Width", { selector: "input" })).toBeDisabled();
    expect(
      screen.queryByRole("group", { name: "Text Properties" })
    ).not.toBeInTheDocument();
  });

  it("renders the children", () => {
    setup({ defaultChecked: true });

    expect(screen.getByLabelText("Width")).toBeInTheDocument();
  });

  it("supports React Hook Form style props", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const ref = vi.fn();
    setup({ name: "textBlock", onChange, onBlur, ref });

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("name", "textBlock");
    expect(ref).toHaveBeenCalledWith(toggle);
    fireEvent.click(toggle);
    fireEvent.blur(toggle);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
