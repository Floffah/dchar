import { JSONSource } from "@/types/JSONSource";

export const builtinSources: Record<
    string,
    {
        main: JSONSource;
        [key: string]: JSONSource;
    }
> = {
    base: {
        main: {
            source: 1,
            id: "base:main",
            name: "Base Source",
            description:
                "Base source material. All other sources should depend on this",
            lib: true,
            definitions: {
                pages: {
                    character: {
                        name: "Character Info",
                    },
                },
            },
        },
    },
    "5e": {
        main: {
            source: 1,
            id: "5e:main",
            name: "Fifth Edition",
            description: "Dungeons & Dragons Fifth Edition source material",
            extends: ["base:main"],
            definitions: {},
        },
    },
};
