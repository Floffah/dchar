import { readFileSync } from "fs";
import { existsSync, readdirSync } from "node:fs";
import { LuaFactory } from "wasmoon";

import { Source } from "@/lib/Source";
import { SourceSet } from "@/lib/Source/SourceSet";
import { createEngine } from "@/lib/Source/engine";

const factory = new LuaFactory();
const engine = await factory.createEngine({
    enableProxy: true,
    openStandardLibs: false,
});

const sourcesMeta = [];

const sourcesDir = readdirSync(__dirname + "/../sources");

for (const source of sourcesDir) {
    if (source.split(".").length > 1) {
        continue;
    }

    const mainPath = `${__dirname}/../sources/${source}/main.lua`;
    if (existsSync(mainPath)) {
        const meta = await engine.doString(readFileSync(mainPath, "utf-8"));

        sourcesMeta.push({
            ...meta,
            id: source,
        });
    }
}

await Bun.write(
    __dirname + "/../sources/sources.json",
    JSON.stringify(
        {
            "AUTO GENERATED": "DO NOT EDIT",
            "": "",
            sources: sourcesMeta,
        },
        null,
        4,
    ),
);
