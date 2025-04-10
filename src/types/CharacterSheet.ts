import { JSONSourceIdentifier } from "@/types/JSONSource";

export interface CharacterSheet {
    sources: JSONSourceIdentifier[];
    variables: {
        characterName: {
            value: string;
        };
        [key: string]: {
            value: string | number | boolean;
        };
    };
}
