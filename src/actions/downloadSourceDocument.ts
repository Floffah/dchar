"use server";

import { hashSource } from "@/lib/hashSource";
import { builtinSources } from "@/lib/sources";
import { parseSourceId } from "@/lib/sources/parseSourceId";
import { JSONSource } from "@/types/JSONSource";

export async function downloadSourceDocument(id: string) {
    if (id.startsWith("https://")) {
        throw new Error("External sources are not supported");
    }

    const { namespace, name } = parseSourceId(id);

    const source = builtinSources[namespace]?.[name];

    if (!source) {
        throw new Error(`Source not found: ${namespace}:${name}`);
    }

    if (!source.version) {
        const hash = await hashSource(source);

        source.version = `sha256:${hash}`;
    }

    return source as JSONSource;
}
