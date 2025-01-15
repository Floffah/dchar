const { resolve } = require("path");

/** @type {import('postcss-load-config').Config} */
module.exports = {
    plugins: {
        "@stylexswc/postcss-plugin": {
            include: ["src/**/*.{js,jsx,ts,tsx}"],
            rsOptions: require("./stylex.config"),
            extractCSS: false,
        },
        "postcss-preset-env": {},
        cssnano: {
            preset: ["default", { discardUnused: true }],
        },
    },
};
