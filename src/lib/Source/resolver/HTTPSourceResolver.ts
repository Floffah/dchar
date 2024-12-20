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
        let baseUrl = this.baseUrl + id + "/";

        if (baseUrl.startsWith("/") && typeof window !== "undefined") {
            baseUrl = window.location.origin + baseUrl;
        }

        const url = new URL(path, baseUrl);

        const response = await fetch(url.href);

        if (!response.ok) {
            throw new Error(`Failed to fetch source file from '${url.href}'`);
        }

        const sourceCode = await response.text();

        return new SourceFile(source, type, path, sourceCode);
    }
}
