import { SourceSetEditWizard } from "@/lib/Source/SourceSetEditWizard";
import { Source } from "@/lib/Source/index";
import { HTTPSourceResolver } from "@/lib/Source/resolver/HTTPSourceResolver";
import { SourceResolver } from "@/lib/Source/resolver/SourceResolver";

export class SourceSet {
    public sources: Source[] = [];

    public variables: Record<
        string,
        { name: string; ref: string; value: any }
    > = {};

    public editWizard: SourceSetEditWizard = new SourceSetEditWizard(this);

    constructor(public resolver: SourceResolver = new HTTPSourceResolver()) {}

    public async loadSource(id: string) {
        const source = new Source(id, { set: this });

        if (this.resolver) {
            source.resolver = this.resolver;
        }

        await source.load();

        return source;
    }

    public async unloadAll() {
        for (const source of this.sources) {
            await source.unload();
        }
    }
}
