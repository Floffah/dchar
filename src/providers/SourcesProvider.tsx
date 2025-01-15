"use client";

import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
} from "react";

import { SavableSourceSet, SourceSet } from "@/lib/Source/SourceSet";
import { deserializeSourceSet, saveSourceSet } from "@/lib/Source/persistence";
import { CharacterSheetVariableConstants } from "@/lib/constants";

const SourceContext = createContext<{
    sourceSet: SourceSet;
    isLoading: boolean;
}>(null!);

export const useSources = () => useContext(SourceContext);

export function SourcesProvider({ children }: PropsWithChildren) {
    const pathname = usePathname();

    const sourceSet = useMemo(() => new SourceSet(), []);

    const loadSourceSetMutation = useMutation({
        mutationKey: ["loadSourceSet"],
        mutationFn: async (data: SavableSourceSet) => {
            await sourceSet.load(data);

            return true;
        },
    });

    useEffect(() => {
        if (loadSourceSetMutation.isPending) {
            return;
        }

        const params = new URLSearchParams(window.location.search);

        if (params.has("data")) {
            const data = deserializeSourceSet(params.get("data")!);

            const dataCharacterName =
                data.variables[CharacterSheetVariableConstants.CHARACTER_NAME]
                    .value;
            const sourceSetCharacterName =
                sourceSet?.variables?.[
                    CharacterSheetVariableConstants.CHARACTER_NAME
                ]?.value;

            if (dataCharacterName === sourceSetCharacterName) {
                return;
            }

            loadSourceSetMutation.mutate(data);
        }
    }, [loadSourceSetMutation.isPending, pathname, sourceSet.variables]);

    useEffect(() => {
        const onSomethingChanged = async () => {
            if (loadSourceSetMutation.isPending) {
                return;
            }

            const params = new URLSearchParams(window.location.search);

            if (!params.has("data")) {
                return;
            }

            saveSourceSet(sourceSet);
        };

        sourceSet.on("variableChanged", onSomethingChanged);
        sourceSet.on("sourcesChanged", onSomethingChanged);

        return () => {
            sourceSet.off("variableChanged", onSomethingChanged);
            sourceSet.off("sourcesChanged", onSomethingChanged);
        };
    }, [loadSourceSetMutation.isPending, sourceSet]);

    return (
        <SourceContext.Provider
            value={{
                sourceSet,
                isLoading:
                    loadSourceSetMutation.isPending ||
                    (!loadSourceSetMutation.data &&
                        loadSourceSetMutation.failureCount === 0),
            }}
        >
            {children}
        </SourceContext.Provider>
    );
}
