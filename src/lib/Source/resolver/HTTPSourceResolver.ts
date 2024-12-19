import { SourceFile } from "@/lib/Source/SourceFile";
import {
    ResolveSourceOpts,
    SourceResolver,
} from "@/lib/Source/resolver/SourceResolver";

interface HTTPSourceResolverOpts {
    baseUrl?: string;
}

export class HTTPSourceResolver extends SourceResolver {
    private baseUrl: string;

    constructor({ baseUrl = "/sources/" }: HTTPSourceResolverOpts = {}) {
        super();

        this.baseUrl = baseUrl;
    }

    async resolve({ id, path, type, source }: ResolveSourceOpts) {
        const url = new URL(path, this.baseUrl + id + "/");

        const response = await fetch(url.href);

        if (!response.ok) {
            throw new Error(`Failed to fetch source file from '${url.href}'`);
        }

        const sourceCode = await response.text();

        return new SourceFile(source, type, path, sourceCode);
    }
}
