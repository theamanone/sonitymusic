"use client";
import {
  SubscriptionProvider,
  type SubscriptionData,
} from "@/contexts/SubscriptionContext";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import PremiumFeatures from "@/components/features/PremiumFeatures";

type PlanKey = "free" | "basic" | "premium" | "pro";

// Minimal types to match server data shape
type PricingQueuedChange = {
  targetPlan: string;
  changeType: "upgrade" | "downgrade";
  effectiveAt: string;
} | null;

// Simplified types for premium page
export interface PricingData {
  currentPlan: string;
  currentTier: string;
  status: string;
  region: string;
  usage: {
    songsListened: number;
    storageUsed: number;
    songsPlayed: number;
    totalListenTime: number;
  };
  plans: any[];
  queuedChange: PricingQueuedChange;
}

// 🚀 Updated PricingData interface with queuedChange
interface Props {
  data: PricingData;
}

function PricingPageContent({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");
    const plan = searchParams.get("plan");

    if (payment === "success") {
      toast.success(`Your ${plan} plan is now active!`, {
        duration: 4000,
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("plan");
      router.replace(url.pathname + (url.search ? url.search : ""));
    } else if (payment === "error") {
      toast.error("Payment failed or was cancelled.");
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("plan");
      router.replace(url.pathname + (url.search ? url.search : ""));
    }
  }, [router, searchParams]);

  const initialSubscription: SubscriptionData = {
    plan: data.currentPlan,
    status: data.status || "active",
    songsListened: data.usage.songsListened || 0,
    storageUsed: data.usage.storageUsed || 0,
    canWatchAdFree: data.currentPlan !== "free",
    canListenWithFriends: data.currentPlan === "pro" || data.currentPlan === "premium",
    canJoinLiveSessions: data.currentPlan === "pro" || data.currentPlan === "premium",
    canAccessPremium: data.currentPlan !== "free",
  };
  
  return (
    <SubscriptionProvider initial={initialSubscription} disableAutoFetch>
      <PremiumFeatures />
    </SubscriptionProvider>
  );
}

export default function PricingPageClient({ data }: Props) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    }>
      <PricingPageContent data={data} />
    </Suspense>
  );
}
