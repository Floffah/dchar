import { Source } from "@/lib/sources/Source";
import { SourceSet } from "@/lib/sources/SourceSet";

export async function loadSource(name: string, set?: SourceSet) {
    const source = new Source(name, { set });

    await source.load();

    return source;
}
