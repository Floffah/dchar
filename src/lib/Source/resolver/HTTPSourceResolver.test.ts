import { Server } from "bun";
import { afterAll, beforeAll, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

import { SourceSet } from "@/lib/Source/SourceSet";
import { HTTPSourceResolver } from "@/lib/Source/resolver/HTTPSourceResolver";

let server: Server;

beforeAll(async () => {
    server = Bun.serve({
        port: 0,
        fetch: (req: Request) => {
            const url = new URL(req.url);

            if (!url.pathname.startsWith("/sources/")) {
                return new Response(null, { status: 404 });
            }

            const sourceFile = readFileSync(
                resolve(process.cwd(), url.pathname.slice(1)),
                "utf-8",
            );

            return new Response(sourceFile, {
                headers: {
                    "Content-Type": "text/x-lua",
                },
            });
        },
    });
});

test("HTTPSourceResolver", async () => {
    const sourceSet = new SourceSet(
        new HTTPSourceResolver({
            baseUrl: `http://localhost:${server.port}/sources/`,
        }),
    );

    await sourceSet.loadSource("5e");

    const fifthEditionSource = sourceSet.sources.find(
        (source) => source.id === "5e",
    );
    const dndSource = sourceSet.sources.find((source) => source.id === "dnd");
    const baseSource = sourceSet.sources.find((source) => source.id === "base");

    expect(fifthEditionSource).toBeDefined();
    expect(dndSource).toBeDefined();
    expect(baseSource).toBeDefined();
});

afterAll(async () => {
    await server.stop();
});
