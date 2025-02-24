import Dexie, { EntityTable } from "dexie";

import { CharacterSheet } from "@/types/CharacterSheet";
import { JSONSource } from "@/types/JSONSource";

export interface CachedJSONSource {
    id: string;
    content: JSONSource;
    lastUpdated: number;
}

export interface StoredCharacterSheet {
    name: string;
    content: CharacterSheet;
}

const db = new Dexie("DCharCache") as Dexie & {
    cachedSources: EntityTable<CachedJSONSource, "id">;
    characterSheets: EntityTable<StoredCharacterSheet, "name">;
};

db.version(1).stores({
    cachedSources: "++id, content, lastUpdated",
    characterSheets: "++name, content",
});

export { db };
