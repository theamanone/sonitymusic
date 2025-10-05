// utils/subscription.service.ts - Music Streaming Platform Subscription Service
import { connectDB } from '@/lib/mongodb';
import { SubscriptionModel, ISubscription } from '@/models/billing-subscription.model';
import { Plan, IPlan } from '@/models/plan.model';

export type PlanChangeType = 'upgrade' | 'downgrade' | 'same' | 'queued_update' | 'invalid';

export interface PlanChangeInfo {
  type: PlanChangeType;
  currentPlan: IPlan | null;
  targetPlan: IPlan | null;
  priceChange: number;
  effectiveDate: Date | 'immediate';
  requiresPayment: boolean;
  message: string;
  conflictResolution?: 'replace_existing' | 'upgrade_queued';
}

export interface UserSubscription {
  plan: string;
  displayName: string;
  status: string;
  tier: string;
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
    region: string;
  };
  limits: {
    canListenToRegularSongs: boolean;
    canListenToPremiumSongs: boolean;
    canListenToExclusiveReleases: boolean;
    canListenToOfficialMusicVideos: boolean;
    hasEarlyAccess: boolean;
    adsEnabled: boolean;
    highQualityStreaming: boolean;
    losslessStreaming: boolean;
    maxPlaylists: number;
    canFollowArtists: boolean;
    canComment: boolean;
    canShare: boolean;
    canLikeSongs: boolean;
    offlineDownloads: boolean;
    maxOfflineDevices: number;
    listenWithFriends: boolean;
    liveSessions: boolean;
    prioritySupport: boolean;
    earlyAccess: boolean;
    personalizedRecommendations: boolean;
    familyPlan: boolean;
    maxFamilyMembers: number;
    canAccessPremium: boolean;
    canCreatePlaylist: boolean;
  };
  usage: {
    songsUploaded: number;
    storageUsed: number;
    songsPlayed: number;
    totalListenTime: number;
    bandwidthUsed: number;
    streamsThisMonth: number;
  };
  currentPeriodStart: string;
  currentPeriodEnd: string;
  queuedChange: any;
  features: string[];
  benefits: string[];
  engagement: {
    loyaltyPoints: number;
    streakDays: number;
    achievementBadges: string[];
    referralsCount: number;
  };
}

export class SubscriptionService {
  private static nextPeriodEnd(from: Date = new Date(), days: number = 30): Date {
    const d = Number.isFinite(days) && days > 0 ? days : 30;
    return new Date(from.getTime() + d * 24 * 60 * 60 * 1000);
  }

  /**
   * Get free plan default limits
   */
  static getFreePlanLimits(): UserSubscription {
    return {
      plan: 'free',
      displayName: 'Free',
      status: 'active',
      tier: 'free',
      pricing: {
        monthly: 0,
        yearly: 0,
        currency: 'USD',
        region: 'US'
      },
      limits: {
        // Content access
        canListenToRegularSongs: true,
        canListenToPremiumSongs: false,
        canListenToExclusiveReleases: false,
        canListenToOfficialMusicVideos: false,
        hasEarlyAccess: false,
        // Platform features
        adsEnabled: true,
        highQualityStreaming: false,
        losslessStreaming: false,
        maxPlaylists: 10,
        canFollowArtists: true,
        canComment: true,
        canShare: true,
        canLikeSongs: true,
        // Premium features (disabled for free)
        offlineDownloads: false,
        maxOfflineDevices: 0,
        listenWithFriends: false,
        liveSessions: false,
        prioritySupport: false,
        earlyAccess: false,
        personalizedRecommendations: false,
        familyPlan: false,
        maxFamilyMembers: 1,
        // Legacy compatibility
        canAccessPremium: false,
        canCreatePlaylist: true
      },
      usage: {
        songsUploaded: 0,
        storageUsed: 0,
        songsPlayed: 0,
        totalListenTime: 0,
        bandwidthUsed: 0,
        streamsThisMonth: 0
      },
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      queuedChange: null,
      features: [
        'Unlimited music streaming',
        'Standard quality streaming',
        'Create playlists',
        'Like and comment',
        'Smart recommendations'
      ],
      benefits: [
        'No registration required',
        'Instant access',
        'Stream on all devices',
        'Community features'
      ],
      engagement: {
        loyaltyPoints: 0,
        streakDays: 0,
        achievementBadges: [],
        referralsCount: 0
      }
    };
  }

