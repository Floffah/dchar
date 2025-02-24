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
}
