// app/page.tsx - Sonity Music Streaming Landing Page
import { SITE_CONFIG } from "@/config/site.config";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { SubscriptionService } from "@/utils/subscription.service";
import ClientHome from "./ClientHome";

// Mock track data for demonstration (same as in API route)
const mockTracks = [
  {
    _id: '1',
    customTrackId: 'track-1',
    title: 'Ranjheya Ve',
    description: 'A beautiful Punjabi track by Zain Zohaib',
    tags: ['punjabi', 'romantic', 'zain-zohaib'],
    genre: 'pop',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'punjabi',
    audioUrl: '/api/v1/audio/hls/hls_test_track/playlist.m3u8',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
      // default: '/uploads/Ranjheya-Ve-Punjabi-2022-20231130173851-500x500.jpg',
      // medium: '/uploads/Ranjheya-Ve-Punjabi-2022-20231130173851-500x500.jpg'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['mp3'],
    processingProgress: 100,
    originalFileSize: 5000000,
    duration: 240,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-1',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 15420,
    uniquePlays: 12300,
    likes: 892,
    dislikes: 12,
    comments: 45,
    shares: 234,
    averageRating: 4.8,
    totalRatings: 234,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'ranjheya-ve-zain-zohaib',
    searchTags: ['ranjheya', 'zain', 'zohaib'],
    trending: true,
    featured: true,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-1',
      name: 'Zain Zohaib',
      email: 'artist@example.com',
      avatar: '/images/default-artist.jpg',
      verified: false
    }
  },
  {
    _id: '2',
    customTrackId: 'track-2',
    title: 'Summer Vibes',
    description: 'Upbeat electronic track perfect for summer',
    tags: ['electronic', 'summer', 'dance'],
    genre: 'electronic',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'english',
    audioUrl: '/api/v1/audio/stream/summer-vibes.mp3',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&crop=center'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['mp3'],
    processingProgress: 100,
    originalFileSize: 4000000,
    duration: 180,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-2',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 8930,
    uniquePlays: 7200,
    likes: 456,
    dislikes: 8,
    comments: 23,
    shares: 145,
    averageRating: 4.5,
    totalRatings: 123,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'summer-vibes-dj-cool',
    searchTags: ['summer', 'vibes', 'electronic'],
    trending: false,
    featured: false,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-2',
      name: 'DJ Cool',
      email: 'dj@example.com',
      avatar: '/images/default-artist.jpg',
      verified: false
    }
  },
  {
    _id: '3',
    customTrackId: 'track-3',
    title: 'Saiyaara (8D Audio)',
    description: '8D Audio experience of the beautiful track Saiyaara by Arijit Singh',
    tags: ['8d-audio', 'bollywood', 'romantic', 'arijit-singh'],
    genre: 'pop',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'hindi',
    audioUrl: '/api/v1/audio/hls/saiyaara_8d/playlist.m3u8',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&crop=center'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['hls'],
    processingProgress: 100,
    originalFileSize: 8500000,
    duration: 285,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-3',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 25680,
    uniquePlays: 18900,
    likes: 1250,
    dislikes: 8,
    comments: 89,
    shares: 456,
    averageRating: 4.9,
    totalRatings: 567,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'saiyaara-8d-audio-arijit-singh',
    searchTags: ['saiyaara', '8d', 'arijit', 'singh', 'bollywood'],
    trending: true,
    featured: true,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-3',
      name: 'Arijit Singh',
      email: 'arijit@example.com',
      avatar: '/images/arijit-singh.jpg',
      verified: true
    }
  },
  {
    _id: '4',
    customTrackId: 'track-4',
    title: 'Urban Nights',
    description: 'Hip-hop beats with city vibes',
    tags: ['hip-hop', 'urban', 'beats'],
    genre: 'hip-hop',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'english',
    audioUrl: '/api/v1/audio/stream/urban-nights.mp3',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['mp3'],
    processingProgress: 100,
    originalFileSize: 4200000,
    duration: 195,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-4',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 7230,
    uniquePlays: 5800,
    likes: 387,
    dislikes: 12,
    comments: 31,
    shares: 156,
    averageRating: 4.6,
    totalRatings: 145,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'urban-nights-hip-hop',
    searchTags: ['hip-hop', 'urban', 'beats'],
    trending: false,
    featured: false,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-4',
      name: 'Urban Beats',
      email: 'urban@example.com',
      avatar: '/images/default-artist.jpg',
      verified: false
    }
  },
  {
    _id: '5',
    customTrackId: 'track-5',
    title: 'Acoustic Morning',
    description: 'Gentle acoustic guitar melodies for peaceful mornings',
    tags: ['acoustic', 'morning', 'peaceful'],
    genre: 'pop',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'instrumental',
    audioUrl: '/api/v1/audio/stream/acoustic-morning.mp3',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&crop=center'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['mp3'],
    processingProgress: 100,
    originalFileSize: 2800000,
    duration: 165,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-5',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 4120,
    uniquePlays: 3200,
    likes: 198,
    dislikes: 3,
    comments: 14,
    shares: 67,
    averageRating: 4.9,
    totalRatings: 78,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'acoustic-morning-peaceful',
    searchTags: ['acoustic', 'morning', 'peaceful'],
    trending: false,
    featured: false,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-5',
      name: 'Morning Sounds',
      email: 'morning@example.com',
      avatar: '/images/default-artist.jpg',
      verified: false
    }
  },
  {
    _id: '6',
    customTrackId: 'track-6',
    title: 'Jazz Café',
    description: 'Smooth jazz melodies perfect for café ambiance',
    tags: ['jazz', 'smooth', 'café'],
    genre: 'jazz',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'instrumental',
    audioUrl: '/api/v1/audio/stream/jazz-cafe.mp3',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&crop=center'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['mp3'],
    processingProgress: 100,
    originalFileSize: 3800000,
    duration: 225,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-6',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 3890,
    uniquePlays: 2900,
    likes: 245,
    dislikes: 7,
    comments: 22,
    shares: 98,
    averageRating: 4.8,
    totalRatings: 112,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'jazz-cafe-smooth',
    searchTags: ['jazz', 'smooth', 'café'],
    trending: false,
    featured: false,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-6',
      name: 'Jazz Café',
      email: 'jazz@example.com',
      avatar: '/images/default-artist.jpg',
      verified: false
    }
  },
  {
    _id: '7',
    customTrackId: 'track-7',
    title: 'Rock Anthem',
    description: 'High-energy rock track for workout motivation',
    tags: ['rock', 'energetic', 'workout'],
    genre: 'rock',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'english',
    audioUrl: '/api/v1/audio/stream/rock-anthem.mp3',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['mp3'],
    processingProgress: 100,
    originalFileSize: 4500000,
    duration: 198,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-7',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 6780,
    uniquePlays: 5200,
    likes: 389,
    dislikes: 15,
    comments: 28,
    shares: 134,
    averageRating: 4.4,
    totalRatings: 167,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'rock-anthem-workout',
    searchTags: ['rock', 'energetic', 'workout'],
    trending: true,
    featured: false,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-7',
      name: 'Rock Energy',
      email: 'rock@example.com',
      avatar: '/images/default-artist.jpg',
      verified: false
    }
  },
  {
    _id: '8',
    customTrackId: 'track-8',
    title: 'Classical Peace',
    description: 'Beautiful classical piece for relaxation and focus',
    tags: ['classical', 'peaceful', 'focus'],
    genre: 'classical',
    privacy: 'public' as const,
    allowComments: true,
    explicit: false,
    language: 'instrumental',
    audioUrl: '/api/v1/audio/stream/classical-peace.mp3',
    coverArt: {
      default: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&crop=center',
      medium: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&crop=center'
    },
    lyrics: [],
    processingStatus: 'ready' as const,
    availableQualities: ['mp3'],
    processingProgress: 100,
    originalFileSize: 3200000,
    duration: 245,
    drmEnabled: false,
    encryptionStatus: 'none' as const,
    artistId: 'artist-8',
    artistType: 'user' as const,
    contentType: 'track' as const,
    plays: 2340,
    uniquePlays: 1800,
    likes: 156,
    dislikes: 2,
    comments: 11,
    shares: 45,
    averageRating: 4.9,
    totalRatings: 67,
    listenTime: 0,
    completionRate: 0,
    skipRate: 0,
    moderationStatus: 'approved' as const,
    moderationFlags: [],
    contentWarnings: [],
    slug: 'classical-peace-relaxation',
    searchTags: ['classical', 'peaceful', 'focus'],
    trending: false,
    featured: false,
    publishedAt: new Date(),
    version: 1,
    isLatest: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    artistDetails: {
      _id: 'artist-8',
      name: 'Classical Master',
      email: 'classical@example.com',
      avatar: '/images/default-artist.jpg',
      verified: false
    }
  }
];

