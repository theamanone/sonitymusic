// utils/razorpay.service.ts
import Razorpay from "razorpay";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Plan, IPlan } from "@/models/plan.model";
import { Payment, IPayment } from "@/models/payment.model";
import { Track } from "@/models/track.model";
import { SubscriptionModel } from "@/models/billing-subscription.model";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  company: "Sonity",
  brandColor: "#5B21B6",
  currency: "USD",
  supportedCurrencies: ["USD", "INR"],
};

export class RazorpayService {
  /**
   * Create Razorpay order for subscription (Sonity pattern)
   */
// utils/razorpay.service.ts - ENHANCED createOrder method
static async createOrder(userId: string, planKey: string) {
  try {
    if (planKey === "free") {
      throw new Error("Cannot create order for free plan");
    }

    await connectDB();

    // Auto-fail stale pending payments (cleanup)
    try {
      const timeoutMin = Number(process.env.PAYMENT_PENDING_TIMEOUT_MIN || 30);
      const cutoff = new Date(Date.now() - timeoutMin * 60 * 1000);
      await Payment.updateMany(
        { userId, status: "pending", createdAt: { $lt: cutoff } },
        { $set: { status: "failed" } }
      );
    } catch (e) {
      console.warn("Warning: Failed to auto-fail stale pending payments", e);
    }

    // Fetch plan from DB
    const planDoc = (await Plan.findOne({
      name: planKey,
      active: true,
    }).lean()) as IPlan | null;
    
    if (!planDoc) {
      throw new Error("Selected plan is not available");
    }

    // ✅ FIX: Safe price extraction (object-only lookups)
    const getPlanPrice = (plan: IPlan): { price: number; currency: string } => {
      if (plan.pricing?.regions) {
        const regions: any = plan.pricing.regions as any;
        const usRegion = regions['US'];
        if (usRegion) {
          return { price: usRegion.monthly || 0, currency: usRegion.currency || 'USD' };
        }
        // Try default region
        const defaultRegionKey = plan.pricing.defaultRegion;
        const defaultRegion = regions[defaultRegionKey];
        if (defaultRegion) {
          return { price: defaultRegion.monthly || 0, currency: defaultRegion.currency || 'USD' };
        }
      }
      
      // Legacy fallback
      return { 
        price: (plan as any).price || 0, 
        currency: (plan as any).currency || 'USD' 
      };
    };

    const { price: monthlyPrice, currency } = getPlanPrice(planDoc);

    if (monthlyPrice <= 0) {
      throw new Error("Invalid plan pricing");
    }

    // Amount in minor units
    let amount = Math.round(monthlyPrice * 100);
    
    // Handle currency conversion if needed
    const forceInr = process.env.RZP_FORCE_INR === "true";
    let display_currency: string | undefined = undefined;
    let display_amount: number | undefined = undefined;

    if (forceInr && currency === "USD") {
      const rate = Number(process.env.USD_INR_RATE || 83);
      amount = Math.round(monthlyPrice * rate * 100); // Convert to paise
      display_currency = "USD";
      display_amount = Math.round(monthlyPrice * 100); // cents for display
    }

    // Ensure minimal positive amount
    amount = Math.max(100, amount); // Minimum 1 INR or 1 USD

    // Build receipt ID
    const compactPlan = planKey.slice(0, 3);
    const userSuffix = userId.slice(-6);
    const timePart = Date.now().toString(36);
    const receiptRaw = `v_${compactPlan}_${userSuffix}_${timePart}`;
    const receipt = receiptRaw.slice(0, 40);

    // Build notes
    const notes: Record<string, string> = {
      userId,
      plan: planKey,
      description: `Sonity Music Platform ${planDoc.displayName || planDoc.name} Plan Subscription`,
    };

    const orderOptions = {
      amount,
      currency: forceInr && currency === "USD" ? "INR" : currency,
      receipt,
      notes,
    };

    console.log('Creating Razorpay order:', orderOptions);

    const order = await razorpay.orders.create(orderOptions);

    // Save payment record
    try {
      await Payment.create({
        userId,
        razorpayOrderId: order.id,
        amount,
        currency: forceInr && currency === "USD" ? "INR" : currency,
        status: "pending",
        plan: planKey,
        description: `Music Platform ${planDoc.displayName || planDoc.name} Plan - Subscription`,
      });
    } catch (e: any) {
      if (e && (e.code === 11000 || e?.name === "MongoServerError")) {
        console.warn("Warning: Skipping pending payment insert due to index conflict. Proceeding with order only.");
      } else {
        throw e;
      }
    }

    return {
      orderId: order.id,
      amount,
      currency: forceInr && currency === "USD" ? "INR" : currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: "Music Platform",
      description: `${planDoc.displayName || planDoc.name} Plan`,
      ...(display_currency ? { display_currency } : {}),
      ...(typeof display_amount === "number" ? { display_amount } : {}),
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#6366f1",
      },
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order: " + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

  /**
   * Verify Razorpay payment signature
   */
  static verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    try {
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      return expectedSignature === razorpaySignature;
    } catch (error) {
      console.error("Error verifying payment signature:", error);
      return false;
    }
  }

  /**
   * Handle successful payment (Sonity pattern)
   */
  static async handlePaymentSuccess(
    userId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ) {
    try {
      console.log("Payment verification started:", {
        userId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      });

      // Verify signature
      const isValid = this.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        throw new Error("Invalid payment signature");
      }

      await connectDB();

      // Fetch order metadata to recover plan/amount if needed
      let planFromOrder: any = undefined;
      let amountFromOrder: any = undefined;
      let currencyFromOrder: any = undefined;

      try {
        const fetchedOrder = await razorpay.orders.fetch(razorpayOrderId);
        planFromOrder = fetchedOrder?.notes?.plan;
        amountFromOrder = fetchedOrder?.amount;
        currencyFromOrder = fetchedOrder?.currency;
      } catch (e) {
        console.warn(
          "Warning: Failed to fetch Razorpay order metadata for upsert.",
          e
        );
      }

      // Update or create payment record on success
      const payment = await Payment.findOneAndUpdate(
        { userId, razorpayOrderId },
        {
          $set: {
            razorpayPaymentId,
            razorpaySignature,
            status: "completed",
          },
          $setOnInsert: {
            // fallbacks from order in case pending doc didn't exist
            amount:
              typeof amountFromOrder === "number" ? amountFromOrder : undefined,
            currency: currencyFromOrder || undefined,
            plan: planFromOrder || "pro",
            description: planFromOrder
              ? `Sonity ${planFromOrder} Plan - Music Subscription`
              : "Sonity Subscription",
          },
        },
        { new: true, upsert: true }
      );

      if (!payment) {
        throw new Error("Payment record not found");
      }

      // Update or create subscription record
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const subscription = await SubscriptionModel.findOneAndUpdate(
        { userId },
        {
          $set: {
            plan: payment.plan,
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: nextMonth,
            lastRenewalAt: now,
            nextRenewalAt: nextMonth,
            renewalAttempts: 0,
          },
          $unset: {
            queuedChange: 1, // Clear any queued changes
          },
        },
        { new: true, upsert: true }
      );

      console.log("Subscription updated successfully:", subscription?.plan);

      return {
        success: true,
        payment,
        plan: payment.plan,
        subscription,
      };
    } catch (error) {
      console.error("Error handling payment success:", error);

      // Mark payment as failed
      await Payment.updateOne(
        { userId, razorpayOrderId },
        { status: "failed" }
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment verification failed",
      };
    }
  }

