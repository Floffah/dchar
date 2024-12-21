"use client";

import { usePathname } from "next/navigation";
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { SourceSet } from "@/lib/Source/SourceSet";
import { deserializeSourceSet, saveSourceSet } from "@/lib/Source/persistence";

const SourceContext = createContext<{
    sourceSet: SourceSet;
    isLoading: boolean;
}>(null!);

export const useSources = () => useContext(SourceContext);

export function SourcesProvider({ children }: PropsWithChildren) {
    const pathname = usePathname();

    const sourceSet = useMemo(() => new SourceSet(), []);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.has("data")) {
            const abortController = new AbortController();

            const data = deserializeSourceSet(params.get("data")!);

            sourceSet.load(data, { signal: abortController.signal });

            return () => {
                abortController.abort();
            };
        }
    }, [pathname]);

    useEffect(() => {
        const onSomethingChanged = async () => {
            if (isLoading) {
                return;
            }

            const params = new URLSearchParams(window.location.search);

            if (!params.has("data")) {
                return;
            }

            saveSourceSet(sourceSet);
        };

        const onLoaded = () => {
            setIsLoading(false);
        };

        sourceSet.on("variablesChanged", onSomethingChanged);
        sourceSet.on("sourcesChanged", onSomethingChanged);
        sourceSet.on("loaded", onLoaded);

        return () => {
            sourceSet.off("variablesChanged", onSomethingChanged);
            sourceSet.off("sourcesChanged", onSomethingChanged);
            sourceSet.off("loaded", onLoaded);
        };
    }, [isLoading, sourceSet]);

    return (
        <SourceContext.Provider value={{ sourceSet, isLoading }}>
            {children}
        </SourceContext.Provider>
    );
}
