"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CharacterSheetNavBar } from "@/app/character/CharacterSheetNavBar";
import { EditCharacter } from "@/app/character/EditCharacter";
import { EditSourcesForm } from "@/app/character/EditSourcesForm";
import { Loader } from "@/components/Loader";
import {
    parseSheet,
    stringifySheet,
} from "@/lib/characterSheets/stringifySheet";
import { useCombinedSourcesQuery } from "@/lib/data/useCombinedSourcesQuery";
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
                throw "Aborted";
            }

            const sheet = parseSheet(data);

            characterSheet.initFromSheet(sheet);

            return sheet;
        },
    });

    const combinedSourcesQuery = useCombinedSourcesQuery({
        enabled: initialiseCharacterQuery.isSuccess,
        refetchOnSourcesChange: true,
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

            {initialiseCharacterQuery.isLoading &&
                combinedSourcesQuery.isLoading && (
                    <div className="m-auto flex flex-col gap-2 text-white/50">
                        <Loader className="m-auto" />
                        <p className="text-sm">Loading sources...</p>
                    </div>
                )}

            {initialiseCharacterQuery.data && combinedSourcesQuery.data && (
                <>
                    {currentAction === CharacterEditorAction.VIEW && (
                        <p>Not Implemented</p>
                    )}
                    {currentAction === CharacterEditorAction.EDIT && (
                        <EditCharacter />
                    )}
                    {currentAction === CharacterEditorAction.EDIT_SOURCES && (
                        <EditSourcesForm />
                    )}
                </>
            )}
        </div>
    );
}
