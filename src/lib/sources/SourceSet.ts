import { Source } from "@/lib/sources/Source";
import { SourceSetEditWizard } from "@/lib/sources/SourceSetEditWizard";

export class SourceSet {
    public sources: Source[] = [];

    public variables: Record<
        string,
        { name: string; ref: string; value: any }
    > = {};

    public editWizard: SourceSetEditWizard = new SourceSetEditWizard(this);

    public async loadSource(id: string) {
        const source = new Source(id, { set: this });

        await source.load();
    }
}
