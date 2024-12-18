import { SourceSetEditWizard } from "@/lib/Source/SourceSetEditWizard";
import { Source } from "@/lib/Source/index";

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

        return source;
    }
}
