import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        ppr: true,
        reactCompiler: true,
        dynamicIO: true,
    },
};

export default nextConfig;
