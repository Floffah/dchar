import { $ } from "bun";
import { mkdir } from "fs/promises";
import { resolve } from "path";

import { hashSource } from "@/lib/hashSource";
import { builtinSources } from "@/lib/sources";

await $`ts-json-schema-generator --path src/types/\*\*/\*.ts --type JSONSource --out public/schemas/json-source.json --tsconfig tsconfig.json`;

const sourcesDir = resolve(process.cwd(), "public/sources");

for (const namespace of Object.keys(builtinSources)) {
    const sourceDir = resolve(sourcesDir, namespace);

    await mkdir(sourceDir, { recursive: true });

    for (const name of Object.keys(builtinSources[namespace])) {
        const sourceFile = resolve(sourceDir, `${name}.json`);

        const source = builtinSources[namespace][name];

        if (!source.version) {
            const hash = await hashSource(source);

            source.version = `sha256:${hash}`;
        }

        await Bun.write(sourceFile, JSON.stringify(source, null, 4));
    }
}
