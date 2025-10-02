// app/api/v1/subscription/upgrade/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { SubscriptionService } from "@/utils/subscription.service";
import { Plan, IPlan } from "@/models/plan.model";
import { connectDB } from "@/lib/mongodb";
import { RazorpayService } from "@/utils/razorpay.service";

// Simple rate limiter
const rateLimitMap = new Map();
function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }
  
  const requests = rateLimitMap.get(key).filter((time: number) => time > windowStart);
  
  if (requests.length >= maxRequests) {
    return false;
  }
  
  requests.push(now);
  rateLimitMap.set(key, requests);
  return true;
}
// app/api/v1/subscription/upgrade/route.ts - ENHANCED DEBUG VERSION
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimitKey = `upgrade:${session.user.id}`;
    if (!checkRateLimit(rateLimitKey, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before trying again.' },
        { status: 429 }
      );
    }

    // Parse request
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('✅ Request body parsed:', requestBody);
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { plan, billingCycle = "monthly" } = requestBody;
    console.log('✅ Extracted params:', { plan, billingCycle, userId: session.user.id });
    
    // Validation
    if (!plan || typeof plan !== "string" || plan.trim() === "") {
      console.error('❌ Plan validation failed:', plan);
      return NextResponse.json(
        { error: "Plan name is required and must be a valid string" },
        { status: 400 }
      );
    }

    if (plan === "free") {
      return NextResponse.json(
        { error: "Cannot create order for free plan" },
        { status: 400 }
      );
    }

    // Plan lookup
    const planDoc = await Plan.findOne({
      name: plan.toLowerCase().trim(),
      active: true,
    }).lean() as IPlan | null;

    console.log('✅ Plan lookup result:', { 
      planKey: plan, 
      found: !!planDoc, 
      planName: planDoc?.name,
      displayName: planDoc?.displayName 
    });

    if (!planDoc) {
      const availablePlans = await Plan.find({ active: true }, 'name displayName').lean();
      console.error('❌ Plan not found. Available plans:', availablePlans);
      return NextResponse.json(
        { 
          error: "Plan not found or inactive",
          requestedPlan: plan,
          availablePlans: availablePlans
        },
        { status: 404 }
      );
    }

    // Plan change analysis
    console.log('🔄 Starting plan change analysis...');
    let analysis;
    try {
      analysis = await SubscriptionService.analyzePlanChange(session.user.id, plan);
      console.log('✅ Plan change analysis result:', analysis);
    } catch (analysisError) {
      console.error('❌ Plan change analysis failed:', analysisError);
      return NextResponse.json(
        { 
          error: "Failed to analyze plan change", 
          details: analysisError instanceof Error ? analysisError.message : 'Unknown error' 
        },
        { status: 500 }
      );
    }

    if (analysis.type === "invalid") {
      console.log('⚠️ Invalid plan change:', analysis.message);
      return NextResponse.json({ error: analysis.message }, { status: 400 });
    }

    if (analysis.type === "same") {
      console.log('⚠️ Same plan selected:', analysis.message);
      return NextResponse.json({ error: analysis.message }, { status: 400 });
    }

    // Handle different analysis types
    if (analysis.type === "queued_update") {
      console.log('📅 Handling queued update...');
      const updated = await SubscriptionService.scheduleOrUpdatePlanChange(
        session.user.id, 
        plan, 
        'downgrade'
      );
      
      if (!updated) {
        return NextResponse.json({ error: 'Failed to update scheduled change' }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        scheduled: true,
        updated: true,
        message: analysis.message,
        effectiveDate: analysis.effectiveDate === 'immediate' ? new Date().toISOString() : 
                      analysis.effectiveDate instanceof Date ? analysis.effectiveDate.toISOString() : analysis.effectiveDate,
        conflictResolution: analysis.conflictResolution
      });
    }

    if (analysis.type === "downgrade") {
      console.log('📉 Handling downgrade...');
      const scheduled = await SubscriptionService.scheduleOrUpdatePlanChange(
        session.user.id,
        plan,
        "downgrade"
      );

      if (!scheduled) {
        return NextResponse.json(
          { error: "Failed to schedule downgrade" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        scheduled: true,
        message: analysis.message,
        effectiveDate: analysis.effectiveDate === 'immediate' ? new Date().toISOString() : 
                      analysis.effectiveDate instanceof Date ? analysis.effectiveDate.toISOString() : analysis.effectiveDate,
      });
    }

    // Handle upgrades
    if (analysis.type === "upgrade") {
      console.log('📈 Handling upgrade - creating Razorpay order...');
      
      await SubscriptionService.cancelScheduledChange(session.user.id);

      let orderData;
      try {
        orderData = await RazorpayService.createOrder(session.user.id, plan);
        console.log('✅ Razorpay order created successfully:', { orderId: orderData.orderId });
      } catch (razorpayError) {
        console.error('❌ Razorpay order creation failed:', razorpayError);
        return NextResponse.json(
          { 
            error: "Failed to create payment order",
            details: razorpayError instanceof Error ? razorpayError.message : 'Payment service unavailable'
          },
          { status: 500 }
        );
      }

      if ((orderData as any)?.skip) {
        return NextResponse.json(
          { error: (orderData as any).message || "Order creation skipped" },
          { status: 400 }
        );
      }

      if (!orderData || !orderData.orderId || !orderData.key) {
        return NextResponse.json(
          { error: "Invalid order data received from payment gateway" },
          { status: 500 }
        );
      }

      orderData.prefill = {
        name: session.user.name || "",
        email: (session.user as any).email || "",
      };

      return NextResponse.json({
        success: true,
        data: orderData,
        analysis: {
          type: analysis.type,
          message: analysis.message,
          requiresPayment: analysis.requiresPayment
        },
      });
    }

    console.error('❌ Unexpected analysis type:', analysis.type);
    return NextResponse.json(
      { error: `Unexpected plan change type: ${analysis.type}` },
      { status: 400 }
    );

  } catch (error) {
    console.error("❌ Error creating upgrade order:", error);
    return NextResponse.json(
      { 
        error: "Failed to create upgrade order",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
