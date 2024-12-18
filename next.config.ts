import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
                    loader: "./src/lib/webpackLoaders/lua-loader.js",
                    options: {
                        RenameVariables: true,
                        RenameFunctions: true,
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;
