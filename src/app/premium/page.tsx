// app/premium/page.tsx - ENHANCED ERROR HANDLING
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { SubscriptionService } from '@/utils/subscription.service';
import PricingPageClient from './PricingPageClient';
import { Plan } from '@/models/plan.model';
import { connectDB } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export default async function PremiumPage() {
  const session = await getServerSession(authOptions);
  
  try {
    await connectDB();

    // ✅ FIX: Better error handling for plan fetching
    let plans = [];
    try {
      const plansDocs = await Plan.find({ active: true }).sort({ sortOrder: 1 }).lean();
      
      plans = plansDocs.map((plan: any) => {
        const regionalPricing = plan.pricing?.regions?.get?.('US') || 
                               plan.pricing?.regions?.['US'] || 
                               { monthly: plan.price || 0, yearly: (plan.price || 0) * 10, currency: 'USD' };

        return {
          name: plan.name,
          displayName: plan.displayName || plan.name,
          tagline: plan.tagline || '',
          description: plan.description || '',
          tier: plan.tier || 'free',
          
          pricing: {
            monthly: regionalPricing.monthly || 0,
            yearly: regionalPricing.yearly || 0,
            currency: regionalPricing.currency || 'USD'
          },
          
          contentAccess: plan.contentAccess || {
            regularVideos: true,
            premiumMovies: false,
            exclusiveSeries: false,
            originalContent: false
          },
          
          platformFeatures: plan.platformFeatures || {
            adsEnabled: true,
            maxVideoQuality: '720p',
            maxConcurrentStreams: 1,
            offlineDownloads: false,
            maxOfflineDownloads: 0,
            customThumbnails: false,
            liveStreaming: false,
            monetization: false,
            advancedAnalytics: false,
            prioritySupport: false,
            betaFeatures: false,
            apiAccess: false
          },
          
          features: plan.features || [],
          benefits: plan.benefits || [],
          popular: plan.popular || false,
          exclusive: plan.exclusive || false,
          
          ui: plan.ui || {
            colorTheme: '#6B46C1',
            gradientFrom: '#6B46C1',
            gradientTo: '#8B5CF6'
          }
        };
      });
    } catch (planError) {
      console.error('Error fetching plans:', planError);
      // ✅ FIX: Provide fallback plans
      plans = [
        {
          name: 'free',
          displayName: 'Free',
          tagline: 'Always Free',
          description: 'Perfect for getting started',
          tier: 'free',
          pricing: { monthly: 0, yearly: 0, currency: 'USD' },
          contentAccess: { regularVideos: true, premiumMovies: false, exclusiveSeries: false, originalContent: false },
          platformFeatures: { adsEnabled: true, maxVideoQuality: '720p', maxConcurrentStreams: 1, offlineDownloads: false, maxOfflineDownloads: 0 },
          features: ['Unlimited video uploads', 'HD streaming', 'Basic features'],
          benefits: ['No registration required'],
          popular: false,
          ui: { colorTheme: '#6B7280', gradientFrom: '#6B7280', gradientTo: '#9CA3AF' }
        }
      ];
    }

    // Default data structure
    let pricingData: any = {
      currentPlan: 'free',
      currentTier: 'free',
      status: 'inactive',
      region: 'US',
      usage: { songsListened: 0, storageUsed: 0, songsPlayed: 0, totalListenTime: 0 },
      plans: plans,
      queuedChange: null
    };

    // ✅ FIX: Better user data fetching with error handling
    if (session?.user?.id) {
      try {
        const subscription = await SubscriptionService.getUserSubscription(session.user.id, 'US');
        
        pricingData = {
          currentPlan: subscription.plan,
          currentTier: subscription.tier || 'free',
          status: subscription.status,
          region: 'US',
          usage: {
            songsListened: subscription.usage.songsPlayed || 0,
            storageUsed: subscription.usage.storageUsed || 0,
            songsPlayed: subscription.usage.songsPlayed || 0,
            totalListenTime: subscription.usage.totalListenTime || 0
          },
          plans: plans,
          queuedChange: subscription.queuedChange ? {
            targetPlan: subscription.queuedChange.targetPlan || subscription.queuedChange.planKey,
            changeType: subscription.queuedChange.changeType,
            effectiveAt: subscription.queuedChange.effectiveAt instanceof Date 
              ? subscription.queuedChange.effectiveAt.toISOString()
              : subscription.queuedChange.effectiveAt
          } : null
        };
      } catch (subscriptionError) {
        console.error('Error fetching user subscription:', subscriptionError);
        // Keep default data on subscription error
      }
    }

    return <PricingPageClient data={pricingData} />;

  } catch (error) {
    console.error('Error loading premium page:', error);
    
    // ✅ FIX: Comprehensive fallback
    const fallbackData = {
      currentPlan: 'free',
      currentTier: 'free',
      status: 'error',
      region: 'US',
      usage: { songsListened: 0, storageUsed: 0, songsPlayed: 0, totalListenTime: 0 },
      plans: [
        {
          name: 'free',
          displayName: 'Free',
          tagline: 'Always Free',
          description: 'Get started for free',
          tier: 'free',
          pricing: { monthly: 0, yearly: 0, currency: 'USD' },
          features: ['Unlimited uploads', 'Basic features'],
          popular: false
        }
      ],
      queuedChange: null
    };

    return <PricingPageClient data={fallbackData} />;
  }
}
