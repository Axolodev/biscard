"use client";

import { useEffect } from "react";
import useFormStateStore from "@/store/formStateStore";

/** Restores the saved form from localStorage once mounted in the browser. */
export function FormStateHydrator() {
  useEffect(() => {
    void useFormStateStore.persist.rehydrate();
  }, []);
  return null;
}
