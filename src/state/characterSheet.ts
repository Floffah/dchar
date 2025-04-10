import { create } from "zustand/react";

import { CharacterSheet } from "@/types/CharacterSheet";

interface CharacterSheetState {
    name: string;
    variables: Omit<CharacterSheet["variables"], "characterName">;
    sources: CharacterSheet["sources"];

    initFromSheet: (sheet: CharacterSheet) => void;

    setName: (name: string) => void;

    setVariable: (key: string, value: any) => void;
    removeVariable: (key: string) => void;

    pushSource: (sources: CharacterSheet["sources"][number]) => void;
    removeSource: (source: string) => void;
    setSources: (sources: CharacterSheet["sources"]) => void;
}

export const useCharacterSheetStore = create<CharacterSheetState>((set) => ({
    name: "",
    variables: {},
    sources: [],

    initFromSheet: (sheet) => {
        set({
            name: sheet.variables.characterName.value,
            variables: sheet.variables,
            sources: sheet.sources,
        });
    },

    setName: (name) => set({ name }),

    setVariable: (key, value) =>
        set((state) => ({
            variables: {
                ...state.variables,
                [key]: {
                    ...(state.variables[key] ?? {}),
                    value,
                },
            },
        })),
    removeVariable: (key) =>
        set((state) => {
            const { [key]: _, ...rest } = state.variables;
            return { variables: rest };
        }),

    pushSource: (source) =>
        set((state) => ({
            sources: [...state.sources, source],
        })),
    removeSource: (source) =>
        set((state) => ({
            sources: state.sources.filter((s) => s !== source),
        })),
    setSources: (sources) => set({ sources }),
}));
