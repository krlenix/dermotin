import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: isDev ? 0 : 31536000,
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog'],
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Compression and caching
  compress: true,
  
  // Bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, 'src'),
      };
      return config;
    },
  }),
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
        {
          key: 'Cache-Control',
          value: isDev ? 'no-store, no-cache, must-revalidate, max-age=0' : 'public, max-age=31536000, immutable',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        ],
      },
      {
        // Never cache local dev bundles; keep prod immutable.
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev ? 'no-store, no-cache, must-revalidate, max-age=0' : 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // HTML pages should always revalidate; local dev should never cache.
        source: '/:locale(rs|ba|me)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev ? 'no-store, no-cache, must-revalidate, max-age=0' : 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
