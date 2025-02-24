"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import Link from "next/link";

import { Icon } from "@/components/Icon";
import { stringifySheet } from "@/lib/characterSheets/stringifySheet";
import { db } from "@/lib/localdb";

export function LoadCharacterList() {
    const allCharacters = useQuery({
        queryKey: ["LoadCharactersList", "allCharacters"],
        queryFn: () => {
            return db.characterSheets.toArray();
        },
    });

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">Load a Character</h1>

            <div className="flex flex-grow flex-col gap-2 overflow-y-auto">
                {allCharacters.isLoading && (
                    <>
                        <div className="h-16 w-full animate-pulse rounded bg-white/10"></div>
                        <div className="h-16 w-full animate-pulse rounded bg-white/10"></div>
                    </>
                )}

                {allCharacters.data &&
                    allCharacters.data.map((character) => (
                        <Link
                            key={character.name}
                            href={`/character?data=${stringifySheet(character.content)}`}
                            className="flex cursor-pointer items-center gap-2 rounded border border-black/10 px-4 py-2 text-left text-white dark:border-white/10"
                        >
                            <Icon label="character" size="sm">
                                <User />
                            </Icon>
                            <p className="truncate">{character.name}</p>
                        </Link>
                    ))}
            </div>
        </div>
    );
}