  /**
   * Get user's current active subscription (Updated to check SubscriptionModel first)
   */
  static async getUserActiveSubscription(userId: string) {
    try {
      await connectDB();

      // First check SubscriptionModel
      const subscription: any = await SubscriptionModel.findOne({
        userId,
      }).lean();

      if (subscription) {
        const now = new Date();
        const isActive =
          subscription.status === "active" &&
          subscription.currentPeriodEnd &&
          now < new Date(subscription.currentPeriodEnd);

        return {
          plan: subscription.plan,
          status: isActive ? "active" : "expired",
          isActive,
          activatedAt: subscription.currentPeriodStart,
          expiresAt: subscription.currentPeriodEnd,
          queuedChange: subscription.queuedChange,
          subscription: subscription,
        };
      }

      // Fallback to Payment records for backward compatibility
      const latestPayment: any = await Payment.findOne({
        userId,
        status: "completed",
      })
        .sort({ createdAt: -1 })
        .lean();

      if (!latestPayment) {
        return { plan: "free", status: "inactive", isActive: false };
      }

      // Check if payment is still within billing period (30 days)
      const paymentAge = Date.now() - latestPayment.createdAt.getTime();
      const monthInMs = 30 * 24 * 60 * 60 * 1000; // 30 days

      const isActive = paymentAge < monthInMs;
      const expiresAt = new Date(latestPayment.createdAt.getTime() + monthInMs);

      return {
        plan: latestPayment.plan,
        status: isActive ? "active" : "expired",
        isActive,
        paymentId: latestPayment.razorpayPaymentId,
        activatedAt: latestPayment.createdAt,
        expiresAt,
        amount: latestPayment.amount,
        currency: latestPayment.currency,
      };
    } catch (error) {
      console.error("Error getting user active subscription:", error);
      return { plan: "free", status: "inactive", isActive: false };
    }
  }

