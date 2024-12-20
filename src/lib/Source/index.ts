import { LuaEngine } from "wasmoon";

import { SourceFile, SourceFileType } from "@/lib/Source/SourceFile";
import { SourceSet } from "@/lib/Source/SourceSet";
import { createEngine } from "@/lib/Source/engine";
import { HTTPSourceResolver } from "@/lib/Source/resolver/HTTPSourceResolver";
import { SourceResolver } from "@/lib/Source/resolver/SourceResolver";
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

    public resolver: SourceResolver;
    public sourceSet: SourceSet | null = null;

    public main: SourceFile | null = null;
    public allSources: SourceFile[] = [];
    public extends: Source[] = [];
    public subSources: Source[] = [];

    constructor(
        public readonly id: string,
        { resolver = new HTTPSourceResolver(), set }: SourceOpts,
    ) {
        this.resolver = resolver;
        this.sourceSet = set ?? null;
    }

    async load() {
        logSourceSystemMessage(this, `Loading source by id '${this.id}'`);

        this.engine = await createEngine({
            source: this,
        });

        let sourceFile: SourceFile;

        try {
            logSourceSystemMessage(this, `Fetching source's main.lua`);
            sourceFile = await this.resolver.resolve({
                id: this.id,
                path: "main.lua",
                type: SourceFileType.Main,
                source: this,
            });
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

        if (
            this.id !== "base" &&
            (!sourceValue.extends || !Array.isArray(sourceValue.extends)) &&
            this.sourceSet
        ) {
            sourceValue.extends = ["base"];
        }

        if (sourceValue.extends) {
            if (!this.sourceSet) {
                throw new Error("Cannot extend source without a source set");
            }

            for (const extend of sourceValue.extends) {
                logSourceSystemMessage(this, `Found extend '${extend}'`);

                const extendedSource = await this.sourceSet.loadSource(extend);
                extendedSource.subSources.push(this);

                this.extends.push(extendedSource);
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

        const sourceFile = await this.resolver.resolve({
            id: this.id,
            path,
            type,
            source: this,
        });

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
