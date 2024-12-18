import { readFileSync } from "fs";
import { Minify } from "lua-format";
import { NextRequest, NextResponse } from "next/server";
import { readdirSync } from "node:fs";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
    const sources = readdirSync("./sources");

    const params: { path: string[] }[] = [];

    for (const source of sources) {
        const files = readdirSync(`./sources/${source}`);

        for (const file of files) {
            params.push({ path: [source, file] });
        }
    }

    return params;
}

export const GET = async (req: NextRequest) => {
    const path = req.nextUrl.pathname;

    const file = readFileSync("." + path, "utf-8");

    const minified = Minify(file, {
        RenameVariables: true,
        RenameFunctions: true,
    })
        .replace(/--\[\[[\s\S]*-]]/g, "")
        .trim();

    return new NextResponse(minified, {
        headers: {
            "Content-Type": "text/x-lua",
        },
    });
};
