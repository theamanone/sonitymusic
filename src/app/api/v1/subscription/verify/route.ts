// app/api/v1/subscription/verify/route.ts - ENHANCED FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { RazorpayService } from '@/utils/razorpay.service';
import { SubscriptionService } from '@/utils/subscription.service';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // ✅ FIX: Better request parsing with validation
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature
    } = requestBody;

    console.log('✅ Verification request received:', {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId: session.user.id,
      hasAllParams: !!(razorpay_payment_id && razorpay_order_id && razorpay_signature)
    });

    // ✅ FIX: Enhanced validation with specific error messages
    const missingParams = [];
    if (!razorpay_payment_id) missingParams.push('razorpay_payment_id');
    if (!razorpay_order_id) missingParams.push('razorpay_order_id');
    if (!razorpay_signature) missingParams.push('razorpay_signature');

    if (missingParams.length > 0) {
      console.error('❌ Missing required parameters:', missingParams);
      return NextResponse.json(
        { 
          error: `Missing required parameters: ${missingParams.join(', ')}`,
          received: Object.keys(requestBody),
          required: ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature']
        },
        { status: 400 }
      );
    }

    // ✅ FIX: Validate parameter formats
    if (typeof razorpay_payment_id !== 'string' || !razorpay_payment_id.startsWith('pay_')) {
      return NextResponse.json(
        { error: 'Invalid razorpay_payment_id format' },
        { status: 400 }
      );
    }

    if (typeof razorpay_order_id !== 'string' || !razorpay_order_id.startsWith('order_')) {
      return NextResponse.json(
        { error: 'Invalid razorpay_order_id format' },
        { status: 400 }
      );
    }

    if (typeof razorpay_signature !== 'string' || razorpay_signature.length < 10) {
      return NextResponse.json(
        { error: 'Invalid razorpay_signature format' },
        { status: 400 }
      );
    }

    // Handle payment verification using RazorpayService
    console.log('🔄 Processing payment verification...');
    let result;
    try {
      result = await RazorpayService.handlePaymentSuccess(
        session.user.id,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      );
    } catch (verificationError) {
      console.error('❌ Payment verification failed:', verificationError);
      return NextResponse.json(
        { 
          error: 'Payment verification failed',
          details: verificationError instanceof Error ? verificationError.message : 'Unknown verification error'
        },
        { status: 400 }
      );
    }

    if (!result.success) {
      console.error('❌ Verification result failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    console.log('✅ Payment verification successful:', { plan: result.plan });

    // Upgrade user subscription using SubscriptionService
    let subscription;
    try {
      subscription = await SubscriptionService.upgradeSubscription(
        session.user.id,
        result.plan,
        razorpay_payment_id
      );
    } catch (subscriptionError) {
      console.error('❌ Subscription upgrade failed:', subscriptionError);
      return NextResponse.json(
        { error: 'Failed to upgrade subscription' },
        { status: 500 }
      );
    }

    if (!subscription) {
      return NextResponse.json(
        { error: 'Failed to upgrade subscription' },
        { status: 500 }
      );
    }

    console.log('✅ Subscription upgraded successfully:', { plan: subscription.plan });

    // Optional: Send confirmation email (fire and forget)
    try {
      const payment: any = result.payment;
      const minor = typeof payment?.amount === 'number' ? payment.amount : undefined;
      const currency = payment?.currency || undefined;
      const amountMajor = typeof minor === 'number' ? Math.round(minor) / 100 : undefined;
      const to = (session.user as any).email as string | undefined;
      
      if (to) {
        console.log(`📧 Subscription email queued for ${to}`);
        // await sendSubscriptionPurchasedEmail(to, { ... });
      }
    } catch (emailError) {
      console.warn('⚠️ Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription upgraded successfully',
      data: {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        paymentId: razorpay_payment_id
      }
    });

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