export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = 'force-static';

export interface SubscriptionData {
  plan: string;
  status: string;
  videosUploaded: number;
  storageUsed: number;
  canWatchAdFree: boolean;
  canUploadHD: boolean;
  canUpload4K: boolean;
  canAccessPremium: boolean;
}

export const metadata: Metadata = {
  title: `Sonity - Stream Music Online | Enhanced Music Platform`,
  description: `Discover and stream millions of songs from artists around the world. Your music, your way with Sonity.`,
  keywords: ['music streaming', 'songs', 'artists', 'playlists', 'music discovery', 'audio streaming'],
  openGraph: {
    title: `Sonity - Enhanced Music Streaming Platform`,
    description: `Discover and stream millions of songs from artists around the world. Your music, your way with Sonity.`,
    url: SITE_CONFIG.URL,
    siteName: SITE_CONFIG.NAME,
    images: [
      {
        url: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop&crop=center`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.NAME} Music Platform`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Sonity - Enhanced Music Streaming Platform`,
    description: `Discover and stream millions of songs from artists around the world. Your music, your way with Sonity.`,
    images: [`https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop&crop=center`],
  },
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  let initialSubscription: SubscriptionData = {
    plan: "guest",
    status: "none",
    videosUploaded: 0,
    storageUsed: 0,
    canWatchAdFree: false,
    canUploadHD: false,
    canUpload4K: false,
    canAccessPremium: false,
  };

  // Fetch user subscription if logged in
  if (session?.user?.id) {
    const subscription = await SubscriptionService.getUserSubscription(session.user.id);

    if (subscription) {
      const canWatchAdFree = !(subscription.limits?.adsEnabled ?? true);
      const canAccessPremium = subscription.limits?.canWatchPremiumMovies ?? false;

      initialSubscription = {
        plan: subscription.plan,
        status: subscription.status,
        videosUploaded: subscription.usage?.videosUploaded || 0,
        storageUsed: subscription.usage?.storageUsed || 0,
        canWatchAdFree,
        canUploadHD: subscription.limits.canUploadHD,
        canUpload4K: subscription.limits.canUpload4K,
        canAccessPremium,
      };
    } else {
      // Fallback to free plan
      initialSubscription = {
        plan: "free",
        status: "active",
        videosUploaded: 0,
        storageUsed: 0,
        canWatchAdFree: false,
        canUploadHD: false,
        canUpload4K: false,
        canAccessPremium: false,
      };
    }
  }

  // Use mock data for demonstration
  const trendingTracks = mockTracks.filter(track => track.trending).slice(0, 6);
  const recentTracks = mockTracks.slice(0, 8);

  return (
    <ClientHome
      initialSubscription={initialSubscription}
      trendingTracks={trendingTracks}
      recentTracks={recentTracks}
      user={session?.user || null}
    />
  );
}
