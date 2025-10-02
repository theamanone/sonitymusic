// components/PricingCard.tsx - COMPLETE FIXED VERSION
'use client';

import { useState, useRef, useEffect } from "react";
import {
  CheckIcon,
  SparklesIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CrownIcon,
  RocketIcon,
  Clock,
  Video,
  Database,
  Upload,
} from "lucide-react";
import createCinevoRazorpayConfig from "../lib/createCinevoRazorpayConfig";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PlanKey = "free" | "basic" | "premium" | "pro" | "enterprise";

export interface UIPlan {
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  tier: PlanKey;
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
    yearlyDiscount?: number;
  };
  contentAccess: {
    regularVideos: boolean;
    premiumMovies: boolean;
    exclusiveSeries: boolean;
    originalContent: boolean;
  };
  platformFeatures: {
    adsEnabled: boolean;
    maxVideoQuality: string;
    maxConcurrentStreams: number;
    offlineDownloads: boolean;
    maxOfflineDownloads: number;
    customThumbnails: boolean;
    liveStreaming: boolean;
    monetization: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    betaFeatures: boolean;
    apiAccess: boolean;
  };
  features: string[];
  benefits: string[];
  popular?: boolean;
  exclusive?: boolean;
  ui: {
    colorTheme: string;
    gradientFrom: string;
    gradientTo: string;
    badge?: string;
  };
}

export interface QueuedChange {
  targetPlan: string;
  changeType: "upgrade" | "downgrade";
  effectiveAt: string;
}

interface Props {
  currentPlan: PlanKey;
  queuedChange?: QueuedChange | null;
  usage: {
    videosUploaded: number;
    storageUsed: number;
  };
  plans: UIPlan[];
}

