import stylexConfig from "./stylex.config";
import stylexPlugin from "@stylexswc/nextjs-plugin";
import type { NextConfig } from "next";
import Icons from "unplugin-icons/webpack";

const withStylex = stylexPlugin({
    rsOptions: stylexConfig,
    extractCSS: false,
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["@node-rs/bcrypt"],
    experimental: {
        ppr: true,
        reactCompiler: true,
        dynamicIO: true,
    },
    typescript: {
        // part of lint step, next ignores tsconfig references and breaks trpc
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                module: false,
            };
        }

        config.module.rules.push({
            test: /\.lua/,
            use: [
                {
                    loader: "./src/lib/webpack/lua-loader.js",
                    options: {
                        RenameVariables: true,
                        RenameFunctions: true,
                    },
                },
            ],
        });

        config.plugins.push(
            Icons({
                compiler: "jsx",
                jsx: "react",
            }),
        );

        return config;
    },
};

export default withStylex(nextConfig);
