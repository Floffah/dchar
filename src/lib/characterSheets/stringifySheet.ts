import { CharacterSheet } from "@/types/CharacterSheet";

export function stringifySheet(characterSheet: CharacterSheet) {
    const json = JSON.stringify(characterSheet, null, 2);

    return encodeURIComponent(Buffer.from(json).toString("base64"));
}

export function parseSheet(base64: string): CharacterSheet {
    const json = Buffer.from(decodeURIComponent(base64), "base64").toString(
        "utf-8",
    );

    return JSON.parse(json);
}
