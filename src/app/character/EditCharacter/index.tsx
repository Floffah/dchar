"use client";

import { EditCharacterPage } from "@/app/character/EditCharacter/EditCharacterPage";
import { useCharacterEditorStore } from "@/state/characterEditor";

export function EditCharacter() {
    const editor = useCharacterEditorStore();

    return (
        <div className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800 p-2">
            <EditCharacterPage
                page={editor.selectedPage}
                key={editor.selectedPage}
            />
        </div>
    );
}
