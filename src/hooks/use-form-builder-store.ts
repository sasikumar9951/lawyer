"use client";

import { create } from "zustand";

type BuilderState = {
  formId: string | null;
  name: string;
  description: string;
  schemaJson: unknown | null;
  isSaving: boolean;
};

type BuilderActions = {
  setFormMeta: (name: string, description: string) => void;
  setSchemaJson: (schema: unknown) => void;
  setFormId: (id: string | null) => void;
  setIsSaving: (val: boolean) => void;
  reset: () => void;
};

export const useFormBuilderStore = create<BuilderState & BuilderActions>(
  (set) => ({
    formId: null,
    name: "Untitled form",
    description: "",
    schemaJson: null,
    isSaving: false,
    setFormMeta: (name, description) => set({ name, description }),
    setSchemaJson: (schema) => set({ schemaJson: schema }),
    setFormId: (id) => set({ formId: id }),
    setIsSaving: (val) => set({ isSaving: val }),
    reset: () =>
      set({
        formId: null,
        name: "Untitled form",
        description: "",
        schemaJson: null,
        isSaving: false,
      }),
  })
);
