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
        regularSongs: true,
        premiumSongs: false,
        exclusiveReleases: false,
        officialMusicVideos: false, // Unique feature: videos related to songs
        behindTheScenes: false,
        artistInterviews: false
      },

      platformFeatures: {
        adsEnabled: false,
        skipAdsAfterSeconds: 0,
        highQualityStreaming: true, // 320kbps
        losslessStreaming: false, // FLAC for higher tiers

        // Social Features (Pure consumption)
        canCreatePlaylists: true,
        maxPlaylists: -1, // Unlimited
        canFollowArtists: true,
        canComment: true,
        canShare: true,
        canLikeSongs: true,

        // Premium Features (Pure consumption - NO UPLOADS)
        offlineDownloads: true,
        maxOfflineDevices: 10, // High limit for premium
        listenWithFriends: true, // Listen together feature
        liveSessions: true, // Join live artist sessions
        prioritySupport: true,
        earlyAccess: true,
        personalizedRecommendations: true,

        // Family Plan
        familyPlan: false,
        maxFamilyMembers: 1
      },

      features: [
        'Ad-free music streaming',
        'High quality audio (320kbps)',
        'Unlimited offline downloads',
        'Listen with friends',
        'Live artist sessions',
        'Unlimited playlists',
        'Personalized recommendations',
        'Priority customer support',
        'Early access to new features'
      ],

      benefits: [
        'Stream any song, anytime',
        'No interruptions from ads',
        'Download for offline listening',
        'Listen together with friends',
        'Join exclusive live sessions',
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
