// app/api/v1/premium/route.ts - Enhanced with SubscriptionModel integration
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { SubscriptionService } from '@/utils/subscription.service';
import { Plan, IPlan } from '@/models/plan.model';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user's current subscription using enhanced SubscriptionService
    const subscription = await SubscriptionService.getUserSubscription(session.user.id);

    // Load active plans from Plan model
    const dbPlans = await Plan.find({ active: true })
      .sort({ sortOrder: 1 })
      .lean() as unknown as IPlan[];

    const plans = dbPlans.map((p) => {
      // Regional pricing: prefer defaultRegion
      const regions: any = p.pricing?.regions || {} as any;
      const defaultRegion = p.pricing?.defaultRegion || 'US';
      const regionalPricing = (regions.get?.(defaultRegion)) || regions[defaultRegion] || { monthly: 0, yearly: 0, currency: 'USD' };

      return {
        key: p.name.toLowerCase(),
        name: p.displayName || p.name,
        description: p.description,
        features: p.features || [],
        priceMonthly: regionalPricing.monthly,
        priceYearly: regionalPricing.yearly,
        currency: regionalPricing.currency || 'USD',
        songsPerMonth: 0, // No upload limits - pure streaming
        maxStorageGB: 0, // No storage needed for streaming
        maxSongLength: 0, // No upload limits
        canUploadHD: p.platformFeatures?.highQualityStreaming ?? false,
        canUploadLossless: p.platformFeatures?.losslessStreaming ?? false,
        canListenWithFriends: p.platformFeatures?.listenWithFriends ?? false,
        canJoinLiveSessions: p.platformFeatures?.liveSessions ?? false,
        canAccessMusicVideos: p.contentAccess?.officialMusicVideos ?? false,
        canCreateUnlimitedPlaylists: (p.platformFeatures?.maxPlaylists ?? 0) > 50,
        canDownloadOffline: p.platformFeatures?.offlineDownloads ?? false,
        maxOfflineDevices: p.platformFeatures?.maxOfflineDevices ?? 0,
        active: p.active,
        popular: p.popular || false,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        currentPlan: subscription.plan,
        status: subscription.status,
        usage: {
          songsListened: subscription.usage?.songsPlayed || 0,
          storageUsed: subscription.usage?.storageUsed || 0
        },
        plans,
        queuedChange: subscription.queuedChange || null,
        // Enhanced billing info
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd
      }
    });

  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing information' },
      { status: 500 }
    );
  }
}
