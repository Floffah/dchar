import type { NextConfig } from "next";
import Icons from "unplugin-icons/webpack";

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

export default nextConfig;
