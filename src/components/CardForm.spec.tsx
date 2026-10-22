import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithIntl } from "@/i18n/testUtils";

import { CardForm } from "./CardForm";
import { initialCardFormState } from "./cardFormTypes";
import useModelStore from "@/store/modelStore";

const currentState = () => useModelStore.getState().form;

describe("CardForm", () => {
  beforeEach(() => {
    useModelStore.setState({ form: initialCardFormState });
  });

  it("modifies the state when the values of the form change", () => {
    renderWithIntl(<CardForm />);

    const card = screen.getByRole("group", { name: "Card" });
    fireEvent.change(within(card).getByLabelText("Width"), {
      target: { value: "90" },
    });
    expect(currentState()).toEqual({
      ...initialCardFormState,
      card: { ...initialCardFormState.card, width: 90 },
    });
    expect(within(card).getByLabelText("Width")).toHaveValue(90);

    const text = screen.getByRole("group", { name: "Text Properties" });
    fireEvent.change(within(text).getByLabelText("Text content"), {
      target: { value: "Hello" },
    });
    fireEvent.change(within(text).getByLabelText("Font"), {
      target: { value: "Roboto_Bold" },
    });
    expect(currentState().card.width).toBe(90);
    expect(currentState().textBlock.content).toBe("Hello");
    expect(currentState().textBlock.fontFamily).toBe("Roboto_Bold");

    const qr = screen.getByRole("group", { name: "QR Code Properties" });
    fireEvent.change(
      within(qr).getByLabelText("QR code text (can be a link)"),
      { target: { value: "https://example.com/" } },
    );
    fireEvent.change(within(qr).getByLabelText("Border radius"), {
      target: { value: "5" },
    });
    expect(currentState().qrCode.qrContent).toBe("https://example.com/");
    expect(currentState().qrCode.border.borderRadius).toBe(5);

    const nfc = screen.getByRole("group", { name: "NFC Chip Properties" });
    fireEvent.change(within(nfc).getByLabelText("Diameter"), {
      target: { value: "20" },
    });
    expect(currentState().nfcChip.diameter).toBe(20);
  });

  it("starts with every property group on and editable, then locks them when turned off", () => {
    renderWithIntl(<CardForm />);

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
        screen.queryByRole("group", { name: groupName }),
      ).not.toBeInTheDocument();
    }

    expect(currentState().textBlock.enabled).toBe(false);
    expect(currentState().qrCode.enabled).toBe(false);
    expect(currentState().nfcChip.enabled).toBe(false);
  });
});