  /**
   * Get user subscription with regional pricing
   */
  static async getUserSubscription(userId: string, region: string = 'US'): Promise<UserSubscription> {
    try {
      await connectDB();

      let subscription = await SubscriptionModel.findOne({ userId });

      if (!subscription) {
        subscription = await SubscriptionModel.create({
          userId,
          plan: 'free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: this.nextPeriodEnd(new Date(), 30)
        });
      }

      const plan = await Plan.findOne({ name: subscription.plan, active: true }).lean() as IPlan | null;

      if (!plan) {
        return this.getFreePlanLimits();
      }

      // Get regional pricing
      const regions: any = plan.pricing?.regions || {} as any;
      const defaultRegion = plan.pricing?.defaultRegion || 'US';
      const regionalPricing = regions.get?.(region) ||
                              regions[region] ||
                              regions.get?.(defaultRegion) ||
                              regions[defaultRegion] ||
                              { monthly: 0, yearly: 0, currency: 'USD' };

      return {
        plan: plan.name,
        displayName: plan.displayName,
        status: subscription.status,
        tier: plan.name === 'premium' ? 'premium' : plan.name === 'pro' ? 'pro' : 'free',
        pricing: {
          monthly: regionalPricing.monthly || 0,
          yearly: regionalPricing.yearly || 0,
          currency: regionalPricing.currency || 'USD',
          region: region
        },
        limits: {
          // Content access
          canListenToRegularSongs: true,
          canListenToPremiumSongs: plan.contentAccess?.premiumSongs ?? false,
          canListenToExclusiveReleases: plan.contentAccess?.exclusiveReleases ?? false,
          canListenToOfficialMusicVideos: plan.contentAccess?.officialMusicVideos ?? false,
          hasEarlyAccess: plan.platformFeatures?.earlyAccess ?? false,
          // Platform features
          adsEnabled: plan.platformFeatures?.adsEnabled ?? true,
          highQualityStreaming: plan.platformFeatures?.highQualityStreaming ?? false,
          losslessStreaming: plan.platformFeatures?.losslessStreaming ?? false,
          maxPlaylists: plan.platformFeatures?.maxPlaylists ?? 10,
          canFollowArtists: plan.platformFeatures?.canFollowArtists ?? true,
          canComment: plan.platformFeatures?.canComment ?? true,
          canShare: plan.platformFeatures?.canShare ?? true,
          canLikeSongs: plan.platformFeatures?.canLikeSongs ?? true,
          // Premium features
          offlineDownloads: plan.platformFeatures?.offlineDownloads ?? false,
          maxOfflineDevices: plan.platformFeatures?.maxOfflineDevices ?? 0,
          listenWithFriends: plan.platformFeatures?.listenWithFriends ?? false,
          liveSessions: plan.platformFeatures?.liveSessions ?? false,
          prioritySupport: plan.platformFeatures?.prioritySupport ?? false,
          earlyAccess: plan.platformFeatures?.earlyAccess ?? false,
          personalizedRecommendations: plan.platformFeatures?.personalizedRecommendations ?? false,
          familyPlan: plan.platformFeatures?.familyPlan ?? false,
          maxFamilyMembers: plan.platformFeatures?.maxFamilyMembers ?? 1,
          // Legacy compatibility
          canAccessPremium: plan.contentAccess?.premiumSongs ?? false,
          canCreatePlaylist: plan.platformFeatures?.canCreatePlaylists ?? true
        },
        usage: {
          songsUploaded: 0,
          storageUsed: 0,
          songsPlayed: 0,
          totalListenTime: 0,
          bandwidthUsed: 0,
          streamsThisMonth: 0
        },
        currentPeriodStart: subscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        queuedChange: subscription.queuedChange || null,
        features: plan.features || [],
        benefits: plan.benefits || [],
        engagement: subscription.engagement || {
          loyaltyPoints: 0,
          streakDays: 0,
          achievementBadges: [],
          referralsCount: 0
        }
      };

    } catch (error) {
      console.error('Error getting user subscription:', error);
      return this.getFreePlanLimits();
    }
  }

