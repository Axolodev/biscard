import { useState } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { NumberField } from "./FormFields";

function Harness({ allowDecimals }: { allowDecimals?: boolean }) {
  const [value, setValue] = useState(1);
  return (
    <>
      <NumberField
        label="Width"
        value={value}
        onValueChange={setValue}
        allowDecimals={allowDecimals}
      />
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

  it("rejects decimals when they are not allowed", () => {
    render(<Harness allowDecimals={false} />);

    type("1.");

    expect(screen.getByLabelText("Width")).toHaveValue("1");
  });

  it("treats an emptied field as 0", () => {
    render(<Harness />);

    type("");

    expect(screen.getByLabelText("Width")).toHaveValue("");
    expect(screen.getByTestId("value")).toHaveTextContent("0");
  });
});
