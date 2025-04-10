import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getSource } from "@/lib/sources/getSource";
import { introspectSourceDefinitions } from "@/lib/sources/introspectSourceDefinitions";
import { useCharacterSheetStore } from "@/state/characterSheet";
import { JSONSource, JSONSourceIdentifier } from "@/types/JSONSource";

export function useCombinedSourcesQuery(
    opts: Omit<
        UseQueryOptions<ReturnType<typeof introspectSourceDefinitions>>,
        "queryKey" | "queryFn"
    > & { refetchOnSourcesChange?: boolean } = {},
) {
    const characterSheetSources = useCharacterSheetStore(
        (state) => state.sources,
    );

    const introspectSourcesQuery = useQuery({
        ...opts,
        queryKey: ["useCombinedSources"],
        queryFn: async (ctx) => {
            const sources: JSONSource[] = [];

            const getSourcesWithDependenciesList = async (
                id: JSONSourceIdentifier,
            ) => {
                const source = await getSource(id);

                if (source.extends) {
                    for (const extendedSource of source.extends) {
                        if (ctx.signal.aborted) {
                            throw "Aborted";
                        }

                        await getSourcesWithDependenciesList(extendedSource);
                    }
                }

                sources.push(source);
            };

            for (const source of characterSheetSources) {
                if (ctx.signal.aborted) {
                    throw "Aborted";
                }

                await getSourcesWithDependenciesList(source);
            }

            if (ctx.signal.aborted) {
                throw "Aborted";
            }
            return introspectSourceDefinitions(sources);
        },
        networkMode: "offlineFirst",
    });

    useEffect(() => {
        if (opts.refetchOnSourcesChange) {
            introspectSourcesQuery.refetch();
        }
    }, [characterSheetSources]);

    return introspectSourcesQuery;
}
