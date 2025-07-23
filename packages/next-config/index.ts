import withBundleAnalyzer from '@next/bundle-analyzer';
// @ts-expect-error No declaration file
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import type { NextConfig } from 'next';

const otelRegex = /@opentelemetry\/instrumentation/;

export const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      '@repo/design',
      'recharts',
      'framer-motion',
      '@emoji-mart/react',
      'lucide-react',
      '@phosphor-icons/react',
      'react-markdown',
      'react-syntax-highlighter',
    ],
  },

  // biome-ignore lint/suspicious/useAwait: rewrites is async
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },

  webpack(config, { isServer, nextRuntime }) {
    config.ignoreWarnings = [{ module: otelRegex }];

    // Add Prisma plugin for server builds in monorepo
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    // Optimize client-side bundles
    if (!isServer && nextRuntime !== 'edge') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // UI components
            ui: {
              name: 'ui',
              test: /[\\/]packages[\\/]design[\\/]|[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            // Large libraries
            lib: {
              test(module: any) {
                return module.size() > 160000 &&
                  /node_modules[\\/]/.test(module.identifier());
              },
              name(module: any) {
                const crypto = require('crypto');
                const hash = crypto.createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Common chunks
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);
