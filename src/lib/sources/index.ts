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
            name: "Base Source",
            description:
                "Base source material. All other sources should depend on this",
            lib: true,
        },
    },
    "5e": {
        main: {
            source: 1,
            name: "Fifth Edition",
            description: "Dungeons & Dragons Fifth Edition source material",
            extends: ["base:main"],
        },
    },
};
