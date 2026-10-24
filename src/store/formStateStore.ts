import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardFormState } from "@/components/cardFormTypes";
import { initialCardFormState } from "@/components/cardFormTypes";

interface FormStateStore {
  form: CardFormState;
  setForm: (form: CardFormState) => void;
  resetValues: () => void;
}

export const FORM_STATE_STORAGE_KEY = "biscard:formState";

/**
 * Merges a persisted form over the defaults, group by group, so fields added
 * in later versions still get their default value for returning users.
 */
export function mergePersistedForm(persisted: unknown): CardFormState {
  const saved = (persisted as { form?: Partial<CardFormState> } | null)?.form;
  if (!saved || typeof saved !== "object") return initialCardFormState;
  const d = initialCardFormState;
  return {
    card: { ...d.card, ...saved.card },
    textBlock: { ...d.textBlock, ...saved.textBlock },
    qrCode: {
      ...d.qrCode,
      ...saved.qrCode,
      border: { ...d.qrCode.border, ...saved.qrCode?.border },
    },
    nfcChip: { ...d.nfcChip, ...saved.nfcChip },
  };
}

const useFormStateStore = create<FormStateStore>()(
  persist(
    (set) => ({
      form: initialCardFormState,
      setForm: (form) => set({ form }),
      resetValues: () => set({ form: { ...initialCardFormState } }),
    }),
    {
      name: FORM_STATE_STORAGE_KEY,
      partialize: (s) => ({ form: s.form }),
      merge: (persisted, current) => ({
        ...current,
        form: mergePersistedForm(persisted),
      }),
      // Restored client-side after mount (see FormStateHydrator) so the first
      // client render matches the server-rendered HTML.
      skipHydration: true,
    },
  ),
);

export default useFormStateStore;
