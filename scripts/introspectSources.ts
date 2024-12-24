import { readFileSync } from "fs";
import { existsSync, readdirSync } from "node:fs";
import { LuaFactory } from "wasmoon";

const factory = new LuaFactory();
const engine = await factory.createEngine({
    enableProxy: true,
    openStandardLibs: false,
});

const sourcesMeta = [];

const sourcesDir = readdirSync(__dirname + "/../sources");

sourcesDir.sort();

for (const source of sourcesDir) {
    if (source.split(".").length > 1) {
        continue;
    }

    const mainPath = `${__dirname}/../sources/${source}/main.lua`;
    if (existsSync(mainPath)) {
        const meta = await engine.doString(readFileSync(mainPath, "utf-8"));

        // sorted keys
        const keys = Object.keys(meta).sort();
        const sortedMeta: any = {};

        for (const key of keys) {
            sortedMeta[key] = meta[key];
        }

        sourcesMeta.push({
            id: source,
            ...sortedMeta,
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
