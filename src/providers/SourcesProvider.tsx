"use client";

import { PropsWithChildren, createContext, useContext, useMemo } from "react";

import { SourceSet } from "@/lib/Source/SourceSet";

// interface SourceContextValue {
//     // loadSource(name: string): Promise<void>;
//     _?: never;
// }

const SourceContext = createContext<SourceSet>(null!);

export const useSources = () => useContext(SourceContext);

export function SourcesProvider({ children }: PropsWithChildren) {
    const sourceSet = useMemo(() => new SourceSet(), []);

    return (
        <SourceContext.Provider value={sourceSet}>
            {children}
        </SourceContext.Provider>
    );
}
