import { Source } from "@/lib/sources/Source";

export class SourceSet {
    public sources: Source[] = [];

    public variables: Record<
        string,
        { name: string; ref: string; value: any; type: string }
    > = {};

    public async loadSource(id: string) {
        const source = new Source(id, { set: this });

        await source.load();
    }
}
