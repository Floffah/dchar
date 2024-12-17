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
            use: "raw-loader",
        });

        return config;
    },
};

export default nextConfig;
