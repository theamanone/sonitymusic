// app/api/v1/subscription/route.ts - ENHANCED
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { SubscriptionService } from '@/utils/subscription.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get region from headers or use default
    const region = request.headers.get('x-user-region') || 'US';
    
    const subscription = await SubscriptionService.getUserSubscription(session.user.id, region);
    
    return NextResponse.json({
      success: true,
      data: {
        // Basic info
        plan: subscription.plan,
        displayName: subscription.displayName,
        tier: subscription.tier,
        status: subscription.status,
        region: subscription.pricing?.region || 'US',
        
        // Pricing
        pricing: subscription.pricing || { monthly: 0, yearly: 0, currency: 'USD', region },
        
        // Usage stats
        usage: subscription.usage,
        
        // Feature access
        features: subscription.limits,
        
        // Subscription details
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        queuedChange: subscription.queuedChange,
        
        // Enhanced data
        engagement: subscription.engagement || {
          loyaltyPoints: 0,
          streakDays: 0,
          achievementBadges: [],
          referralsCount: 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription data' }, { status: 500 });
  }
}
