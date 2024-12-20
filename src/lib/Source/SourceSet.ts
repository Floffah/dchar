import EventEmitter from "events";
import TypedEmitter from "typed-emitter/rxjs";

import { SourceSetEditWizard } from "@/lib/Source/SourceSetEditWizard";
import { Source } from "@/lib/Source/index";
import { HTTPSourceResolver } from "@/lib/Source/resolver/HTTPSourceResolver";
import { SourceResolver } from "@/lib/Source/resolver/SourceResolver";

export interface SavableSourceSet {
    sources: string[];
    variables: SourceSet["variables"];
}

type SourceSetEvents = {
    sourcesChanged: () => void;
    variablesChanged: (name: string, oldValue: any, newValue: any) => void;
    editWizardChanged: () => void;
};

const Emitter = EventEmitter as unknown as {
    new (): TypedEmitter<SourceSetEvents>;
};
export class SourceSet extends Emitter {
    public sources: Source[] = [];

    public variables: Record<
        string,
        { name: string; ref: string; value: any }
    > = {};

    public editWizard: SourceSetEditWizard = new SourceSetEditWizard(this);

    constructor(public resolver: SourceResolver = new HTTPSourceResolver()) {
        super();
    }

    public async loadSource(id: string) {
        const loadedSource = this.sources.find((source) => source.id === id);

        if (loadedSource) {
            return loadedSource;
        }

        const source = new Source(id, { set: this });

        if (this.resolver) {
            source.resolver = this.resolver;
        }

        await source.load();

        this.emit("sourcesChanged");

        return source;
    }

    public async unload(keepVariables = false) {
        for (const source of this.sources) {
            await source.unload();
        }

        if (!keepVariables) {
            this.variables = {};
        }
    }

    public save(): SavableSourceSet {
        const sources = [];

        for (const source of this.sources) {
            if (!source.subSources.length) {
                sources.push(source.id);
            }
        }

        return {
            sources,
            variables: this.variables ?? {},
        };
    }

    public async load(data: SavableSourceSet) {
        this.variables = data.variables;

        for (const sourceId of data.sources) {
            await this.loadSource(sourceId);
        }
    }
}
