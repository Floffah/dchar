import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { SourceSet } from "@/lib/Source/SourceSet";
import { Source } from "@/lib/Source/index";
import { TestSourceResolver } from "@/lib/Source/resolver/TestSourceResolver";
import { mockLog } from "@/testing/mocks";

let resolver: TestSourceResolver;
let sourceSet: SourceSet;
let mainSource: Source;

beforeAll(async () => {
    resolver = new TestSourceResolver();
    sourceSet = new SourceSet(resolver);

    resolver.addMockSource(
        "test",
        "other.lua",
        `
            local Source = {
                name = "Test Source Other File",
            }
            
            function Source.onload()
            end
           
            return Source
        `,
    );

    resolver.addMockSource(
        "test",
        "main.lua",
        `
            local Source = {
                name = "Test Source",
                dependencies = {
                    "other.lua",
                },
            }
            
            function Source.onload()
            end
           
            return Source
        `,
    );

    mainSource = await sourceSet.loadSource("test");
});

describe("Variables", () => {
    const name = "test-var";
    const value = "initial value";

    test("Create a variable", async () => {
        await mainSource.engine?.doString(`variable("${name}", "${value}")`);

        expect(sourceSet.variables[name]?.value).toBe(value);
    });

    test("Get a variable", async () => {
        expect(
            await mainSource.engine?.doString(`return getvariable("${name}")`),
        ).toBe(value);
    });

    test("Edit a variable", async () => {
        const newValue = "new value";

        await mainSource.engine?.doString(
            `setvariable("${name}", "${newValue}")`,
        );

        expect(sourceSet.variables[name]?.value).toBe(newValue);
    });
});

describe("Requiring", () => {
    test("Require without parameters", async () => {
        await expect(
            mainSource.engine?.doString(`return require()`),
        ).rejects.toThrowError("'pathname' must be provided");
    });

    test("Require another file", async () => {
        const otherSource = await mainSource.engine?.doString(
            `return require("other.lua")`,
        );

        expect(otherSource.name).toBe("Test Source Other File");
    });

    test("Require a file from another source", async () => {
        const baseSource = await mainSource.engine?.doString(
            `return require("main.lua", "base")`,
        );

        expect(baseSource.name).toBe("Base Source");
    });

    test("Require a file that doesn't exist", async () => {
        await expect(
            mainSource.engine?.doString(`return require("nonexistent.lua")`),
        ).rejects.toThrowError(
            "No source file found at path 'nonexistent.lua'",
        );
    });

    test("Require a source that doesn't exist", async () => {
        await expect(
            mainSource.engine?.doString(
                `return require("main.lua", "nonexistent")`,
            ),
        ).rejects.toThrowError("No source found with id 'nonexistent'");
    });

    test("Require with sourceId without a SourceSet", async () => {
        const standaloneSource = new Source("test", { resolver });

        await standaloneSource.load();

        await expect(
            standaloneSource.engine?.doString(
                `return require("main.lua", "base")`,
            ),
        ).rejects.toThrowError(
            "Source must be part of a SourceSet to use 'sourceId'",
        );
    });
});

test("Printing", async () => {
    await mainSource.engine?.doString(`print("Hello, world!")`);

    expect(
        mockLog.mock.calls.find((args) => args[0].includes("Hello, world!")),
    ).toBeDefined();
});

describe("isloaded", () => {
    test("with valid args", async () => {
        const isLoaded = await mainSource.engine?.doString(
            `return isloaded("main.lua")`,
        );

        expect(isLoaded).toBe(true);
    });

    test("with a file that doesn't exist", async () => {
        const isLoaded = await mainSource.engine?.doString(
            `return isloaded("nonexistent.lua")`,
        );

        expect(isLoaded).toBe(false);
    });

    test("without args", async () => {
        await expect(
            mainSource.engine?.doString(`return isloaded()`),
        ).rejects.toThrowError("'pathname' must be provided");
    });
});

describe("Edit wizard", () => {
    const pageId = "test-page";
    const pageName = "Test Page";

    beforeAll(async () => {
        await mainSource.engine?.doString(
            `editwizard.page("${pageId}", "${pageName}")`,
        );
    });

    test("Page registers properly", () => {
        expect(sourceSet.editWizard.pages[pageId].name).toBe(pageName);
    });

    describe("Sections", () => {
        const sectionId = "test-section";
        const name = "Test Section";

        beforeAll(async () => {
            await mainSource.engine?.doString(
                `editwizard.section("${sectionId}", "${name}", "${pageId}")`,
            );
        });

        test("Section registers properly", () => {
            expect(
                sourceSet.editWizard.pages[pageId].sections[sectionId].name,
            ).toBe(name);
        });

        test("Create a section on a nonexistent page", async () => {
            await expect(
                mainSource.engine?.doString(
                    `editwizard.section("${sectionId}", "${name}", "nonexistent")`,
                ),
            ).rejects.toThrowError("No page found with id 'nonexistent'");
        });

        describe("Fields", () => {
            const id = "test-field";
            const label = "Test Field";

            test("Create a field", async () => {
                await mainSource.engine?.doString(
                    `editwizard.field("${id}", { label = "${label}", type = "string", page = "${pageId}", section = "${sectionId}" })`,
                );

                expect(
                    sourceSet.editWizard.pages[pageId].sections[sectionId]
                        .fields[id].label,
                ).toBe(label);
            });

            test("Create a field on a nonexistent page", async () => {
                await expect(
                    mainSource.engine?.doString(
                        `editwizard.field("${id}", { label = "${label}", type = "string", page = "nonexistent", section = "${sectionId}" })`,
                    ),
                ).rejects.toThrowError("No page found with id 'nonexistent'");
            });

            test("Create a field on a nonexistent section", async () => {
                await expect(
                    mainSource.engine?.doString(
                        `editwizard.field("${id}", { label = "${label}", type = "string", page = "${pageId}", section = "nonexistent" })`,
                    ),
                ).rejects.toThrowError(
                    "No section found with id 'nonexistent'",
                );
            });
        });
    });
});

afterAll(async () => {
    await sourceSet.unload();
});
