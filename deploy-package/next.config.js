/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    // Enable standalone output for Node.js deployment
    output: 'standalone',
    // Disable image optimization for better compatibility
    images: {
        unoptimized: true,
    },
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config;
    },
};

module.exports = nextConfig;
