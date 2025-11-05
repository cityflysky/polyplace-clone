/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config;
    },
    images: {
        // Vercel 支持图片优化，但为了兼容性可以设置 unoptimized
        unoptimized: false,
        // 允许的外部图片域名
        domains: [
            'gateway.pinata.cloud',
            'nftstorage.link',
            'ipfs.io',
            'polyplace.infura-ipfs.io',
        ],
        // 增加远程图片匹配模式
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.pinata.cloud',
            },
            {
                protocol: 'https',
                hostname: '**.ipfs.io',
            },
            {
                protocol: 'https',
                hostname: '**.nftstorage.link',
            },
        ],
    },
};

module.exports = nextConfig;
