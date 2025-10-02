export const SITE_CONFIG = {
  // Basic Information
  NAME: "Sonity",
  SHORT_NAME: "Sonity",
  TAGLINE: "Listen. Discover. Feel. Your music, your way.",
  DESCRIPTION:
    "Sonity is an enhanced music streaming platform by Veliessa. Stream millions of songs, create playlists, and enjoy your personal offline library. Experience music like never before.",

  // Company Information
  PARENT_COMPANY: "Veliessa",
  PARENT_COMPANY_URL: process.env.NEXT_PUBLIC_DOMAIN || "https://veliessa.com",

  // URLs and Domains
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || "https://sonity.veliessa.com",
  URL: process.env.NEXT_PUBLIC_DOMAIN || "https://sonity.veliessa.com",

  // SEO Keywords
  KEYWORDS: [
    "music streaming",
    "audio platform",
    "playlists",
    "songs",
    "albums",
    "artists",
    "offline music",
    "music library",
    "sonity",
    "veliessa",
  ],
  PSYCHOLOGICAL_TRIGGERS: {
    TERTIARY: " ",
  },
  // Authentication
  AUTH_URL:
    process.env.NEXT_PUBLIC_NEXTAUTH_URL || "https://account.veliessa.com",

  FOUNDER: {
    NAME: "Aman",
    TITLE: "Founder & Product Architect",
    BIO: "Building Sonity, the ultimate AI-powered music experience.",
    QUOTE: "Everyone deserves to feel the music.",
  },
  CONTACT: {
    EMAIL: "support@sonity.veliessa.com",
    PHONE: "+1 (888) SONITY-01",
    WEBSITE: "https://sonity.veliessa.com",
  },
  SOCIAL_LINKS: {
    Twitter: "https://twitter.com/veliessa",
    Instagram: "https://instagram.com/veliessa",
    Reddit: "https://reddit.com/r/veliessa",
  },
  LEGAL: {
    TERMS_URL: "/terms",
    PRIVACY_URL: "/privacy",
  },
  METADATA: {
    FAVICON: "/favicon.ico",
    OPEN_GRAPH_IMAGE: "/og-image.jpg",
  },
  SEO: {
    KEYWORDS: [
      "music streaming",
      "audio platform",
      "Sonity",
      "listen online",
      "offline songs",
    ] as const,
    SCHEMA_TYPE: "MusicRecording",
    RICH_SNIPPETS: {
      aggregateRating: { ratingValue: "4.9", reviewCount: "2048" },
      serviceType: "Music Streaming Platform",
    },
  },
  FEATURES: {
    UPLOAD_MAX_SIZE: "500MB",
    SUPPORTED_FORMATS: ["mp3", "flac", "wav", "m4a", "ogg", "aac"],
    STREAMING_QUALITY: ["128kbps", "256kbps", "320kbps", "Lossless"],
  },
  COLORS: {
    PRIMARY: "#1DB954",
    SECONDARY: "#191414",
    ACCENT: "#ff6b35",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
