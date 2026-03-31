import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            }
        ]
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['*']
        }
    }
};

export default nextConfig;