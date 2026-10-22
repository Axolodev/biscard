import { create } from "zustand";
import type { CardFormState } from "@/components/cardFormTypes";
import { initialCardFormState } from "@/components/cardFormTypes";

interface ModelStore {
  form: CardFormState;
  setForm: (form: CardFormState) => void;
}

const useModelStore = create<ModelStore>()((set) => ({
  form: initialCardFormState,
  setForm: (form) => set({ form }),
}));

export default useModelStore;
