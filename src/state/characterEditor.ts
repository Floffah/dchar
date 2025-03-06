import { create } from "zustand/react";

export enum CharacterEditorAction {
    EDIT,
    VIEW,
    EDIT_SOURCES,
}

interface CharacterEditor {
    currentAction: CharacterEditorAction;

    setCurrentAction: (action: CharacterEditorAction) => void;
}

export const useCharacterEditorStore = create<CharacterEditor>((set) => ({
    currentAction: CharacterEditorAction.EDIT,

    setCurrentAction: (action) => set({ currentAction: action }),
}));
