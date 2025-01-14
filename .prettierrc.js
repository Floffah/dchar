module.exports = {
    trailingComma: "all",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    jsxBracketSameLine: false,
    arrowParens: "always",
    endOfLine: "lf",
    embeddedLanguageFormatting: "auto",

    importOrder: ["<THIRD_PARTY_MODULES>", "^~icons/(.*)$", "@/(.*)$"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,

    plugins: [
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-stylex-key-sort",
    ],
};
