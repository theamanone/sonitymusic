/* The above code is a configuration file for a Next.js project written in TypeScript. Here is a
summary of what the code is doing: */
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Determine the base URLs based on environment
const getAuthBaseUrl = () => {
  if (isDevelopment) return "http://localhost:3000"; // account.veliessa.com
  return "https://account.veliessa.com";
};

const getAppBaseUrl = () => {
  if (isDevelopment) return "http://localhost:3001"; // styra.veliessa.com
  return "https://styra.veliessa.com";
};

const nextConfig: NextConfig = {
  generateBuildId: async () => {
    return 'sonity-build-' + Date.now().toString(36);
  },
  serverExternalPackages: ['mongoose'],
  // Performance optimizations
  reactStrictMode: true,
  // ✅ Fixed: devIndicators should be boolean only
  devIndicators: false, // Set to true if you want to see build activity

  // Security & Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // Console removal for production only
  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ["error", "warn"],
        }
      : false,
  },

  // Fixed image configuration for development
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "videos.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // Local/dev and app domain for absolute asset URLs
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.124.201.166",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/tracks/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/api/tracks/**',
      },
      {
        protocol: "https",
        hostname: "styra.veliessa.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,

  // Apply security headers only in production
  async headers() {
    const baseHeaders = [
      {
        source: "/api/tracks/stream/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Range, Content-Range, Content-Length",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
        ],
      },
      {
        source: "/api/audio/stream/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Range, Content-Range, Content-Length",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
        ],
      },
    ];

    if (isDevelopment) {
      return [
        ...baseHeaders,
        {
          source: "/:path*",
          headers: [
            {
              key: "X-Frame-Options",
              value: "SAMEORIGIN",
            },
            {
              key: 'Cache-Control',
              value: 'public, s-maxage=300, stale-while-revalidate=600',
            },
          ],
        },
        {
          source: "/assets/:path*",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*",
            },
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ];
    }

    // Production security headers
    const securityHeaders = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "microphone=(self), camera=(), geolocation=(), interest-cohort=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com",
          "script-src-elem 'self' 'unsafe-inline' https://checkout.razorpay.com https://*.razorpay.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.razorpay.com",
          "font-src 'self' https://fonts.gstatic.com https://*.razorpay.com",
          "img-src 'self' data: blob: https: http:",
          "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com https://*.veliessa.com https://*.veliessa.com https://lumberjack.razorpay.com",
          "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com",
          "media-src 'self' data: blob:",
          "worker-src 'self' blob:",
          "child-src 'self' blob:",
          "frame-ancestors 'none'",
          "form-action 'self' https://*.razorpay.com",
          "base-uri 'self'",
          "object-src 'none'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
    ];

    return [
      ...baseHeaders,
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/(_next/static|images|icons)/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects only for production
  async redirects() {
    if (isDevelopment) return [];
    const appBaseUrl = getAppBaseUrl();
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: `${appBaseUrl}/:path*`,
        permanent: true,
      },
    ];
  },
  // Conditional rewrites - only apply in production
  async rewrites() {
    if (isDevelopment) {
      return {
        beforeFiles: [],
        afterFiles: [],
        fallback: [],
      };
    }

    const authBaseUrl = getAuthBaseUrl();
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/api/auth/:path*",
          destination: `${authBaseUrl}/api/auth/:path*`,
        },
      ],
      fallback: [],
    };
  },

  // ✅ FIXED: Clean experimental config
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
    scrollRestoration: true,
    // ✅ REMOVED: serverComponentsExternalPackages (moved to root level)
  },

  // Webpack config
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;