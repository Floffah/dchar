import { create } from "zustand/react";

export enum CharacterEditorAction {
    EDIT,
    VIEW,
    EDIT_SOURCES,
}

interface CharacterEditor {
    currentAction: CharacterEditorAction;
    selectedPage: string;

    setCurrentAction: (action: CharacterEditorAction) => void;
    setSelectedPage: (page: string) => void;
}

export const useCharacterEditorStore = create<CharacterEditor>((set) => ({
    currentAction: CharacterEditorAction.EDIT,
    selectedPage: "character",

    setCurrentAction: (action) => set({ currentAction: action }),
    setSelectedPage: (page) => set({ selectedPage: page }),
}));
