import { describe, expect, test } from "bun:test";

import { SavableSourceSet, SourceSet } from "@/lib/Source/SourceSet";
import { TestSourceResolver } from "@/lib/Source/resolver/TestSourceResolver";
import { CharacterSheetVariableConstants } from "@/lib/constants";

describe("Saving", () => {
    let savedSource: SavableSourceSet;

    test("Save source set", async () => {
        const sourceSet = new SourceSet(new TestSourceResolver());

        await sourceSet.loadSource("5e");

        sourceSet.variables[
            CharacterSheetVariableConstants.CHARACTER_NAME
        ].value = "Test Character";

        savedSource = sourceSet.save();

        await sourceSet.unload(false);
    });

    test("Load source set", async () => {
        const sourceSet = new SourceSet(new TestSourceResolver());

        await sourceSet.load(savedSource);

        expect(
            sourceSet.variables[CharacterSheetVariableConstants.CHARACTER_NAME]
                .value,
        ).toBe("Test Character");
    });
});
