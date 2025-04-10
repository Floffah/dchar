import { JSONSource } from "@/types/JSONSource";

export function introspectSourceDefinitions(sources: JSONSource[]) {
    const pages: JSONSource["definitions"]["pages"] = {};
    const sections: JSONSource["definitions"]["sections"] = {};
    const fields: JSONSource["definitions"]["fields"] = {};
    const variables = new Set<string>();

    for (const source of sources) {
        for (const [id, page] of Object.entries(
            source.definitions.pages ?? {},
        )) {
            pages[id] = page;
        }

        for (const [id, section] of Object.entries(
            source.definitions.sections ?? {},
        )) {
            sections[id] = section;
        }

        for (const [id, field] of Object.entries(
            source.definitions.fields ?? {},
        )) {
            fields[id] = field;
        }

        for (const id of Object.keys(source.definitions.variables ?? {})) {
            variables.add(`${source.id}:${id}`);
        }
    }

    return { pages, sections, fields, variables };
}

export type IntrospectedSourceDefinitions = ReturnType<
    typeof introspectSourceDefinitions
>;
