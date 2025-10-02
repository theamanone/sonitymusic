import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { SubscriptionService } from './subscription.service';

export async function withSubscriptionCheck(
  handler: (request: Request, context?: any) => Promise<Response>,
  request: Request,
  context?: any
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required for usage tracking' },
        { status: 401 }
      );
    }

    // Lightweight subscription fetch (no rate limiting)
    const subscription = await SubscriptionService.getUserSubscription(session.user.id);
    
    // Add usage info to context
    const enhancedContext = {
      ...context,
      usage: { remaining: undefined },
      userId: session.user.id
    };

    return handler(request, enhancedContext);
    
  } catch (error) {
    console.error('Subscription middleware error:', error);
    // Continue without subscription check in case of service error
    return handler(request, context);
  }
}

export function createSubscriptionProtectedRoute(
  handler: (request: Request, context?: any) => Promise<Response>
) {
  return async (request: Request, context?: any) => {
    return withSubscriptionCheck(handler, request, context);
  };
}
