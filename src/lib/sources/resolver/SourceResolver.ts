import { SourceFile, SourceFileType } from "@/lib/sources/SourceFile";

export abstract class SourceResolver {
    abstract resolve(
        id: string,
        fileName: string,
        type: SourceFileType,
    ): Promise<SourceFile>;
}
