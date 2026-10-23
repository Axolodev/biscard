import { useState } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { NumberField } from "./FormFields";

function Harness() {
  const [value, setValue] = useState(1);
  return (
    <>
      <NumberField label="Width" value={value} onValueChange={setValue} />
      <output data-testid="value">{value}</output>
    </>
  );
}

function type(text: string) {
  fireEvent.change(screen.getByLabelText("Width"), { target: { value: text } });
}

describe("NumberField", () => {
  it("keeps the decimal point while typing", () => {
    render(<Harness />);

    type("1.");
    expect(screen.getByLabelText("Width")).toHaveValue("1.");

    type("1.5");
    expect(screen.getByLabelText("Width")).toHaveValue("1.5");
    expect(screen.getByTestId("value")).toHaveTextContent("1.5");
  });

  it("accepts a comma as the decimal separator", () => {
    render(<Harness />);

    type("2,5");

    expect(screen.getByLabelText("Width")).toHaveValue("2.5");
    expect(screen.getByTestId("value")).toHaveTextContent("2.5");
  });

  it("ignores non-numeric characters", () => {
    render(<Harness />);

    type("1a");

    expect(screen.getByLabelText("Width")).toHaveValue("1");
  });

  it("treats an emptied field as 0", () => {
    render(<Harness />);

    type("");

    expect(screen.getByLabelText("Width")).toHaveValue("");
    expect(screen.getByTestId("value")).toHaveTextContent("0");
  });

  it("is exposed as a spinbutton with its current value", () => {
    render(<Harness />);

    expect(screen.getByRole("spinbutton", { name: /Width/ })).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
  });

  it("steps by 1 with ArrowUp and ArrowDown", () => {
    render(<Harness />);
    const input = screen.getByLabelText("Width");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveValue("2");
    expect(screen.getByTestId("value")).toHaveTextContent("2");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveValue("0");
    expect(screen.getByTestId("value")).toHaveTextContent("0");
  });

  it("steps by 10 when Shift is held", () => {
    render(<Harness />);
    const input = screen.getByLabelText("Width");

    fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true });

    expect(input).toHaveValue("11");
  });

  it("steps from a decimal value without float noise", () => {
    render(<Harness />);
    const input = screen.getByLabelText("Width");

    type("0.1");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveValue("1.1");

    type("0.2");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveValue("-0.8");
  });
});
