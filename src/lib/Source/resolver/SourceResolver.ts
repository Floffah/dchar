import { Source } from "@/lib/Source";
import { SourceFile, SourceFileType } from "@/lib/Source/SourceFile";

export interface ResolveSourceOpts {
    id: string;
    path: string;
    type: SourceFileType;
    source: Source;
}

export abstract class SourceResolver {
    abstract resolve(opts: ResolveSourceOpts): Promise<SourceFile>;
}
