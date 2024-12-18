import { Minify } from "lua-format";

/**
 * for use with webpack
 */
export default function rawLuaLoader(source) {
    const options = this.getOptions();

    const minified = Minify(source, options)
        .replace(/--\[\[[\s\S]*-]]/g, "")
        .trim();

    const json = JSON.stringify(minified)
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

    return `export default ${json};`;
}
