import { LuaEngine } from "wasmoon";

import { SourceFile, SourceFileType } from "@/lib/sources/SourceFile";
import { SourceSet } from "@/lib/sources/SourceSet";
import { createEngine } from "@/lib/sources/engine";
import { HTTPSourceResolver } from "@/lib/sources/resolver/HTTPSourceResolver";
import { SourceResolver } from "@/lib/sources/resolver/SourceResolver";
import { logSourceSystemMessage } from "@/lib/styledLogs";

interface SourceOpts {
    resolver?: SourceResolver;
    set?: SourceSet;
}

export class Source {
    public name: string | undefined;
    public version: string | undefined;
    public author: string | undefined;
    public description: string | undefined;

    public engine: LuaEngine | null = null;

    private resolver: SourceResolver;
    public sourceSet: SourceSet | null = null;

    public main: SourceFile | null = null;
    public allSources: SourceFile[] = [];

    constructor(
        public readonly id: string,
        { resolver = new HTTPSourceResolver(this, {}), set }: SourceOpts,
    ) {
        this.resolver = resolver;
        this.sourceSet = set ?? null;
    }

    async load() {
        logSourceSystemMessage(this, `Loading source by id '${this.id}'`);

        if (this.sourceSet && !this.sourceSet.sources.includes(this)) {
            this.sourceSet.sources.push(this);
        }

        this.engine = await createEngine({
            source: this,
        });

        let sourceFile: SourceFile;

        try {
            logSourceSystemMessage(this, `Fetching source's main.lua`);
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

        if (sourceValue.extends && Array.isArray(sourceValue.extends)) {
            if (!this.sourceSet) {
                throw new Error("Cannot extend source without a source set");
            }

            for (const extend of sourceValue.extends) {
                logSourceSystemMessage(this, `Found extend '${extend}'`);
                await this.sourceSet.loadSource(extend);
            }
        }

        if (Array.isArray(sourceValue?.dependencies)) {
            for (const dependency of sourceValue.dependencies) {
                logSourceSystemMessage(
                    this,
                    `Found dependency '${dependency}'`,
                );
                await this.loadSourceFile(
                    dependency,
                    SourceFileType.Dependency,
                );
            }
        }

        if (Array.isArray(sourceValue?.optional)) {
            for (const optional of sourceValue?.optional ?? []) {
                logSourceSystemMessage(
                    this,
                    `Found optional dependency '${optional}'`,
                );
                await this.loadSourceFile(optional, SourceFileType.Optional);
            }
        }

        await sourceFile.load();

        logSourceSystemMessage(
            this,
            `Loaded source '${this.name}' (${this.id})`,
        );
    }

    async loadSourceFile(path: string, type: SourceFileType) {
        logSourceSystemMessage(this, `Load requested for path '${path}'`);

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
                logSourceSystemMessage(
                    this,
                    `Found dependency '${dependency}'`,
                );
                const dependencyFile = await this.loadSourceFile(
                    dependency,
                    SourceFileType.Dependency,
                );

                sourceFile.dependencies.push(dependencyFile);
            }
        }

        if (Array.isArray(value?.optional)) {
            for (const optional of value.optional) {
                logSourceSystemMessage(
                    this,
                    `Found optional dependency '${optional}'`,
                );
                const dependencyFile = await this.loadSourceFile(
                    optional,
                    SourceFileType.Optional,
                );

                sourceFile.optionalDependencies.push(dependencyFile);
            }
        }

        if (type !== SourceFileType.Optional) {
            await sourceFile.load();
        } else {
            logSourceSystemMessage(
                this,
                `Skipping load for optional source file '${path}'`,
            );
        }

        return sourceFile;
    }

    async unload() {
        logSourceSystemMessage(
            this,
            `Unloading source '${this.name}' (${this.id}) and all associated source files`,
        );

        for (const source of this.allSources) {
            await source.unload();
        }

        this.engine?.global?.close?.();
    }
}
