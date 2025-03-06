"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { EditSourcesForm } from "@/app/character/EditSourcesForm";
import { CharacterSheetNavBar } from "@/app/character/NavBar";
import { Loader } from "@/components/Loader";
import {
    parseSheet,
    stringifySheet,
} from "@/lib/characterSheets/stringifySheet";
import { getSourceWithDependencies } from "@/lib/sources/getSource";
import {
    CharacterEditorAction,
    useCharacterEditorStore,
} from "@/state/characterEditor";
import { useCharacterSheetStore } from "@/state/characterSheet";
import { CharacterSheet } from "@/types/CharacterSheet";

export default function CharacterPage({
    searchParams,
}: {
    searchParams: Promise<{ data: string }>;
}) {
    const router = useRouter();

    const characterSheet = useCharacterSheetStore();
    const currentAction = useCharacterEditorStore(
        (state) => state.currentAction,
    );

    const initialiseCharacterQuery = useQuery({
        queryKey: ["initialiseCharacterState"],
        queryFn: async () => {
            const { data } = await searchParams;

            if (!data) {
                router.push("/");
                return 1;
            }

            const sheet = parseSheet(data);

            // Load all sources and their dependencies, caches them
            for (const source of sheet.sources) {
                await getSourceWithDependencies(source);
            }

            characterSheet.initFromSheet(sheet);

            return sheet;
        },
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has("data")) {
            const newSheet = {
                sources: characterSheet.sources,
                variables: characterSheet.variables,
            } as CharacterSheet;

            searchParams.set("data", stringifySheet(newSheet));

            window.history.replaceState(
                null,
                "",
                `${window.location.pathname}?${searchParams}`,
            );
        }
    }, [characterSheet.sources, characterSheet.variables]);

    return (
        <div className="flex h-screen flex-col gap-4 p-4">
            <CharacterSheetNavBar />

            {initialiseCharacterQuery.isLoading && (
                <div className="m-auto flex flex-col gap-2 text-black/50 dark:text-white/50">
                    <Loader className="m-auto" />
                    <p className="text-sm">Loading sources...</p>
                </div>
            )}

            {initialiseCharacterQuery.data && (
                <>
                    {currentAction === CharacterEditorAction.VIEW && <p>sdf</p>}
                    {currentAction === CharacterEditorAction.EDIT && (
                        <p>asdf</p>
                    )}
                    {currentAction === CharacterEditorAction.EDIT_SOURCES && (
                        <EditSourcesForm />
                    )}
                </>
            )}
        </div>
    );
}
