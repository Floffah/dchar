import { SavableSourceSet, SourceSet } from "@/lib/Source/SourceSet";
import { CharacterSheetVariableConstants } from "@/lib/constants";

export function serializeSavableSourceSet(sourceSet: SavableSourceSet) {
    return btoa(JSON.stringify(sourceSet));
}

export function serializeSourceSet(sourceSet: SourceSet) {
    return serializeSavableSourceSet(sourceSet.save());
}

export function deserializeSourceSet(data: string) {
    return JSON.parse(atob(data)) as SavableSourceSet;
}

export const CHARACTER_LIST = "characterList";

export function saveSourceSet(sourceSet: SourceSet, withURL = true) {
    if (withURL) {
        const params = new URLSearchParams(window.location.search);

        params.set("data", serializeSourceSet(sourceSet));

        window.history.replaceState(
            {},
            "",
            window.location.pathname + "?" + params.toString(),
        );
    }

    const characterList = localStorage.getItem(CHARACTER_LIST);

    if (characterList) {
        let list = JSON.parse(characterList) as string[];

        list = list.filter((data) => {
            const saved = deserializeSourceSet(data);

            return (
                !saved.variables[
                    CharacterSheetVariableConstants.CHARACTER_NAME
                ] ||
                !sourceSet.variables[
                    CharacterSheetVariableConstants.CHARACTER_NAME
                ] ||
                saved.variables[CharacterSheetVariableConstants.CHARACTER_NAME]
                    .value !==
                    sourceSet.variables[
                        CharacterSheetVariableConstants.CHARACTER_NAME
                    ].value
            );
        });

        list.push(serializeSourceSet(sourceSet));

        localStorage.setItem(CHARACTER_LIST, JSON.stringify(list));
    } else {
        localStorage.setItem(
            CHARACTER_LIST,
            JSON.stringify([serializeSourceSet(sourceSet)]),
        );
    }
}

export function getSavedSourceSets(): SavableSourceSet[] {
    const characterList = localStorage.getItem(CHARACTER_LIST);

    if (!characterList) {
        return [];
    }

    return JSON.parse(characterList).map((data: string) =>
        deserializeSourceSet(data),
    );
}
