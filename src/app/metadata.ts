import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sonity - Stream Music Online | Enhanced Music Streaming by Veliessa',
  description: 'Experience music streaming redefined with Sonity by Veliessa. Stream millions of songs, create personalized playlists, add your own offline tracks, and discover new artists. Free & Premium plans with offline listening.',
  keywords: 'music streaming, online music, playlist creator, offline music, song library, audio streaming, music player, artists, albums, Sonity, Veliessa, enhanced Spotify alternative',
  authors: [{ name: 'Sonity by VELIESSA' }],
  creator: 'VELIESSA',
  publisher: 'VELIESSA',
  applicationName: 'Sonity',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sonity.veliessa.com'),
  alternates: {
    canonical: 'https://sonity.veliessa.com',
  },
  openGraph: {
    title: 'Sonity - Enhanced Music Streaming Platform by Veliessa',
    description: 'Stream millions of songs, create playlists, and add your own offline tracks. Experience the next generation of music streaming with Sonity.',
    url: 'https://sonity.veliessa.com',
    siteName: 'Sonity',
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sonity Music Streaming Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sonity - Enhanced Music Streaming Platform',
    description: 'Stream millions of songs, create playlists, and enjoy offline listening. Your music, your way.',
    images: ['/assets/og-image.jpg'],
    creator: '@veliessa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}
