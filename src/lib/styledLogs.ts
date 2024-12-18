import { Source } from "@/lib/Source";
import { SourceFile } from "@/lib/Source/SourceFile";

function tagcss(color: string, radius = "0.25rem") {
    return `font-weight: bold; background-color: ${color}; color: white; padding: 0rem 0.125rem; border-radius: ${radius};`;
}

export function logSourceSystemMessage(source: Source, message: string) {
    console.debug(
        `%csystem%c %c${source.id}%c ${message}`,
        tagcss("darkorange"),
        "",
        tagcss("cadetblue"),
        "",
    );
}

export function logSourceLuaMessage(source: Source, message: string) {
    console.info(
        `%clua%c %c${source.id}%c ${message}`,
        tagcss("darkblue"),
        "",
        tagcss("cadetblue"),
        "",
    );
}

export function logSourceFileMessage(sourceFile: SourceFile, message: string) {
    console.debug(
        `%csystem%c %c${sourceFile.source.id}%c/${sourceFile.path}%c ${message}`,
        tagcss("darkorange"),
        "",
        tagcss("cadetblue", "0.25rem 0rem 0rem 0.25rem"),
        tagcss("darkseagreen", "0rem 0.25rem 0.25rem 0rem"),
        "",
    );
}
