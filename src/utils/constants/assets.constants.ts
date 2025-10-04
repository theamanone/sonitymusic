// Asset paths for Cinevo Video Platform

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NODE_ENV === 'production' 
    ? 'https://cinevo.veliessa.com'
    : 'http://localhost:3001';
};

export const ASSETS = {
  // Logo variations
  LOGO: {
    PRIMARY: '/assets/sonity.png',
    MONOCHROME: '/assets/sonity.png',
    FULL: "/assets/sonity_lg.png",
  },
  FALLBACK: {
    USER: {
      AVATAR: "/assets/fallback/avatar.png",
    },
    BLOG: {
      IMAGE: "/assets/fallback/blog.jpg",
    },
  },
  SERVICES: {
    LUXURY_MEMBERSHIP: "/assets/services/luxury-membership.png",
    FOUNDER: "/assets/founder/founder.jpg",
  },
  // Web App Icons
  ICONS: {
    FAVICON: "/icons/learn-favicon.ico",
    MAIN_ICON: "/icons/learn-icon.png",
    SVG_ICON: "/icons/learn-icon.svg",
    APPLE_ICON: "/icons/apple-touch-icon.png",
  },

  // Web App Manifest Icons
  MANIFEST_ICONS: {
    SMALL: "/web-app-manifest-192x192.png",
    LARGE: "/web-app-manifest-512x512.png",
  },
  PRODUCT_IMAGES: {},
};
