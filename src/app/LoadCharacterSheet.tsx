"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import NoSimIcon from "~icons/material-symbols/no-sim-outline";

import { Icon } from "@/components/Icon";
import {
    getSavedSourceSets,
    serializeSavableSourceSet,
} from "@/lib/Source/persistence";

export function LoadCharacterSheet() {
    const existingCharacters = useQuery({
        queryKey: ["existingCharacterSheets"],
        queryFn: async () => {
            return getSavedSourceSets();
        },
    });

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Load a saved character</h1>

            {!existingCharacters.isLoading &&
                !existingCharacters.data?.length && (
                    <Icon
                        icon={NoSimIcon}
                        className="m-auto h-6 w-6 text-sm text-black/50 dark:text-white/50"
                    />
                )}

            {existingCharacters.data && (
                <div className="flex flex-col gap-2 overflow-y-auto">
                    {existingCharacters.data.map((character) => {
                        const name =
                            character.variables["characterName"]?.value;

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
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
