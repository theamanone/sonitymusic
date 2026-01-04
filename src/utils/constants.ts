// Brand colors
export const COLORS = {
  primary: '#D4AF37', // Metallic gold
  primaryDark: '#B7950B',
  primaryLight: '#FFD700',
  text: '#1F2937',
  textLight: '#6B7280',
  background: '#FFFFFF',
  border: '#E5E7EB',
};

// Known domains that can be referenced by name
export const KNOWN_DOMAINS: Record<string, string> = {
  'instagram': 'https://instagram.com',
  'facebook': 'https://facebook.com',
  'twitter': 'https://twitter.com',
  'youtube': 'https://youtube.com',
  'pinterest': 'https://pinterest.com',
  'tiktok': 'https://tiktok.com',
  'sonity': 'https://sonity.com'
};

// Common validation patterns
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
  domain: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
};

// Default message settings
export const MESSAGES = {
  loading: 'Loading...',
  error: 'An error occurred. Please try again.',
  noContent: 'No content available.'
};

// Audio player settings
export const AUDIO = {
  sampleRate: 44100,
  channels: 1,
  bufferSize: 4096,
  fftSize: 2048
};
