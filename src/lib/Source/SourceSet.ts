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
    loaded: () => void;
};

const Emitter = EventEmitter as unknown as {
    new (): TypedEmitter<SourceSetEvents>;
};
export class SourceSet extends Emitter {
    public sources: Source[] = [];

    public variables: Record<string, { name: string; value: any }> = {};

    public editWizard: SourceSetEditWizard = new SourceSetEditWizard(this);

    constructor(public resolver: SourceResolver = new HTTPSourceResolver()) {
        super();
    }

    public getVariable(name: string) {
        return this.variables[name]?.value;
    }

    public setVariable(name: string, value: any) {
        let variable = this.variables[name];

        if (!variable) {
            variable = this.variables[name] = {
                name,
                value,
            };
        }

        const oldValue = variable.value;

        variable.value = value;

        this.emit("variablesChanged", name, oldValue, value);

        return variable;
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

        this.sources.push(source);

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

    public async load(
        data: SavableSourceSet,
        opts: { signal?: AbortSignal } = {},
    ) {
        await this.unload();

        this.variables = data.variables;

        for (const sourceId of data.sources) {
            if (opts.signal?.aborted) {
                break;
            }
            await this.loadSource(sourceId);
        }

        if (opts.signal?.aborted) {
            return;
        }

        this.emit("loaded");
    }
}
