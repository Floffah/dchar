import { Source } from "@/lib/Source";
import { SourceFile, SourceFileType } from "@/lib/Source/SourceFile";
import { SourceResolver } from "@/lib/Source/resolver/SourceResolver";

interface HTTPSourceResolverOpts {
    baseUrl?: string;
}

export class HTTPSourceResolver extends SourceResolver {
    private baseUrl: string;

    constructor(
        public source: Source,
        {
            baseUrl = window.location.origin + "/sources/",
        }: HTTPSourceResolverOpts,
    ) {
        super();

        this.baseUrl = baseUrl;
    }

    async resolve(id: string, filePath: string, type: SourceFileType) {
        const url = new URL(filePath, this.baseUrl + id + "/");

        const response = await fetch(url.href);

        if (!response.ok) {
            throw new Error(`Failed to fetch source file from '${url.href}'`);
        }

        const sourceCode = await response.text();

        return new SourceFile(this.source, type, filePath, sourceCode);
    }
}
