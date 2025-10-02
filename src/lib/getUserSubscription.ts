import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { SubscriptionModel } from '@/models/billing-subscription.model';
import { Plan } from '@/models/plan.model';
import { connectDB } from '@/lib/mongodb';

export interface UserSubscriptionDetails {
  hasActiveSubscription: boolean;
  planName: string;
  maxQuality: '240p' | '360p' | '480p' | '720p' | '1080p' | '4K';
  hasAds: boolean;
  skipAdsAfterSeconds: number;
  canDownload: boolean;
  canWatchOffline: boolean;
  maxConcurrentStreams: number;
  canAccessPremiumContent: boolean;
  canRentMovies: boolean;
  isValid: boolean;
}

export async function getUserSubscription(userId?: string): Promise<UserSubscriptionDetails> {
  try {
    await connectDB();
    
    // Get user ID from session if not provided
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return getDefaultSubscription();
      }
      userId = session.user.id;
    }
    
    // Find user's subscription
    const subscription = await SubscriptionModel.findOne({ 
      userId,
      status: { $in: ['active', 'inactive'] }
    }).lean() as any;
    
    if (!subscription) {
      return getDefaultSubscription();
    }
    
    // Check if subscription is still valid
    const now = new Date();
    if (subscription.currentPeriodEnd < now) {
      // Subscription expired, update status
      await SubscriptionModel.updateOne(
        { _id: subscription._id },
        { status: 'expired' }
      );
      return getDefaultSubscription();
    }
    
    // Get plan details for quality limits
    const plan = await Plan.findOne({ name: subscription.plan }).lean() as any;
    if (!plan) {
      return getDefaultSubscription();
    }
    
    return {
      hasActiveSubscription: true,
      planName: subscription.plan,
      maxQuality: plan.limits?.maxQuality || '480p',
      hasAds: plan.limits?.adsEnabled !== false,
      skipAdsAfterSeconds: plan.limits?.skipAdsAfterSeconds || 0,
      canDownload: plan.limits?.canDownload || false,
      canWatchOffline: plan.limits?.canWatchOffline || false,
      maxConcurrentStreams: plan.limits?.maxConcurrentStreams || 1,
      canAccessPremiumContent: plan.limits?.canAccessPremium || false,
      canRentMovies: plan.limits?.canRentMovies || false,
      isValid: true
    };
    
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return getDefaultSubscription();
  }
}

function getDefaultSubscription(): UserSubscriptionDetails {
  return {
    hasActiveSubscription: false,
    planName: 'free',
    maxQuality: '480p', // Free users get up to 480p
    hasAds: true,
    skipAdsAfterSeconds: 0, // Non-skippable ads for free users
    canDownload: false,
    canWatchOffline: false,
    maxConcurrentStreams: 1,
    canAccessPremiumContent: false,
    canRentMovies: false,
    isValid: false
  };
}

// Get quality order for comparison
export function getQualityOrder(quality: string): number {
  const order: Record<string, number> = {
    '240p': 1,
    '360p': 2,
    '480p': 3,
    '720p': 4,
    '1080p': 5,
    '4K': 6
  };
  return order[quality] || 3;
}

// Check if requested quality is allowed
export function isQualityAllowed(
  requestedQuality: string, 
  maxAllowedQuality: string
): boolean {
  return getQualityOrder(requestedQuality) <= getQualityOrder(maxAllowedQuality);
}
