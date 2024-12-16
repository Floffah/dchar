import { Source } from "@/lib/sources/Source";

export enum SourceFileType {
    Main,
    Dependency,
    Optional,
}

export interface SourceFileLuaTable {
    /**
     * The name of the source or source file.
     */
    name: string;
    /**
     * The version of the source or source file.
     * Does not have to be a valid semver version, for example can be the publication date of a Wizards of the Coast corebook.
     */
    version?: string;
    /**
     * The author of the source or source file.
     * If this is based on a book, this must be the author of the book.
     */
    author?: string;
    /**
     * The description of the source or source file.
     */
    description?: string;

    /**
     * The dependencies of the source or source file. Relative file paths.
     */
    dependencies?: string[];
    /**
     * The optional dependencies of the source or source file. Relative file paths.
     * These files will be fetched along with regular dependencies, but will not be loaded (as in calling the `onload` function, they will still be evaluated).
     * These files CAN be required, but this will not cause them to be loaded.
     */
    optional?: string[];

    /**
     * Called when the source file is loaded. Required.
     */
    onload: () => void;

    /**
     * Called when the source file is unloaded. Optional.
     */
    onunload?: () => void;
}

export class SourceFile {
    public name: string | undefined;
    public version: string | undefined;
    public author: string | undefined;
    public description: string | undefined;

    private initialized = false;
    public loaded = false;

    public value: SourceFileLuaTable | null = null;

    public dependencies: SourceFile[] = [];
    public optionalDependencies: SourceFile[] = [];

    constructor(
        public source: Source,
        public readonly type: SourceFileType,
        public readonly path: string,
        protected readonly sourceCode: string,
    ) {}

    async init() {
        if (this.initialized) {
            return this.value!;
        }

        this.initialized = true;

        const source = await this.source.engine?.doString(this.sourceCode);

        if (typeof source !== "object") {
            throw new Error("Source file must return a table/class");
        }

        this.name = source?.name;
        this.version = source?.version;
        this.author = source?.author;
        this.description = source?.description;

        this.value = source;

        return this.value!;
    }

    async load() {
        await this.init();

        this.value?.onload();

        return this.value!;
    }

    async unload() {
        await this.init();

        this.value?.onunload?.();

        this.loaded = false;
    }
}
