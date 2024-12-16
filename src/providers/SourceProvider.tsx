"use client";

import { PropsWithChildren, createContext, useEffect } from "react";

import { loadSource } from "@/lib/sources";

interface SourceContextValue {
    // loadSource(name: string): Promise<void>;
    _?: never;
}

const SourceContext = createContext<SourceContextValue>(null!);

export function SourceProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        const fifthEdition = loadSource("5e");

        return () => {
            fifthEdition.then((source) => source.unload());
        };
    });

    return (
        <SourceContext.Provider
            value={
                {
                    // loadSource,
                }
            }
        >
            {children}
        </SourceContext.Provider>
    );
}
