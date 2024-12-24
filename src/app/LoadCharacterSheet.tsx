"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import NoSimIcon from "~icons/material-symbols/no-sim-outline";
import BinIcon from "~icons/mdi/bin-outline";

import { Icon } from "@/components/Icon";
import {
    CHARACTER_LIST,
    getSavedSourceSets,
    serializeSavableSourceSet,
} from "@/lib/Source/persistence";
import { CharacterSheetVariableConstants } from "@/lib/constants";

export function LoadCharacterSheet() {
    const existingCharacters = useQuery({
        queryKey: ["existingCharacterSheets"],
        queryFn: async () => {
            return getSavedSourceSets();
        },
        staleTime: 0,
    });

    const deleteCharacter = (name: string) => {
        const newCharacters = existingCharacters.data?.filter((character) => {
            const characterName =
                character.variables[
                    CharacterSheetVariableConstants.CHARACTER_NAME
                ]?.value;

            return characterName !== name;
        });

        if (!newCharacters) {
            return;
        }

        localStorage.setItem(
            CHARACTER_LIST,
            JSON.stringify(
                newCharacters.map((set) => serializeSavableSourceSet(set)),
            ),
        );

        existingCharacters.refetch();
    };

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Load a saved character</h1>

            {!existingCharacters.isLoading &&
                !existingCharacters.data?.length && (
                    <Icon
                        icon={NoSimIcon}
                        className="mx-auto my-10 h-6 w-6 text-sm text-black/50 md:my-auto dark:text-white/50"
                    />
                )}

            {existingCharacters.data && (
                <div className="flex flex-col gap-2 overflow-y-auto">
                    {existingCharacters.data.map((character) => {
                        const name =
                            character.variables[
                                CharacterSheetVariableConstants.CHARACTER_NAME
                            ]?.value;

                        if (!name) {
                            return null;
                        }

                        return (
                            <Link
                                key={name}
                                className="flex items-center gap-2 rounded-lg bg-gray-300 p-2 dark:bg-gray-700"
                                href={`/character?data=${serializeSavableSourceSet(character)}`}
                            >
                                <span className="font-semibold">{name}</span>

                                <span className="text-sm dark:text-white/80">
                                    {character.sources.join(", ")}
                                </span>

                                <div className="flex-grow" />

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        deleteCharacter(name);
                                    }}
                                >
                                    <Icon
                                        icon={BinIcon}
                                        label="delete"
                                        className="h-5 w-5 text-red-500"
                                    />
                                </button>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
