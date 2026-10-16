import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";

import { CardForm } from "./CardForm";
import { initialCardFormState } from "./cardFormTypes";
import type { CardFormState } from "./cardFormTypes";

/** Holds the state outside CardForm, as a store (Zustand) will later do. */
function Harness({ onState }: { onState?: (s: CardFormState) => void }) {
  const [state, setState] = useState(initialCardFormState);
  return (
    <CardForm
      state={state}
      onChange={(next) => {
        setState(next);
        onState?.(next);
      }}
    />
  );
}

function lastState(fn: ReturnType<typeof vi.fn>) {
  return fn.mock.lastCall![0] as CardFormState;
}

describe("CardForm", () => {
  it("modifies the state when the values of the form change", () => {
    const onState = vi.fn();
    render(<Harness onState={onState} />);

    const card = screen.getByRole("group", { name: "Card" });
    fireEvent.change(within(card).getByLabelText("Width"), {
      target: { value: "90" },
    });
    expect(onState).toHaveBeenLastCalledWith({
      ...initialCardFormState,
      card: { ...initialCardFormState.card, width: 90 },
    });
    expect(within(card).getByLabelText("Width")).toHaveValue("90");

    const text = screen.getByRole("group", { name: "Text Properties" });
    fireEvent.change(within(text).getByLabelText("Text content"), {
      target: { value: "Hello" },
    });
    fireEvent.change(within(text).getByLabelText("Font"), {
      target: { value: "Verdana" },
    });
    expect(lastState(onState).card.width).toBe(90);
    expect(lastState(onState).textBlock.content).toBe("Hello");
    expect(lastState(onState).textBlock.fontFamily).toBe("Verdana");

    const qr = screen.getByRole("group", { name: "QR Code Properties" });
    fireEvent.change(
      within(qr).getByLabelText("QR code text (can be a link)"),
      { target: { value: "https://example.com/" } }
    );
    fireEvent.change(within(qr).getByLabelText("Border radius"), {
      target: { value: "5" },
    });
    expect(lastState(onState).qrCode.qrContent).toBe("https://example.com/");
    expect(lastState(onState).qrCode.border.borderRadius).toBe(5);

    const nfc = screen.getByRole("group", { name: "NFC Chip Properties" });
    fireEvent.change(within(nfc).getByLabelText("Diameter"), {
      target: { value: "20" },
    });
    expect(lastState(onState).nfcChip.diameter).toBe(20);
  });

  it("starts with every property group on and editable, then locks them when turned off", () => {
    const onState = vi.fn();
    render(<Harness onState={onState} />);

    const toggles: [string, string, string][] = [
      ["Include text block?", "Text Properties", "Font size"],
      ["Include QR Code?", "QR Code Properties", "Error correction"],
      ["Leave slot for an NFC chip?", "NFC Chip Properties", "Diameter"],
    ];

    for (const [toggleName, groupName, fieldLabel] of toggles) {
      const toggle = screen.getByRole("switch", { name: toggleName });
      expect(toggle).toBeChecked();
      const group = screen.getByRole("group", { name: groupName });
      expect(within(group).getByLabelText(fieldLabel)).toBeEnabled();

      fireEvent.click(toggle);

      expect(toggle).not.toBeChecked();
      expect(screen.getByLabelText(fieldLabel)).toBeDisabled();
      expect(
        screen.queryByRole("group", { name: groupName })
      ).not.toBeInTheDocument();
    }

    expect(lastState(onState).textBlock.enabled).toBe(false);
    expect(lastState(onState).qrCode.enabled).toBe(false);
    expect(lastState(onState).nfcChip.enabled).toBe(false);
  });
});