  /**
   * Get payment history for user
   */
  static async getPaymentHistory(userId: string, limit: number = 10) {
    try {
      await connectDB();

      const payments = await Payment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return payments;
    } catch (error) {
      console.error("Error getting payment history:", error);
      return [];
    }
  }

  /**
   * Process refund using local Payment model
   */
  static async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ) {
    try {
      await connectDB();

      const payment = await Payment.findOne({ razorpayPaymentId: paymentId });
      if (!payment) {
        throw new Error("Payment not found");
      }

      const refundAmount = amount || payment.amount;

      const refund = await razorpay.payments.refund(paymentId, {
        amount: refundAmount,
        notes: {
          reason: reason || "User requested refund",
          original_amount: payment.amount.toString(),
        },
      });

      // Update payment status
      await Payment.updateOne(
        { razorpayPaymentId: paymentId },
        {
          $set: {
            status: "refunded",
            refundId: refund.id,
            refundedAt: new Date(),
            refundReason: reason || "User requested refund",
          },
        }
      );

      return refund;
    } catch (error) {
      console.error("Error processing refund:", error);
      throw new Error("Failed to process refund");
    }
  }

  /**
   * Get subscription usage for billing
   */
  static async getSubscriptionUsage(userId: string) {
    try {
      await connectDB();

      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      // Get track upload stats
      const monthlyTracks = await Track.countDocuments({
        uploaderId: userId,
        createdAt: { $gte: currentMonth },
      });

      const totalTracks = await Track.countDocuments({
        uploaderId: userId,
      });

      // Get storage usage
      const storageAggregation = await Track.aggregate([
        { $match: { uploaderId: userId } },
        { $group: { _id: null, totalSize: { $sum: "$fileSize" } } },
      ]);

      const totalStorage = storageAggregation[0]?.totalSize || 0;
      const storageGB = totalStorage / (1024 * 1024 * 1024);

      return {
        monthlySongs: monthlyTracks,
        totalSongs: totalTracks,
        storageUsedGB: storageGB,
        storageUsedBytes: totalStorage,
        currentMonth: currentMonth.toISOString(),
      };
    } catch (error) {
      console.error("Error getting subscription usage:", error);
      return {
        monthlySongs: 0,
        totalSongs: 0,
        storageUsedGB: 0,
        storageUsedBytes: 0,
        currentMonth: new Date().toISOString(),
      };
    }
  }

  /**
   * Check if user has valid subscription for a specific plan
   */
  static async hasValidSubscription(userId: string, requiredPlan?: string) {
    const subscription = await this.getUserActiveSubscription(userId);

    if (!subscription.isActive) {
      return false;
    }

    if (requiredPlan) {
      return subscription.plan === requiredPlan;
    }

    return subscription.plan !== "free";
  }

  /**
   * Get revenue analytics using local Payment model
   */
  static async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
    try {
      await connectDB();

      const matchQuery: any = { status: "completed" };

      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = startDate;
        if (endDate) matchQuery.createdAt.$lte = endDate;
      }

      const analytics = await Payment.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              plan: "$plan",
              currency: "$currency",
            },
            totalRevenue: { $sum: "$amount" },
            totalTransactions: { $sum: 1 },
            averageAmount: { $avg: "$amount" },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ]);

      return analytics;
    } catch (error) {
      console.error("Error getting revenue analytics:", error);
      return [];
    }
  }
}
