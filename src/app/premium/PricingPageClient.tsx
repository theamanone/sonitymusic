"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  SubscriptionProvider,
  type SubscriptionData,
} from "@/contexts/SubscriptionContext";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import PricingCard from "@/components/PricingCard";

type PlanKey = "free" | "basic" | "premium" | "pro";

// Minimal types to match server data shape
type PricingQueuedChange = {
  targetPlan: string;
  changeType: "upgrade" | "downgrade";
  effectiveAt: string;
} | null;

type PricingUsage = {
  videosUploaded: number;
  storageUsed: number;
  videosWatched?: number;
  totalWatchTime?: number;
};

type PricingPlan = any; // keep flexible; we normalize below

export interface PricingData {
  currentPlan: string;
  status: string;
  usage: PricingUsage;
  plans: PricingPlan[];
  queuedChange: PricingQueuedChange;
}

export interface UIPlan {
  key: string;
  name: string;
  description?: string;
  features: string[];
  priceMonthly: number;
  priceYearly?: number;
  currency: string;
  // Video platform specific limits
  videosPerMonth: number;
  maxVideoLength: number;
  maxStorageGB: number;
  // Feature flags
  canAccessPremium: boolean;
  canUploadHD: boolean;
  canUpload4K: boolean;
  canCreatePlaylist: boolean;
  canComment: boolean;
  canDownload: boolean;
  adsEnabled: boolean;
  // UI properties
  active: boolean;
  sortOrder?: number;
  popular?: boolean;
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
    videosUploaded: data.usage.videosUploaded,
    storageUsed: data.usage.storageUsed,
    canWatchAdFree:
      data.plans.find((p: any) => p.name === data.currentPlan)?.platformFeatures
        ?.adsEnabled === false,
    canUploadHD:
      data.plans.find((p: any) => p.name === data.currentPlan)?.platformFeatures
        ?.maxVideoQuality === "1080p",
    canUpload4K:
      data.plans.find((p: any) => p.name === data.currentPlan)?.platformFeatures
        ?.maxVideoQuality === "4K",
    canAccessPremium:
      data.plans.find((p: any) => p.name === data.currentPlan)?.contentAccess
        ?.premiumMovies || false,
  };

  // ✅ FIXED: Proper data transformation for PricingCard
  const transformedPlans = data.plans.map((plan: any) => ({
    name: plan.name,
    displayName: plan.displayName,
    description: plan.description,
    tagline: plan.tagline,
    tier: plan.tier,
    features: plan.features || [],
    benefits: plan.benefits || [],
    pricing: plan.pricing || { monthly: 0, yearly: 0, currency: "USD" },
    contentAccess: plan.contentAccess || {
      regularVideos: true,
      premiumMovies: false,
      exclusiveSeries: false,
      originalContent: false,
    },
    platformFeatures: plan.platformFeatures || {
      adsEnabled: true,
      maxVideoQuality: "720p",
      maxConcurrentStreams: 1,
      offlineDownloads: false,
      maxOfflineDownloads: 0,
      customThumbnails: false,
      liveStreaming: false,
      monetization: false,
      advancedAnalytics: false,
      prioritySupport: false,
      betaFeatures: false,
    },
    popular: plan.popular || false,
    exclusive: plan.exclusive || false,
    ui: plan.ui || {
      colorTheme: "#6B46C1",
      gradientFrom: "#6B46C1",
      gradientTo: "#8B5CF6",
    },
  }));

  // Adapt data for PricingCard expected types
  const usageForCard = {
    promptsUsed: 0,
    promptsLimit: 0,
    remaining: 0,
    canPrompt: true,
    resetTime: null as Date | null,
    videosUploaded: data.usage.videosUploaded,
    storageUsed: data.usage.storageUsed,
  };

  
  return (
    <>
      <SubscriptionProvider initial={initialSubscription} disableAutoFetch>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <Header />
          <main className="container mx-auto py-6 md:py-12 px-4 pt-20 md:pt-12">
            <PricingCard
              currentPlan={data.currentPlan as PlanKey}
              usage={{
                videosUploaded: data.usage.videosUploaded,
                storageUsed: data.usage.storageUsed,
              }}
              plans={transformedPlans}
              queuedChange={data.queuedChange}
            />
          </main>
          <Footer />
        </div>
      </SubscriptionProvider>
    </>
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
