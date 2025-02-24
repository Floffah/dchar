import { addDays } from "date-fns";

import { checkForUpdates } from "@/actions/checkForUpdates";
import { downloadSourceDocument } from "@/actions/downloadSourceDocument";
import { db } from "@/lib/localdb";
import { parseSourceId } from "@/lib/sources/parseSourceId";
import { JSONSource } from "@/types/JSONSource";

export async function getSource(id: string) {
    const { formattedId } = parseSourceId(id);

    const existing = await db.cachedSources.get(formattedId);

    if (existing) {
        if (existing.lastUpdated > addDays(new Date(), -1).getTime()) {
            return existing.content;
        }

        const hasUpdates = await checkForUpdates({
            [formattedId]: existing.content.version!,
        });

        if (hasUpdates.length) {
            await db.cachedSources.delete(formattedId);
        } else {
            return existing.content;
        }
    }

    const source = await downloadSourceDocument(formattedId);

    await db.cachedSources.put({
        id,
        content: source,
        lastUpdated: Date.now(),
    });

    return source;
}

export async function getSourceWithDependencies(id: string) {
    const { formattedId } = parseSourceId(id);

    const source = await getSource(formattedId);

    const dependencies = await Promise.all(
        (source.extends || []).map((id) => getSourceWithDependencies(id)),
    );

    const sources: Record<string, JSONSource> = dependencies.reduce(
        (acc, dep) => {
            return {
                ...acc,
                ...dep,
            };
        },
        {
            [formattedId]: source,
        },
    );

    return sources;
}