export default function PricingCard({
  currentPlan,
  usage,
  plans,
  queuedChange,
}: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localQueued, setLocalQueued] = useState<QueuedChange | null>(
    queuedChange || null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalQueued(queuedChange || null);
  }, [queuedChange]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  const formatPrice = (price: number, currency: string = "USD") =>
    price === 0
      ? "Free"
      : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
          price
        );

  const formatStorage = (gb: number) => (gb === -1 ? "Unlimited" : `${gb} GB`);
  const formatDuration = (sec: number) =>
    sec === -1 ? "Unlimited" : `${Math.floor(sec / 60)}m`;

  // Safe accessors to tolerate different plan shapes
  const getPlanKey = (p: any): string =>
    (p?.key ?? p?.tier ?? p?.name ?? "free").toString().toLowerCase();
  const getPriceMonthly = (p: any): number =>
    (p as any)?.priceMonthly ?? p?.pricing?.monthly ?? 0;
  const getCurrency = (p: any): string => p?.pricing?.currency ?? "USD";
  const getVideosPerMonth = (p: any): number =>
    (p as any)?.videosPerMonth ?? p?.platformFeatures?.maxVideoUploadsPerMonth ?? 0;
  const getMaxStorageGB = (p: any): number =>
    (p as any)?.maxStorageGB ?? p?.platformFeatures?.storageQuotaGB ?? 0;
  const getMaxVideoLengthSec = (p: any): number =>
    (p as any)?.maxVideoLengthSec ?? p?.platformFeatures?.maxVideoLength ?? 0;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        console.error("[Razorpay] Window object not available");
        return resolve(false);
      }

      if (
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        console.debug("[Razorpay] checkout.js already loaded");
        return resolve(true);
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.debug("[Razorpay] checkout.js loaded successfully");
        if (window.Razorpay) {
          console.debug("[Razorpay] Razorpay object available");
          resolve(true);
        } else {
          console.error(
            "[Razorpay] Script loaded but Razorpay object not available"
          );
          resolve(false);
        }
      };
      script.onerror = (error) => {
        console.error("[Razorpay] Failed to load checkout.js", error);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // ✅ FIXED: Enhanced handlePlan method with proper orderData scope
  const handlePlan = async (planKey: string) => {
    if (planKey === currentPlan || loading || isProcessing) return;
    if (!session?.user) return void toast.error("Sign in to upgrade your plan");

    setLoading(planKey);
    setIsProcessing(true);
    
    const loadingToast = toast.loading(
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        <span>Preparing your {planKey} upgrade...</span>
      </div>,
      {
        style: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#fff',
          borderRadius: '16px',
          padding: '16px 24px',
          fontWeight: '600',
        }
      }
    );

    try {
      const res = await fetch("/api/v1/subscription/upgrade", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ plan: planKey, billingCycle: "monthly" }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Upgrade API failed:', res.status, errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      toast.dismiss(loadingToast);

      if (result.scheduled) {
        setLocalQueued({
          targetPlan: planKey,
          changeType: "downgrade",
          effectiveAt: result.effectiveDate,
        });
        return toast.success(
          `✅ Downgrade scheduled for ${new Date(result.effectiveDate).toLocaleDateString()}. You'll keep all current features until then.`
        );
      }

      if (!result.success) {
        throw new Error(result.error || 'Upgrade request failed');
      }

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Payment system unavailable");

      // ✅ FIX: Now orderData is available from result.data
      const orderData = result.data;
      console.log('✅ Received order data:', orderData);
      
      // Find current plan for display name
      const targetPlan = plans.find(p => getPlanKey(p) === planKey);
      const planDisplayName = targetPlan?.displayName || planKey;

      // ✅ FIXED: Modern Razorpay options with orderData in correct scope
      const razorpayOptions = createCinevoRazorpayConfig(
        orderData, 
        session, 
        planKey, 
        currentPlan,
        setIsProcessing,
        setLoading,
        setLocalQueued
      );
      
      const rzp = new (window as any).Razorpay(razorpayOptions as any);
      rzp.open();
      
    } catch (e: any) {
      toast.dismiss(loadingToast);
      console.error('💥 Plan upgrade failed:', e);
      toast.error(e.message || "Upgrade failed. Please try again.", {
        duration: 4000,
        icon: '⚠️'
      });
    } finally {
      if (!isProcessing) { // Only reset if not processing payment
        setLoading(null);
        setIsProcessing(false);
      }
    }
  };

  // Rest of your existing methods (handleCancelQueuedChange, getPlanIcon, etc.)
  const handleCancelQueuedChange = async () => {
    if (!session?.user) {
      const authServerUrl =
        process.env.NEXT_PUBLIC_NEXTAUTH_URL || "http://localhost:3000";
      const callbackUrl = `${window.location.origin}/premium`;
      window.location.href = `${authServerUrl}/auth/signin?callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`;
      return;
    }

    try {
      const response = await fetch(
        "/api/v1/subscription/cancel-queued-change",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        toast.success("Scheduled plan change cancelled");
        setLocalQueued(null);
      } else {
        toast.error("Failed to cancel scheduled change");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const getPlanIcon = (planKey: string) => {
    const iconClass = "h-6 w-6";
    switch (planKey) {
      case "free":
        return <Video className={`${iconClass} text-slate-600`} />;
      case "basic":
        return <StarIcon className={`${iconClass} text-indigo-600`} />;
      case "premium":
        return <CrownIcon className={`${iconClass} text-amber-600`} />;
      case "pro":
        return <SparklesIcon className={`${iconClass} text-slate-500`} />;
      case "enterprise":
        return <SparklesIcon className={`${iconClass} text-slate-500`} />;
      default:
        return <SparklesIcon className={`${iconClass} text-slate-500`} />;
    }
  };

  const getPlanTheme = (
    planKey: string,
    isPopular: boolean,
    isCurrent: boolean
  ) => {
    if (planKey === "premium") {
      return {
        card: `relative bg-white border-2 ${
          isCurrent
            ? "border-amber-400 shadow-amber-400/15"
            : "border-amber-300 hover:border-amber-400"
        } shadow-lg hover:shadow-amber-400/10`,
        badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
        button: isCurrent
          ? "bg-amber-100 text-amber-700 border border-amber-300"
          : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 border-0",
        accent: "text-amber-600",
      };
    }

    if (isPopular) {
      return {
        card: `relative bg-white border-2 ${
          isCurrent
            ? "border-indigo-400 shadow-indigo-400/15"
            : "border-indigo-300 hover:border-indigo-400"
        } shadow-lg hover:shadow-indigo-400/10`,
        badge: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
        button: isCurrent
          ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 border-0",
        accent: "text-indigo-600",
      };
    }

    return {
      card: `relative bg-white border-2 ${
        isCurrent
          ? "border-emerald-400 shadow-emerald-400/15"
          : "border-slate-200 hover:border-slate-300"
      } shadow-md hover:shadow-lg`,
      badge: "bg-emerald-500 text-white",
      button: isCurrent
        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
        : "bg-slate-900 text-white hover:bg-slate-800 border-0",
      accent: "text-slate-700",
    };
  };

  const getButtonConfig = (
    planKey: string,
    isCurrentPlan: boolean,
    isFree: boolean
  ) => {
    if (isFree) {
      return {
        text: "Forever Free",
        icon: <CheckIcon className="h-4 w-4" />,
        disabled: true,
        variant: "free",
      };
    }

    if (isCurrentPlan) {
      return {
        text: "Active Plan",
        icon: <CheckIcon className="h-4 w-4" />,
        disabled: true,
        variant: "current",
      };
    }

    if (localQueued?.targetPlan === planKey && currentPlan !== "free") {
      return {
        text: "Scheduled for Next Period",
        icon: <Clock className="h-4 w-4" />,
        disabled: false,
        variant: "scheduled",
        subtitle: `Effective ${new Date(
          localQueued?.effectiveAt as string
        ).toLocaleDateString()}`,
        onClick: handleCancelQueuedChange,
      };
    }

    if (loading === planKey) {
      return {
        text: "Processing...",
        icon: (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ),
        disabled: true,
        variant: "loading",
      };
    }

    const plan = plans.find((p) => getPlanKey(p) === planKey);
    const currentPlanObj = plans.find((p) => getPlanKey(p) === currentPlan);
    const isUpgrade =
      getPriceMonthly(plan) > getPriceMonthly(currentPlanObj);

    return {
      text: `${isUpgrade ? "Upgrade" : "Switch"} to ${plan?.name || planKey}`,
      icon:
        planKey === "premium" ? (
          <CrownIcon className="h-4 w-4" />
        ) : (
          <RocketIcon className="h-4 w-4" />
        ),
      disabled: false,
      variant: isUpgrade ? "upgrade" : "downgrade",
    };
  };

  const getButtonStyles = (variant: string, theme: any) => {
    const baseClasses =
      "w-full py-3.5 px-5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm";

    switch (variant) {
      case "free":
        return `${baseClasses} bg-slate-100 text-slate-600 cursor-default`;
      case "current":
        return `${baseClasses} ${theme.button} cursor-default`;
      case "loading":
        return `${baseClasses} ${theme.button} cursor-not-allowed opacity-70`;
      case "scheduled":
        return `${baseClasses} bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 cursor-pointer transform hover:scale-105`;
      case "upgrade":
      case "downgrade":
      default:
        return `${baseClasses} ${theme.button} cursor-pointer transform hover:scale-105 hover:shadow-lg active:scale-95`;
    }
  };

  const isValidDate = (d: any) => {
    const dt = new Date(d);
    return !isNaN(dt.getTime());
  };

  const renderQueuedChangeNotice = () => {
    if (!localQueued) return null;
    if (currentPlan === "free") return null;
    if (!localQueued.targetPlan) return null;
    if (!isValidDate(localQueued.effectiveAt)) return null;

    const targetPlan = plans.find((p) => getPlanKey(p) === localQueued.targetPlan);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">
                Plan Change Scheduled
              </h3>
              <p className="text-amber-700 text-sm">
                You'll switch to{" "}
                <strong>{targetPlan?.name || localQueued.targetPlan}</strong>{" "}
                on{" "}
                <strong>
                  {new Date(localQueued.effectiveAt).toLocaleDateString()}
                </strong>
              </p>
            </div>
          </div>
          <button
            onClick={handleCancelQueuedChange}
            className="text-amber-600 hover:text-amber-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
  };

  // Get enhanced plan features for video platform
  const getEnhancedFeatures = (plan: UIPlan) => {
    const baseFeatures = plan.features || [];
    const vpm = getVideosPerMonth(plan as any);
    const maxGB = getMaxStorageGB(plan as any);
    const maxLen = getMaxVideoLengthSec(plan as any);
    const videoFeatures = [
      `${vpm === -1 ? "Unlimited" : vpm} videos per month`,
      `${formatStorage(maxGB)} storage`,
      `Up to ${formatDuration(maxLen)} video length`,
    ];
    return [...videoFeatures, ...baseFeatures.slice(0, 2)];
  };

  const currentPlanObjForUnlimited = plans.find((p) => getPlanKey(p) === currentPlan);
  const isUnlimitedPlan = getVideosPerMonth(currentPlanObjForUnlimited) === -1;

  // ✅ FIXED: Add safety check for plans array
  if (!plans || !Array.isArray(plans) || plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 font-['Inter',_system-ui,_sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-4"
          >
            <Video className="h-3.5 w-3.5" />
            Premium Video Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight tracking-tight"
          >
            Create, Share & Monetize
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Video Content
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto font-medium"
          >
            Join millions of creators on the world's most advanced video
            platform
          </motion.p>
        </div>

        {/* Queued Change Notice */}
        {renderQueuedChangeNotice()}

        {/* Current Plan Indicator */}
        {usage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 px-2"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-full overflow-hidden">
              <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-slate-600 font-medium whitespace-nowrap">
                Currently on
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}{" "}
                Plan
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                <Database className="h-3 w-3" />
                <span>{usage.storageUsed?.toFixed(1) || 0}GB used</span>
              </div>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                <Upload className="h-3 w-3" />
                <span>{usage.videosUploaded || 0} videos</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Horizontal Scrolling Plans */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 flex items-center justify-center"
          >
            <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 flex items-center justify-center"
          >
            <ChevronRightIcon className="h-5 w-5 text-slate-600" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 px-14 pt-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {plans.map((plan, index) => {
              const planKey = getPlanKey(plan);
              const isCurrentPlan = planKey === currentPlan;
              const theme = getPlanTheme(
                planKey,
                !!plan.popular,
                isCurrentPlan
              );
              const isFree = planKey === "free";
              const isUnlimited = getVideosPerMonth(plan) === -1;
              const monthly = getPriceMonthly(plan);
              const currency = getCurrency(plan);
              const buttonConfig = getButtonConfig(
                planKey,
                isCurrentPlan,
                isFree
              );

              return (
                <motion.div
                  key={planKey}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex-shrink-0 w-80 snap-center relative"
                >
                  <div
                    className={`${theme.card} rounded-2xl p-6 h-full transition-all duration-300 hover:scale-[1.02] relative`}
                  >
                    {/* Premium Badge */}
                    {(plan.popular || isCurrentPlan) && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${theme.badge} shadow-md whitespace-nowrap`}
                        >
                          {isCurrentPlan ? (
                            <>
                              <CheckIcon className="h-3.5 w-3.5" />
                              ACTIVE PLAN
                            </>
                          ) : (
                            <>
                              <StarIcon className="h-3.5 w-3.5" />
                              MOST POPULAR
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6 pt-4">
                      <div
                        className={`inline-flex p-3 rounded-xl mb-4 ${
                          planKey === "premium"
                            ? "bg-amber-50"
                            : planKey === "pro"
                            ? "bg-indigo-50"
                            : "bg-slate-50"
                        }`}
                      >
                        {getPlanIcon(planKey)}
                      </div>

                      <h3 className="text-2xl font-bold mb-2 text-slate-900">
                        {plan.displayName}
                      </h3>

                      <p className="text-sm mb-6 text-slate-600 font-medium">
                        {plan.description}
                      </p>

                      {/* Pricing */}
                      <div className="mb-6">
                        <div className="flex items-baseline justify-center gap-1 mb-1">
                          <span
                            className={`text-4xl font-bold ${
                              theme.accent || "text-slate-900"
                            }`}
                          >
                            {formatPrice(monthly, currency)}
                          </span>
                          {monthly > 0 && (
                            <span className="text-lg font-medium text-slate-500">
                              /month
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Billed monthly, cancel anytime
                        </p>
                      </div>

                      {/* Video Metrics */}
                      <div className="p-4 rounded-xl mb-6 bg-slate-50">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Video
                                className={`h-3 w-3 ${
                                  theme.accent || "text-slate-600"
                                }`}
                              />
                              <span className="text-xs font-medium text-slate-900">
                                Videos
                              </span>
                            </div>
                            <p
                              className={`text-lg font-bold ${
                                isUnlimited
                                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                                  : theme.accent || "text-slate-900"
                              }`}
                            >
                              {isUnlimited ? "∞" : getVideosPerMonth(plan)}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Database
                                className={`h-3 w-3 ${
                                  theme.accent || "text-slate-600"
                                }`}
                              />
                              <span className="text-xs font-medium text-slate-900">
                                Storage
                              </span>
                            </div>
                            <p
                              className={`text-lg font-bold ${
                                theme.accent || "text-slate-900"
                              }`}
                            >
                              {formatStorage(getMaxStorageGB(plan))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm mb-3 text-slate-900">
                        Everything included:
                      </h4>
                      <ul className="space-y-2">
                        {getEnhancedFeatures(plan).map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckIcon
                              className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                planKey === "premium"
                                  ? "text-amber-500"
                                  : planKey === "pro"
                                  ? "text-indigo-500"
                                  : "text-emerald-500"
                              }`}
                            />
                            <span className="font-medium text-slate-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <button
                        onClick={
                          buttonConfig.onClick ||
                          (() => handlePlan(planKey))
                        }
                        disabled={buttonConfig.disabled}
                        className={getButtonStyles(buttonConfig.variant, theme)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {buttonConfig.icon}
                          <div className="text-center">
                            <div>{buttonConfig.text}</div>
                            {(buttonConfig as any).subtitle && (
                              <div className="text-xs opacity-80 mt-0.5">
                                {(buttonConfig as any).subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Footer text */}
                      {!isFree && !isCurrentPlan && !localQueued && (
                        <p className="text-xs text-center mt-2 text-slate-500">
                          Secure payment • Instant activation
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
