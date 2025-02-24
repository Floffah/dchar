"use server";

import { hashSource } from "@/lib/hashSource";
import { builtinSources } from "@/lib/sources";
import { parseSourceId } from "@/lib/sources/parseSourceId";
import { JSONSourceIdentifier, JSONSourceVersion } from "@/types/JSONSource";

export async function checkForUpdates(
    sources: Record<JSONSourceIdentifier, JSONSourceVersion>,
) {
    const updates: JSONSourceIdentifier[] = [];

    for (const [id, currentVersion] of Object.entries(sources)) {
        if (id.startsWith("https://")) {
            continue;
        }

        const { namespace, name } = parseSourceId(id);

        const source = builtinSources[namespace]?.[name];

        if (!source) {
            continue;
        }

        let version = source.version;

        if (!version) {
            const hash = await hashSource(source);

            version = `sha256:${hash}`;
        }

        if (version !== currentVersion) {
            updates.push(id as JSONSourceIdentifier);
        }
    }

    return updates;
}
