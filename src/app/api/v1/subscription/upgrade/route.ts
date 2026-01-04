// app/api/v1/subscription/upgrade/route.ts - Simplified without authentication
import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Use IP address for rate limiting instead of user ID
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `upgrade:${ip}`;
    
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
    console.log('✅ Extracted params:', { plan, billingCycle });
    
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

    // Create Razorpay order for upgrade
    console.log('📈 Handling upgrade - creating Razorpay order...');
    
    let orderData;
    try {
      // Use a mock user ID for non-authenticated users
      const mockUserId = `guest_${ip}_${Date.now()}`;
      orderData = await RazorpayService.createOrder(mockUserId, plan);
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
      name: "Guest User",
      email: "guest@example.com",
    };

    return NextResponse.json({
      success: true,
      data: orderData,
      analysis: {
        type: "upgrade",
        message: "Upgrade initiated successfully",
        requiresPayment: true
      },
    });

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
