import { create } from "zustand";
import type { CardFormState } from "@/components/cardFormTypes";
import { initialCardFormState } from "@/components/cardFormTypes";

interface ModelState {
  form: CardFormState;
  setForm: (form: CardFormState) => void;
}

const useModelState = create<ModelState>()((set) => ({
  form: initialCardFormState,
  setForm: (form) => set({ form }),
}));

export default useModelState;
