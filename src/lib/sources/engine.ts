import { LuaFactory } from "wasmoon";

import { Source } from "@/lib/sources/Source";

export const luaFactory = new LuaFactory();

export interface CreateEngineOpts {
    source: Source;
}

export async function createEngine({ source }: CreateEngineOpts) {
    const engine = await luaFactory.createEngine({
        enableProxy: true,
        openStandardLibs: false,
    });

    engine.global.set("print", (...args: any[]) => {
        console.log(...args);
    });

    engine.global.set("require", (path: string) => {
        const sourceFile = source.allSources.find(
            (sourceFile) => sourceFile.path === path,
        );

        if (!sourceFile) {
            throw new Error(`No source file found at path '${path}'`);
        }

        return sourceFile.value;
    });

    return engine;
}
