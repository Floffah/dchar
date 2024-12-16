import { LuaFactory } from "wasmoon";

import { Source } from "@/lib/sources/Source";

let luaFactory: LuaFactory;

export interface CreateEngineOpts {
    source: Source;
}

export async function createEngine({ source }: CreateEngineOpts) {
    if (!luaFactory) {
        // shouldn't load this on the server
        luaFactory = new LuaFactory();
    }

    const engine = await luaFactory.createEngine({
        enableProxy: true,
        openStandardLibs: false,
    });

    // std lib stuff
    engine.global.set("print", (...args: any[]) => {
        console.log(...args);
    });

    engine.global.set("require", (pathname: string) => {
        if (!pathname) {
            throw new Error("'pathname' must be provided");
        }

        const sourceFile = source.allSources.find(
            (sourceFile) => sourceFile.path === pathname,
        );

        if (!sourceFile) {
            throw new Error(`No source file found at path '${pathname}'`);
        }

        sourceFile.init();

        return sourceFile.value!;
    });

    // core source stuff
    engine.global.set("isloaded", (pathname: string) => {
        if (!pathname) {
            throw new Error("'pathname' must be provided");
        }

        const sourceFile = source.allSources.find(
            (sourceFile) => sourceFile.path === pathname,
        );

        if (!sourceFile) {
            return false;
        }

        return sourceFile.isLoaded;
    });

    engine.global.set("loadsource", (pathname: string) => {
        if (!pathname) {
            throw new Error("'pathname' must be provided");
        }

        const sourceFile = source.allSources.find(
            (sourceFile) => sourceFile.path === pathname,
        );

        if (!sourceFile) {
            throw new Error(`No source file found at path '${pathname}'`);
        }

        if (sourceFile.isLoaded) {
            throw new Error(
                `Source file at path '${pathname}' is already loaded`,
            );
        }

        return sourceFile.load();
    });

    return engine;
}
