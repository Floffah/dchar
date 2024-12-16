import { LuaEngine } from "wasmoon";

import { SourceFile, SourceFileType } from "@/lib/sources/SourceFile";
import { createEngine } from "@/lib/sources/engine";
import { HTTPSourceResolver } from "@/lib/sources/resolver/HTTPSourceResolver";
import { SourceResolver } from "@/lib/sources/resolver/SourceResolver";

interface SourceOpts {
    resolver?: SourceResolver;
}

export class Source {
    public name: string | undefined;
    public version: string | undefined;
    public author: string | undefined;
    public description: string | undefined;

    public engine: LuaEngine | null = null;

    private resolver: SourceResolver;

    public main: SourceFile | null = null;
    public allSources: SourceFile[] = [];

    constructor(
        public readonly id: string,
        { resolver = new HTTPSourceResolver(this, {}) }: SourceOpts,
    ) {
        this.resolver = resolver;
    }

    async load() {
        console.log(`Loading source by id '${this.id}'`);

        this.engine = await createEngine({
            source: this,
        });

        let sourceFile: SourceFile;

        try {
            sourceFile = await this.resolver.resolve(
                this.id,
                "main.lua",
                SourceFileType.Main,
            );
        } catch (e: any) {
            throw new Error(`No source exists for id '${this.id}'`, {
                cause: e,
            });
        }

        const sourceValue = await sourceFile.init();

        this.name = sourceFile.name;
        this.version = sourceFile.version;
        this.author = sourceFile.author;
        this.description = sourceFile.description;

        this.main = sourceFile;
        this.allSources.push(sourceFile);

        if (Array.isArray(sourceValue?.dependencies)) {
            for (const dependency of sourceValue.dependencies) {
                await this.loadSourceFile(
                    dependency,
                    SourceFileType.Dependency,
                );
            }
        }

        if (Array.isArray(sourceValue?.optional)) {
            for (const optional of sourceValue?.optional ?? []) {
                await this.loadSourceFile(optional, SourceFileType.Optional);
            }
        }

        await sourceFile.load();
    }

    async loadSourceFile(path: string, type: SourceFileType) {
        const existingSource = this.allSources.find(
            (source) => source.path === path,
        );

        if (existingSource) {
            return existingSource;
        }

        const sourceFile = await this.resolver.resolve(this.id, path, type);

        const value = await sourceFile.init();

        this.allSources.push(sourceFile);

        if (Array.isArray(value?.dependencies)) {
            for (const dependency of value.dependencies) {
                const dependencyFile = await this.loadSourceFile(
                    dependency,
                    SourceFileType.Dependency,
                );

                sourceFile.dependencies.push(dependencyFile);
            }
        }

        if (Array.isArray(value?.optional)) {
            for (const optional of value.optional) {
                const dependencyFile = await this.loadSourceFile(
                    optional,
                    SourceFileType.Optional,
                );

                sourceFile.optionalDependencies.push(dependencyFile);
            }
        }

        if (type !== SourceFileType.Optional) {
            await sourceFile.load();
        }

        return sourceFile;
    }

    async unload() {
        console.log(
            `Unloading source '${this.name}' (${this.id}) and all associated source files`,
        );

        for (const source of this.allSources) {
            await source.unload();
        }

        this.engine?.global?.close?.();
    }
}
