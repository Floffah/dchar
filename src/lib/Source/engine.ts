import luaBuiltins from "../../../stdlib/builtins.lua";
import { nanoid } from "nanoid";
import { LuaFactory } from "wasmoon";

import { EditWizardField } from "@/lib/Source/SourceSetEditWizard";
import { Source } from "@/lib/Source/index";
import { logSourceLuaMessage } from "@/lib/styledLogs";

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

    await engine.doString(luaBuiltins);

    // std lib stuff
    engine.global.set("print", (...args: any[]) => {
        logSourceLuaMessage(source, args.join("\t"));
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
            "variable",
            (name: string, initialValue: any, _opts: any) => {
                let variable = source.sourceSet!.variables[name];

                if (!variable) {
                    const ref = nanoid();

                    variable = source.sourceSet!.variables[name] = {
                        name,
                        ref,
                        value: initialValue,
                    };
                }

                return {
                    ...variable,
                    get: () => source.sourceSet?.getVariable(name),
                    set: (value: any) => {
                        source.sourceSet?.setVariable(name, value);
                    },
                };
            },
        );

        engine.global.set("editwizard", {
            page: (id: string, name: string) => {
                const page = source.sourceSet!.editWizard.pages[id] || {
                    name,
                    sections: {},
                };

                page.name = name;

                source.sourceSet!.editWizard.pages[id] = page;
            },
            section: (id: string, name: string, page: string) => {
                const pageObj = source.sourceSet!.editWizard.pages[page];

                if (!pageObj) {
                    throw new Error(`No page found with id '${page}'`);
                }

                const section = pageObj.sections[id] || { name, fields: {} };

                section.name = name;

                pageObj.sections[id] = section;
            },
            field: (
                id: string,
                options: EditWizardField & { page: string; section: string },
            ) => {
                const pageObj =
                    source.sourceSet!.editWizard.pages[options.page];

                if (!pageObj) {
                    throw new Error(`No page found with id '${options.page}'`);
                }

                const section = pageObj.sections[options.section];

                if (!section) {
                    throw new Error(
                        `No section found with id '${options.section}'`,
                    );
                }

                section.fields[id] = options;
            },
        });
    }

    return engine;
}
