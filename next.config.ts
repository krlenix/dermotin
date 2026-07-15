import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Old WordPress (Yoast) sitemap URLs → new sitemap.
  // The full legacy URL migration lives in src/config/legacy-urls.ts
  // (applied by middleware so ad URLs keep working unchanged via rewrites).
  async redirects() {
    return [
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/:name(page|product|product_cat|wffn_ty|wfacp_checkout|wfocu_offer|elementor-hf|elementskit_content)-sitemap.xml', destination: '/sitemap.xml', permanent: true },
    ];
  },

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
    // SVI kvaliteti koje komponente koriste (galerija 50/60/90, headeri 95, default 75) —
    // vrednost van ove liste je runtime greška, a lista postaje obavezna od Next 16
    qualities: [25, 50, 60, 75, 90, 95, 100],
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
