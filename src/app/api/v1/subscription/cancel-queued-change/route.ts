// app/api/subscription/cancel-queued-change/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { SubscriptionService } from '@/utils/subscription.service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const success = await SubscriptionService.cancelScheduledChange(session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'No scheduled change found or failed to cancel' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Scheduled plan change cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling scheduled change:', error);
    return NextResponse.json(
      { error: 'Failed to cancel scheduled change' },
      { status: 500 }
    );
  }
}
