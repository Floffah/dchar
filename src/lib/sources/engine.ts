import { nanoid } from "nanoid";
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

    engine.global.set("require", (pathname: string, sourceId: string) => {
        if (!pathname) {
            throw new Error("'pathname' must be provided");
        }

        let fromSource: Source | undefined = source;

        if (sourceId) {
            if (!source.sourceSet) {
                throw new Error(
                    "Source must be part of a SourceSet to use 'sourceId'",
                );
            }

            fromSource = source.sourceSet.sources.find(
                (source) => source.id === sourceId,
            );
        }

        if (!fromSource) {
            throw new Error(`No source found with id '${sourceId}'`);
        }

        const sourceFile = fromSource.allSources.find(
            (sourceFile) => sourceFile.path === pathname,
        );

        if (!sourceFile) {
            throw new Error(`No source file found at path '${pathname}'`);
        }

        sourceFile.load();

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

    if (source.sourceSet) {
        engine.global.set(
            "declarevariable",
            (name: string, initialValue: any, opts: any) => {
                const ref = nanoid();

                const baseref = (source.sourceSet!.variables[name] = {
                    name,
                    ref,
                    value: initialValue,
                    type: opts?.type ?? typeof initialValue ?? "string",
                });

                return {
                    ...baseref,
                    get: () => source.sourceSet!.variables[name].value,
                };
            },
        );
    }

    return engine;
}
