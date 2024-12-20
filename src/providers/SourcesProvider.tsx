"use client";

import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
} from "react";

import { SourceSet } from "@/lib/Source/SourceSet";
import { deserializeSourceSet, saveSourceSet } from "@/lib/Source/persistence";

const SourceContext = createContext<SourceSet>(null!);

export const useSources = () => useContext(SourceContext);

export function SourcesProvider({ children }: PropsWithChildren) {
    const sourceSet = useMemo(() => new SourceSet(), []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.has("data")) {
            const data = deserializeSourceSet(params.get("data")!);

            sourceSet.load(data);
        }
    }, []);

    useEffect(() => {
        const onSomethingChanged = async () => {
            const params = new URLSearchParams(window.location.search);

            if (!params.has("data")) {
                return;
            }

            saveSourceSet(sourceSet);
        };

        sourceSet.on("variablesChanged", onSomethingChanged);
        sourceSet.on("sourcesChanged", onSomethingChanged);

        return () => {
            sourceSet.off("variablesChanged", onSomethingChanged);
            sourceSet.off("sourcesChanged", onSomethingChanged);
        };
    }, [sourceSet]);

    return (
        <SourceContext.Provider value={sourceSet}>
            {children}
        </SourceContext.Provider>
    );
}
