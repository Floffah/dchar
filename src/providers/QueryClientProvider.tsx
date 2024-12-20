"use client";

import {
    QueryClient,
    QueryClientProvider as TRQQueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";

export function QueryClientProvider({ children }: PropsWithChildren) {
    const client = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 60 * 5,
                    },
                },
            }),
        [],
    );

    return (
        <TRQQueryClientProvider client={client}>
            {children}
        </TRQQueryClientProvider>
    );
}
