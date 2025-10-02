// app/api/seed/route.ts - Simple Spotify-like Music Streaming Plan
import { connectDB } from '@/lib/mongodb';
import { Plan } from '@/models/plan.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    await Plan.deleteMany({});

    // Single Spotify-like Premium plan - No uploads, just listening
    const spotifyLikePlan = {
      name: 'premium',
      displayName: 'Premium',
      description: 'Ad-free music streaming with unlimited skips and offline downloads',
      tagline: 'Listen without limits',

      pricing: {
        regions: {
          'US': { monthly: 9.99, yearly: 99.99, currency: 'USD' },
          'IN': { monthly: 119, yearly: 1189, currency: 'INR' },
          'EU': { monthly: 9.99, yearly: 99.99, currency: 'EUR' },
          'GB': { monthly: 9.99, yearly: 99.99, currency: 'GBP' }
        },
        defaultRegion: 'US'
      },

      contentAccess: {
        regularVideos: true,
        premiumMovies: false,
        exclusiveSeries: false,
        originalContent: false,
        earlyAccess: false,
        behindTheScenes: false,
        directorsCut: false
      },

      platformFeatures: {
        // No ads for premium users
        adsEnabled: false,
        maxVideoQuality: '320kbps', // High quality audio
        maxConcurrentStreams: 1, // Single device for basic premium
        offlineDownloads: true,
        maxOfflineDownloads: 10000, // Unlimited downloads

        // Social features for music discovery
        canComment: true,
        canLike: true,
        canShare: true,
        canCreatePlaylists: true,
        privatePlaylistsLimit: -1, // Unlimited private playlists
        publicPlaylistsLimit: -1, // Unlimited public playlists

        // NO UPLOAD FEATURES - This is Spotify-like (listening only)
        canUploadVideos: false,
        maxVideoUploadsPerMonth: 0,
        maxVideoLength: 0,
        maxUploadQuality: 'none',
        customThumbnails: false,
        videoScheduling: false,
        liveStreaming: false,
        monetization: false,
        advancedAnalytics: false,

        // No storage needed for listeners
        storageQuotaGB: 0,
        bandwidthQuotaGB: -1, // Unlimited streaming
        priorityStreaming: true,

        // Premium support
        prioritySupport: true,
        conciergeService: false,
        personalizedRecommendations: true,
        betaFeatures: true,
        apiAccess: false
      },

      tier: 'premium',
      target: 'music_listener',

      features: [
        'Ad-free music streaming',
        'Unlimited skips',
        'High quality audio (320kbps)',
        'Download unlimited songs for offline listening',
        'Create unlimited playlists',
        'Priority customer support',
        'Early access to new features'
      ],

      benefits: [
        'Listen to any song, anytime',
        'No interruptions from ads',
        'Download for offline listening',
        'Create and share playlists',
        'Premium audio quality'
      ],

      popular: true,

      ui: {
        colorTheme: '#1DB954', // Spotify green
        gradientFrom: '#1DB954',
        gradientTo: '#169443',
        badge: 'PREMIUM'
      },

      active: true,
      sortOrder: 1
    };

    await Plan.insertMany([spotifyLikePlan]);

    return NextResponse.json({
      success: true,
      message: 'Spotify-like music streaming plan created successfully',
      data: {
        plans: 1,
        strategy: [
          'Single Premium plan - no uploads, just listening',
          'Ad-free streaming with unlimited downloads',
          'Perfect for music streaming platform like Spotify'
        ]
      }
    });

  } catch (error) {
    console.error('Plan seeding error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
