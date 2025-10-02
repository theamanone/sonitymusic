// utils/subscription.service.ts - Music Platform Subscription Service
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
    canWatchRegularVideos: boolean;
    canWatchPremiumMovies: boolean;
    canWatchExclusiveSeries: boolean;
    canWatchOriginalContent: boolean;
    hasEarlyAccess: boolean;
    adsEnabled: boolean;
    maxVideoQuality: string;
    maxConcurrentStreams: number;
    offlineDownloads: boolean;
    maxOfflineDownloads: number;
    canUploadVideos: boolean;
    maxVideoUploadsPerMonth: number;
    maxUploadQuality: string;
    customThumbnails: boolean;
    liveStreaming: boolean;
    monetization: boolean;
    advancedAnalytics: boolean;
    storageQuotaGB: number;
    bandwidthQuotaGB: number;
    prioritySupport: boolean;
    conciergeService: boolean;
    betaFeatures: boolean;
    apiAccess: boolean;
    videosPerMonth: number;
    maxVideoLength: number;
    maxStorageGB: number;
    canAccessPremium: boolean;
    canUploadHD: boolean;
    canUpload4K: boolean;
    canCreatePlaylist: boolean;
    canComment: boolean;
    canDownload: boolean;
  };
  usage: {
    videosUploaded: number;
    storageUsed: number;
    videosWatched: number;
    totalWatchTime: number;
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
        canWatchRegularVideos: true,
        canWatchPremiumMovies: false,
        canWatchExclusiveSeries: false,
        canWatchOriginalContent: false,
        hasEarlyAccess: false,
        // Platform features
        adsEnabled: true,
        maxVideoQuality: '720p',
        maxConcurrentStreams: 1,
        offlineDownloads: false,
        maxOfflineDownloads: 0,
        // Creator features
        canUploadVideos: false,
        maxVideoUploadsPerMonth: 0,
        maxUploadQuality: '720p',
        customThumbnails: false,
        liveStreaming: false,
        monetization: false,
        advancedAnalytics: false,
        // Storage
        storageQuotaGB: 1,
        bandwidthQuotaGB: 10,
        // Premium services
        prioritySupport: false,
        conciergeService: false,
        betaFeatures: false,
        apiAccess: false,
        // Legacy compatibility
        videosPerMonth: 0,
        maxVideoLength: 600,
        maxStorageGB: 1,
        canAccessPremium: false,
        canUploadHD: false,
        canUpload4K: false,
        canCreatePlaylist: true,
        canComment: true,
        canDownload: false
      },
      usage: {
        videosUploaded: 0,
        storageUsed: 0,
        videosWatched: 0,
        totalWatchTime: 0,
        bandwidthUsed: 0,
        streamsThisMonth: 0
      },
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      queuedChange: null,
      features: [
        'Unlimited music streaming',
        'HD quality streaming (720p)',
        'Create playlists',
        'Like and comment',
        'Smart recommendations'
      ],
      benefits: [
        'No credit card required',
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
        tier: plan.tier,
        pricing: {
          monthly: regionalPricing.monthly || 0,
          yearly: regionalPricing.yearly || 0,
          currency: regionalPricing.currency || 'USD',
          region: region
        },
        limits: {
          // Content access
          canWatchRegularVideos: true,
          canWatchPremiumMovies: plan.contentAccess?.premiumMovies ?? false,
          canWatchExclusiveSeries: plan.contentAccess?.exclusiveSeries ?? false,
          canWatchOriginalContent: plan.contentAccess?.originalContent ?? false,
          hasEarlyAccess: plan.contentAccess?.earlyAccess ?? false,
          // Platform features
          adsEnabled: plan.platformFeatures?.adsEnabled ?? true,
          maxVideoQuality: plan.platformFeatures?.maxVideoQuality || '720p',
          maxConcurrentStreams: plan.platformFeatures?.maxConcurrentStreams || 1,
          offlineDownloads: plan.platformFeatures?.offlineDownloads ?? false,
          maxOfflineDownloads: plan.platformFeatures?.maxOfflineDownloads || 0,
          // Creator features (disabled for music platform)
          canUploadVideos: false,
          maxVideoUploadsPerMonth: 0,
          maxUploadQuality: '720p',
          customThumbnails: false,
          liveStreaming: false,
          monetization: false,
          advancedAnalytics: false,
          // Storage
          storageQuotaGB: plan.platformFeatures?.storageQuotaGB ?? 1,
          bandwidthQuotaGB: plan.platformFeatures?.bandwidthQuotaGB ?? 10,
          // Premium services
          prioritySupport: plan.platformFeatures?.prioritySupport ?? false,
          conciergeService: plan.platformFeatures?.conciergeService ?? false,
          betaFeatures: plan.platformFeatures?.betaFeatures ?? false,
          apiAccess: plan.platformFeatures?.apiAccess ?? false,
          // Legacy compatibility
          videosPerMonth: 0,
          maxVideoLength: 600,
          maxStorageGB: 1,
          canAccessPremium: plan.contentAccess?.premiumMovies ?? false,
          canUploadHD: false,
          canUpload4K: false,
          canCreatePlaylist: true,
          canComment: true,
          canDownload: plan.platformFeatures?.offlineDownloads ?? false
        },
        usage: {
          videosUploaded: 0,
          storageUsed: 0,
          videosWatched: 0,
          totalWatchTime: 0,
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
