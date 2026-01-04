// components/PricingCard.tsx - Simplified version without authentication
'use client';

import { useState, useRef, useEffect } from "react";
import {
  CheckIcon,
  SparklesIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CrownIcon,
  RocketIcon,
  Clock,
  Video,
  Database,
  Upload,
  X as XIcon,
} from "lucide-react";
import createSonityRazorpayConfig from "../lib/createSonityRazorpayConfig";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  key: string;
  name: string;
  price: number;
  period: string;
  currency: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
}

interface Props {
  currentPlan?: string;
  usage?: {
    songsPlayed?: number;
    storageUsed?: number;
  };
  plans: Plan[];
  queuedChange?: any;
}

export default function PricingCard({
  currentPlan,
  usage,
  plans,
  queuedChange,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localQueued, setLocalQueued] = useState<any | null>(
    queuedChange || null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalQueued(queuedChange || null);
  }, [queuedChange]);

  const handlePlan = async (planKey: string) => {
    if (planKey === currentPlan || loading || isProcessing) return;
    // Allow anyone to upgrade without authentication

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
        body: JSON.stringify({
          planKey,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create order");
      }

      const orderData = result.data;
      console.log('✅ Received order data:', orderData);
      
      const razorpayOptions = createSonityRazorpayConfig(
        orderData, 
        null as any, // session removed
        planKey || '', // provide default empty string
        currentPlan || '', // provide default empty string
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
      if (!isProcessing) {
        setLoading(null);
        setIsProcessing(false);
      }
    }
  };

  const handleCancelQueuedChange = async () => {
    // Allow anyone to cancel queued changes
    setLocalQueued(null);
    
    try {
      const response = await fetch(
        "/api/v1/subscription/cancel-queued-change",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to cancel queued change");
      }

      toast.success("Queued change cancelled successfully", {
        icon: "✅",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Failed to cancel queued change:", error);
      toast.error("Failed to cancel queued change. Please try again.", {
        duration: 4000,
        icon: "⚠️",
      });
    }
  };

  const getPlanIcon = (planKey: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      basic: <Clock className="w-6 h-6" />,
      pro: <RocketIcon className="w-6 h-6" />,
      premium: <CrownIcon className="w-6 h-6" />,
      enterprise: <Database className="w-6 h-6" />,
    };
    return iconMap[planKey] || <Upload className="w-6 h-6" />;
  };

  const getPlanGradient = (planKey: string) => {
    const gradientMap: Record<string, string> = {
      basic: "from-blue-500 to-cyan-500",
      pro: "from-purple-500 to-pink-500",
      premium: "from-amber-500 to-orange-500",
      enterprise: "from-red-500 to-rose-500",
    };
    return gradientMap[planKey] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Plan
        </h2>
        <p className="text-gray-600">
          Upgrade to unlock premium features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          const isLoading = loading === plan.key;
          const isQueued = localQueued?.planKey === plan.key;

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: plans.indexOf(plan) * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`
                relative bg-white rounded-2xl shadow-lg overflow-hidden
                border-2 transition-all duration-300
                ${isCurrent ? 'border-violet-500' : 'border-gray-200'}
                ${isLoading ? 'opacity-75' : ''}
                ${isQueued ? 'ring-2 ring-violet-400' : ''}
              `}
            >
              {/* Header */}
              <div className={`p-6 bg-gradient-to-r ${plan.gradient}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {plan.icon}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {plan.name}
                      </h3>
                      {plan.popular && (
                        <span className="ml-2 px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                          POPULAR
                        </span>
                      )}
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="text-white">
                  <div className="text-3xl font-bold">
                    ₹{plan.price}
                  </div>
                  <div className="text-sm opacity-90">
                    {plan.period}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <motion.button
                  onClick={() => handlePlan(plan.key)}
                  disabled={true} // Disable all plan purchases
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full py-3 px-6 rounded-xl font-semibold
                    transition-all duration-200
                    bg-gray-300 text-gray-500 cursor-not-allowed
                  `}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Coming Soon</span>
                  </div>
                </motion.button>
              </div>

              {/* Queued Change Indicator */}
              {isQueued && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleCancelQueuedChange}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Cancel queued change"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Usage Stats */}
      {usage && (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600">
                {usage.songsPlayed || 0}
              </div>
              <div className="text-sm text-gray-600">
                Songs Played
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600">
                {Math.round((usage.storageUsed || 0) / 1024 / 1024 * 100)}MB
              </div>
              <div className="text-sm text-gray-600">
                Storage Used
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
