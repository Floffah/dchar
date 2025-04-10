"use server";

import { builtinSources } from "@/lib/sources";

export async function getAvailableSources() {
    const sources: { id: string; name: string; description: string }[] = [];

    for (const [id, source] of Object.entries(builtinSources)) {
        if (source.main.lib) {
            continue;
        }

        sources.push({
            id,
            name: source.main.name,
            description: source.main.description,
        });
    }

    return sources;
}
