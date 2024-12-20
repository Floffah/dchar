import { describe, expect, test } from "bun:test";

import { SavableSourceSet, SourceSet } from "@/lib/Source/SourceSet";
import { TestSourceResolver } from "@/lib/Source/resolver/TestSourceResolver";

describe("Saving", () => {
    let savedSource: SavableSourceSet;

    test("Save source set", async () => {
        const sourceSet = new SourceSet(new TestSourceResolver());

        await sourceSet.loadSource("5e");

        sourceSet.variables["characterName"].value = "Test Character";

        savedSource = sourceSet.save();

        await sourceSet.unload(false);
    });

    test("Load source set", async () => {
        const sourceSet = new SourceSet(new TestSourceResolver());

        await sourceSet.load(savedSource);

        expect(sourceSet.variables["characterName"].value).toBe(
            "Test Character",
        );
    });
});
