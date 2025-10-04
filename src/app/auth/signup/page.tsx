// app/auth/signup/page.tsx - Premium Trial Signup
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Crown, Sparkles, Check, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('free');
  const [isTrial, setIsTrial] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    const trialParam = searchParams.get('trial');
    
    if (planParam) setPlan(planParam);
    if (trialParam === 'true') setIsTrial(true);
  }, [searchParams]);

  const features = [
    'Unlimited music streaming',
    'HiFi audio quality',
    'Offline downloads',
    'Ad-free experience',
    'Listen with friends',
    'Smart radio stations'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Glass Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            href="/premium"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Premium
          </Link>

          {/* Main Card */}
          <div 
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 shadow-2xl"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)'
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 mb-4">
                <Crown className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-semibold text-violet-800 dark:text-violet-300">
                  {isTrial ? 'Free Trial' : 'Premium Plan'}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isTrial ? 'Start Your Free Trial' : 'Join Sonity Premium'}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300">
                {isTrial 
                  ? 'Experience premium features for 30 days, completely free'
                  : 'Unlock unlimited music streaming and premium features'
                }
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What's included:
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/50 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    Coming Soon!
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    We're putting the finishing touches on our premium experience. 
                    Sign up now to be notified when it's ready and get early access!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg hover:scale-105 active:scale-95">
                {isTrial ? 'Start Free Trial' : 'Get Premium'}
              </button>
              
              <Link 
                href="/"
                className="block w-full text-center py-3 px-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Maybe Later
              </Link>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              {isTrial && ' Cancel anytime during your free trial.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
