export const SITE_CONFIG = {
  // Basic Information
  NAME: "Sonity",
  SHORT_NAME: "Sonity",
  TAGLINE: "Listen. Discover. Feel. Your music, your way.",
  DESCRIPTION:
    "Sonity is an enhanced music streaming platform. Stream millions of songs, create playlists, and enjoy your personal offline library. Experience music like never before.",

  // Company Information
  PARENT_COMPANY: "",
  PARENT_COMPANY_URL: "",

  // URLs and Domains
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
  URL: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",

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
  ],
  PSYCHOLOGICAL_TRIGGERS: {
    TERTIARY: " ",
  },
  // Authentication
  AUTH_URL: "",

  FOUNDER: {
    NAME: "Sonity Team",
    TITLE: "Music Platform Developers",
    BIO: "Building Sonity, the ultimate music experience.",
    QUOTE: "Everyone deserves to feel music.",
  },
  CONTACT: {
    EMAIL: "support@sonity.com",
    PHONE: "+1 (888) SONITY-01",
    WEBSITE: "http://localhost:3000",
  },
  SOCIAL_LINKS: {
    Twitter: "https://twitter.com/sonity",
    Instagram: "https://instagram.com/sonity",
    Reddit: "https://reddit.com/r/sonity",
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
