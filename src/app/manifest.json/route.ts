import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/config/site.config';

export async function GET() {
  const manifest = {
    name: SITE_CONFIG.NAME,
    short_name: SITE_CONFIG.SHORT_NAME,
    description: SITE_CONFIG.DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    background_color: '#ffffff', // Light mode background
    theme_color: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: SITE_CONFIG.COLORS.PRIMARY }
    ],
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/apple-touch-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    categories: ['music', 'entertainment', 'lifestyle'],
    lang: 'en-US',
    dir: 'ltr',
    // iOS 26+ specific features
    apple_touch_icon: '/apple-touch-icon-180x180.png',
    apple_mobile_web_app_capable: 'yes',
    apple_mobile_web_app_status_bar_style: 'default',
    apple_mobile_web_app_title: SITE_CONFIG.SHORT_NAME,
    // PWA features
    prefer_related_applications: false,
    shortcuts: [
      {
        name: 'Discover Music',
        short_name: 'Discover',
        description: 'Find new music',
        url: '/discover',
        icons: [{ src: '/web-app-manifest-192x192.png', sizes: '192x192' }]
      },
      {
        name: 'My Library',
        short_name: 'Library',
        description: 'Access your music library',
        url: '/library',
        icons: [{ src: '/web-app-manifest-192x192.png', sizes: '192x192' }]
      },
      {
        name: 'Now Playing',
        short_name: 'Playing',
        description: 'Control current playback',
        url: '/#now-playing',
        icons: [{ src: '/web-app-manifest-192x192.png', sizes: '192x192' }]
      }
    ],
    // Edge cases for different browsers
    edge_side_panel: {
      preferred_width: 400,
      min_width: 300,
      max_width: 600
    },
    // Service worker scope
    serviceworker: {
      src: '/sw.js',
      scope: '/',
      use_cache: true
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
