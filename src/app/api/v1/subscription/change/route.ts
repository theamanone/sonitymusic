// app/api/subscription/change/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { SubscriptionService } from '@/utils/subscription.service';
import { Plan, IPlan } from '@/models/plan.model';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan || typeof plan !== 'string') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Validate plan exists
    const planDoc = await Plan.findOne({ name: plan, active: true }).lean() as IPlan | null;
    if (!planDoc) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Get current subscription
    const currentSubscription = await SubscriptionService.getUserSubscription(session.user.id);
    
    // Check if it's the same plan
    if (currentSubscription.plan === plan) {
      return NextResponse.json({ error: 'You are already on this plan' }, { status: 400 });
    }

    // Determine regional pricing for comparison (default to US)
    const resolveMonthly = (p: IPlan | null): number => {
      if (!p) return 0;
      const regions: any = p.pricing?.regions || {} as any;
      const defaultRegion = p.pricing?.defaultRegion || 'US';
      const r = regions.get?.(defaultRegion) || regions[defaultRegion];
      return r?.monthly || 0;
    };
    const currentPlanDoc = await Plan.findOne({ name: currentSubscription.plan, active: true }).lean() as IPlan | null;
    const currentPrice = resolveMonthly(currentPlanDoc);
    const newPrice = resolveMonthly(planDoc);

    // Handle based on price comparison
    if (newPrice <= currentPrice) {
      // Downgrade - schedule for next billing period
      const scheduled = await SubscriptionService.scheduleOrUpdatePlanChange(
        session.user.id,
        plan,
        'downgrade'
      );
      
      if (!scheduled) {
        return NextResponse.json({ error: 'Failed to schedule plan change' }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        scheduled: true,
        message: `Plan change to ${planDoc.displayName} scheduled for next billing period`
      });
    } else {
      // Upgrade - requires immediate payment
      return NextResponse.json({ 
        success: true, 
        requiresPayment: true,
        message: 'Upgrade requires payment processing',
        redirectTo: `/premium?upgrade=${plan}`
      });
    }

  } catch (e: any) {
    console.error('subscription/change error', e);
    return NextResponse.json({ 
      error: e?.message || 'Failed to change subscription' 
    }, { status: 500 });
  }
}
