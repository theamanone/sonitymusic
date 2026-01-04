// app/api/v1/subscription/route.ts - Simplified without authentication
import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/utils/subscription.service';

export async function GET(request: NextRequest) {
  try {
    // Return default free subscription for all users
    const defaultSubscription = {
      plan: 'free',
      displayName: 'Free Plan',
      tier: 'basic',
      status: 'active',
      region: 'US',
      
      pricing: { monthly: 0, yearly: 0, currency: 'USD', region: 'US' },
      
      usage: {
        songsListened: 0,
        storageUsed: 0,
        playlistsCreated: 0,
        friendsCount: 0
      },
      
      features: {
        canAccessPremium: false,
        canComment: false,
        canCreatePlaylist: true,
        canListenWithFriends: false,
        maxPlaylists: 10,
        maxStorageGB: 1,
        maxSongsPerMonth: 100
      },
      
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      queuedChange: null,
      
      engagement: {
        loyaltyPoints: 0,
        streakDays: 0,
        achievementBadges: [],
        referralsCount: 0
      }
    };
    
    return NextResponse.json({
      success: true,
      data: defaultSubscription
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription data' }, { status: 500 });
  }
}