  /**
   * Cancel scheduled plan change
   */
  static async cancelScheduledChange(userId: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await SubscriptionModel.updateOne(
        { userId },
        {
          $unset: { queuedChange: 1 },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error cancelling scheduled change:", error);
      return false;
    }
  }

  /**
   * Schedule or update plan change
   */
  static async scheduleOrUpdatePlanChange(
    userId: string,
    targetPlan: string,
    changeType: 'upgrade' | 'downgrade'
  ): Promise<boolean> {
    try {
      await connectDB();

      const updateData: any = {
        $set: {
          'queuedChange.planKey': targetPlan,
          'queuedChange.changeType': changeType,
          'queuedChange.effectiveAt': new Date(),
          'queuedChange.requestedAt': new Date(),
          updatedAt: new Date()
        }
      };

      const result = await SubscriptionModel.updateOne(
        { userId },
        updateData,
        { upsert: true }
      );

      return result.acknowledged;
    } catch (error) {
      console.error("Error scheduling plan change:", error);
      return false;
    }
  }

  /**
   * Analyze plan change for upgrade/downgrade logic
   */
  static async analyzePlanChange(userId: string, targetPlan: string): Promise<PlanChangeInfo> {
    try {
      await connectDB();

      // Get current subscription
      const currentSub = await SubscriptionModel.findOne({ userId });
      const currentPlanName = currentSub?.plan || 'free';

      // Get plan details
      const currentPlan = await Plan.findOne({ name: currentPlanName, active: true }).lean() as IPlan | null;
      const targetPlanDoc = await Plan.findOne({ name: targetPlan, active: true }).lean() as IPlan | null;

      if (!targetPlanDoc) {
        return {
          type: 'invalid',
          currentPlan,
          targetPlan: null,
          priceChange: 0,
          effectiveDate: 'immediate',
          requiresPayment: false,
          message: 'Target plan not found or inactive'
        };
      }

      if (currentPlanName === targetPlan) {
        return {
          type: 'same',
          currentPlan,
          targetPlan: targetPlanDoc,
          priceChange: 0,
          effectiveDate: 'immediate',
          requiresPayment: false,
          message: 'Target plan is the same as current plan'
        };
      }

      // Determine if it's an upgrade or downgrade
      const isUpgrade = this.isPlanUpgrade(currentPlanName, targetPlan);

      if (isUpgrade) {
        return {
          type: 'upgrade',
          currentPlan,
          targetPlan: targetPlanDoc,
          priceChange: 0, // Will be calculated in API route
          effectiveDate: 'immediate',
          requiresPayment: true,
          message: `Upgrade to ${targetPlanDoc.displayName} plan`
        };
      } else {
        return {
          type: 'downgrade',
          currentPlan,
          targetPlan: targetPlanDoc,
          priceChange: 0, // Will be calculated in API route
          effectiveDate: 'immediate',
          requiresPayment: false,
          message: `Downgrade to ${targetPlanDoc.displayName} plan`
        };
      }

    } catch (error) {
      console.error("Error analyzing plan change:", error);
      return {
        type: 'invalid',
        currentPlan: null,
        targetPlan: null,
        priceChange: 0,
        effectiveDate: 'immediate',
        requiresPayment: false,
        message: 'Error analyzing plan change'
      };
    }
  }

  /**
   * Helper to determine if target plan is an upgrade
   */
  private static isPlanUpgrade(currentPlan: string, targetPlan: string): boolean {
    const planHierarchy = ['free', 'basic', 'pro', 'premium', 'enterprise'];
    const currentIndex = planHierarchy.indexOf(currentPlan);
    const targetIndex = planHierarchy.indexOf(targetPlan);

    return targetIndex > currentIndex;
  }

  /**
   * Upgrade user subscription after successful payment
   */
  static async upgradeSubscription(
    userId: string,
    targetPlan: string,
    paymentId?: string
  ): Promise<UserSubscription> {
    try {
      await connectDB();

      // Get current subscription
      let subscription = await SubscriptionModel.findOne({ userId });

      if (!subscription) {
        // Create new subscription if none exists
        subscription = await SubscriptionModel.create({
          userId,
          plan: targetPlan,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: this.nextPeriodEnd(new Date(), 30)
        });
      } else {
        // Update existing subscription
        subscription.plan = targetPlan;
        subscription.status = 'active';
        subscription.currentPeriodStart = new Date();
        subscription.currentPeriodEnd = this.nextPeriodEnd(new Date(), 30);
        subscription.queuedChange = null; // Clear any queued changes
        await subscription.save();
      }

      // Return updated subscription data
      return await this.getUserSubscription(userId);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      throw error;
    }
  }
}
