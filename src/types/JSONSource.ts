export type JSONSourceVersion =
    | `${number}.${number}.${number}`
    | `sha256:${string}`;

export type JSONSourceIdentifier =
    | `${string}:${string}`
    | `https://${"dchar.floffah.dev" | "raw.githubusercontent.com"}/${string}`;

export interface JSONSource {
    /**
     * Indicates that this file is a source, value should *always* be `1`
     */
    source: 1;

    /**
     * The id to use for the identifier in the editor. Should really be the same ID as what is used to resolve it, but it doesn't have to be. (e.g. should be a url if it's loaded via a raw.githubusercontent.com url)
     */
    id: JSONSourceIdentifier;

    /**
     * The name of the source
     */
    name: string;

    /**
     * The description of the source
     */
    description: string;

    /**
     * The version of the source. If not provided, a hash of the source will be used. SemVer/Epoch SemVer is recommended.
     */
    version?: JSONSourceVersion;

    /**
     * A list of sources this should be merged with. Can be relative paths or web urls. In the future, GitHub repositories will be supported.
     * Supported domains for web urls are:
     * - `raw.githubusercontent.com`
     * - `dchar.floffah.dev`
     */
    extends?: JSONSourceIdentifier[];

    /**
     * Set this to true if this shouldn't be loaded standalone, but should be depended on by other sources.
     */
    lib?: boolean;

    /**
     * The definitions of the source. The actual content of the source resides here.
     */
    definitions: {
        /**
         * Pages that the source contributes to the editor wizard. You don't need to define all pages here, only the ones that are unique to this source or that you want to override.
         * Key should be the string ID
         */
        pages?: {
            [id: string]: {
                name: string;
            };
        };

        /**
         * Page sections that the source contributes to the editor wizard. You don't need to define all sections here, only the ones that are unique to this source or that you want to override.
         * Key should be the string ID.
         */
        sections?: {
            [id: string]: {
                name: string;
                /**
                 * The ID of the page this section belongs to
                 */
                page: string;
            };
        };

        /**
         * A list of variables that this source may set or utilise. These are unique to the source and cannot be referenced by other sources with name alone. Other sources may reference them with `namespace:name.variable`
         */
        variables?: {
            [id: string]: {
                description: string;
                /**
                 * Whether this is a virtual variable and not set by a field in the character editor wizard. If set, you must also set calculation
                 */
                virtual?: boolean;
                /**
                 * A mathematical expression that calculates the value of this variable. Only used if virtual is set.
                 * Examples:
                 * - `1 + 1`
                 * - `base:main.variables.strength + 2`
                 * - `0.5 * (base:main.variables.strength + base:main.variables.dexterity + base:main.variables.constitution + base:main.variables.intelligence + base:main.variables.wisdom + base:main.variables.charisma)`
                 */
                calculation?: string;
            };
        };

        fields?: {
            [id: string]: {
                name: string;
                description: string;
                type:
                    | "string"
                    | "number"
                    | "boolean"
                    | "object"
                    | "array"
                    | "enum";
                required?: boolean;
                default?: string | number | boolean | object | any[];
                enum?: string[];

                /**
                 * The variable this field is bound to.
                 */
                variable?: string;
            };
        };
    };
}
