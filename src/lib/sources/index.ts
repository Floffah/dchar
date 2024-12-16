import { Source } from "@/lib/sources/Source";

export async function loadSource(name: string) {
    const source = new Source(name, {});

    await source.load();

    return source;
}
