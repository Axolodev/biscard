import { beforeEach, describe, expect, it } from "vitest";
import { initialCardFormState } from "@/components/cardFormTypes";
import useFormStateStore, { FORM_STATE_STORAGE_KEY } from "./formStateStore";

describe("formStateStore persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    useFormStateStore.setState({ form: initialCardFormState });
  });

  it("saves form changes to localStorage", () => {
    const form = {
      ...initialCardFormState,
      card: { ...initialCardFormState.card, width: 99 },
    };
    useFormStateStore.getState().setForm(form);
    const saved = JSON.parse(localStorage.getItem(FORM_STATE_STORAGE_KEY)!);
    expect(saved.state.form.card.width).toBe(99);
  });

  it("restores a saved form on rehydrate", async () => {
    localStorage.setItem(
      FORM_STATE_STORAGE_KEY,
      JSON.stringify({
        state: { form: { card: { width: 123 } } },
        version: 0,
      }),
    );
    await useFormStateStore.persist.rehydrate();
    const { form } = useFormStateStore.getState();
    expect(form.card.width).toBe(123);
    // Missing fields fall back to defaults.
    expect(form.card.height).toBe(initialCardFormState.card.height);
    expect(form.qrCode).toEqual(initialCardFormState.qrCode);
  });

  it("uses defaults when nothing is saved", async () => {
    await useFormStateStore.persist.rehydrate();
    expect(useFormStateStore.getState().form).toEqual(initialCardFormState);
  });
});
