import { readFileSync } from "fs";
import { existsSync } from "node:fs";
import { resolve } from "path";

import { SourceFile } from "@/lib/Source/SourceFile";
import {
    ResolveSourceOpts,
    SourceResolver,
} from "@/lib/Source/resolver/SourceResolver";

const sourcesDir = resolve(process.cwd(), "sources");

export class TestSourceResolver extends SourceResolver {
    mockSources: Record<string, string> = {};

    addMockSource(id: string, path: string, content: string) {
        this.mockSources[id + ":" + path] = content;
    }

    getMockSource(id: string, path: string) {
        return this.mockSources[id + ":" + path];
    }

    async resolve({ id, path, type, source }: ResolveSourceOpts) {
        let sourceContent = this.getMockSource(id, path);

        if (!sourceContent) {
            const fullPath = resolve(sourcesDir, id, path);

            if (existsSync(fullPath)) {
                sourceContent = readFileSync(fullPath, "utf-8");
            }
        }

        if (!sourceContent) {
            throw new Error(
                `No source found for id '${id}' and path '${path}'`,
            );
        }

        return new SourceFile(source, type, path, sourceContent);
    }
}
