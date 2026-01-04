import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site.config";
import ClientProvider from "@/components/providers/ClientProvider";
import AppProviders from "@/components/providers/AppProviders";
import AppChrome from "@/components/layout/AppChrome";
import LoadingProgress from "@/components/ui/LoadingProgress";


const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.NAME} - ${SITE_CONFIG.TAGLINE}`,
  description: SITE_CONFIG.DESCRIPTION,
  keywords: SITE_CONFIG.KEYWORDS.join(", "),
  authors: [{ name: SITE_CONFIG.FOUNDER.NAME }],
  creator: SITE_CONFIG.FOUNDER.NAME,
  publisher: SITE_CONFIG.NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_CONFIG.URL),
  alternates: {
    canonical: SITE_CONFIG.URL,
  },
  openGraph: {
    title: `${SITE_CONFIG.NAME} - ${SITE_CONFIG.TAGLINE}`,
    description: SITE_CONFIG.DESCRIPTION,
    url: SITE_CONFIG.URL,
    siteName: SITE_CONFIG.NAME,
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.NAME} Music Streaming Platform`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.NAME} - Enhanced Music Streaming`,
    description: SITE_CONFIG.DESCRIPTION,
    images: ["/assets/og-image.jpg"],
    creator: "@sonity",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://api.sonity.com" />
        <link rel="preload" href="/assets/logo.png" as="image" />
        <link rel="prefetch" href="/genres" />
        <link rel="prefetch" href="/artists" />
        <link rel="prefetch" href="/playlists" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sonity" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function() {
            try {
              const stored = localStorage.getItem('sonity-theme-config');
              const config = stored ? JSON.parse(stored) : { mode: 'light' };
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              let resolvedMode = 'light';
              switch (config.mode) {
                case 'system':
                  resolvedMode = systemDark ? 'dark' : 'light';
                  break;
                case 'auto':
                  const hour = new Date().getHours();
                  resolvedMode = (hour >= 6 && hour < 18) ? 'light' : 'dark';
                  break;
                default:
                  resolvedMode = config.mode || 'light';
              }
              
              document.documentElement.setAttribute('data-theme', resolvedMode);
              document.documentElement.classList.add(resolvedMode);
              
              if (config.variant) {
                document.documentElement.setAttribute('data-theme-variant', config.variant);
                document.documentElement.classList.add('theme-' + config.variant);
              }
            } catch (e) {
              document.documentElement.setAttribute('data-theme', 'light');
              document.documentElement.classList.add('light');
            }
          })();`,
          }}
        />
        {typeof window !== 'undefined' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator && window.location.protocol === 'http:') {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then(registration => {
                        console.log('SW registered successfully:', registration);
                        // Force update for development
                        registration.update();
                      })
                      .catch(error => console.error('SW registration failed:', error));
                  });
                } else {
                  console.log('Service Worker not supported or not on HTTP');
                }
              `
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientProvider>
          <AppProviders>
            <AppChrome>
              <LoadingProgress />
              {children}
            </AppChrome>
          </AppProviders>
        </ClientProvider>
      </body>
    </html>
  );
}
