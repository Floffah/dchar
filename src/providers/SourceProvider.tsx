"use client";

import { PropsWithChildren, createContext, useEffect } from "react";

import { loadSource } from "@/lib/sources";
import { SourceSet } from "@/lib/sources/SourceSet";

interface SourceContextValue {
    // loadSource(name: string): Promise<void>;
    _?: never;
}

const SourceContext = createContext<SourceContextValue>(null!);

export function SourceProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        const set = new SourceSet();

        const fifthEdition = loadSource("5e", set);

        fifthEdition.then(() => console.log(set));

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
