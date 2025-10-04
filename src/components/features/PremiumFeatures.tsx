// components/features/PremiumFeatures.tsx - Spotify-like Premium Features
"use client";

import { useState } from 'react';
import { 
  Users, 
  Headphones, 
  Download, 
  Wifi, 
  Music, 
  Radio,
  Heart,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  free: boolean;
  premium: boolean;
  comingSoon?: boolean;
}

const features: PremiumFeature[] = [
  {
    id: 'basic-streaming',
    title: 'Basic Streaming',
    description: 'Stream music with ads, 128kbps quality, 6 skips per hour',
    icon: <Music className="w-6 h-6" />,
    free: true,
    premium: false,
    comingSoon: false
  },
  {
    id: 'playlist-creation',
    title: 'Create Playlists',
    description: 'Create up to 5 playlists with 50 songs each',
    icon: <Heart className="w-6 h-6" />,
    free: true,
    premium: false,
    comingSoon: false
  },
  {
    id: 'listen-together',
    title: 'Listen with Friends',
    description: 'Start a group session and listen to music together in real-time',
    icon: <Users className="w-6 h-6" />,
    free: false,
    premium: true,
    comingSoon: true
  },
  {
    id: 'offline-download',
    title: 'Offline Downloads',
    description: 'Download unlimited tracks to listen without internet',
    icon: <Download className="w-6 h-6" />,
    free: false,
    premium: true,
    comingSoon: true
  },
  {
    id: 'hifi-quality',
    title: 'HiFi Audio Quality',
    description: 'Experience lossless audio quality up to 24-bit/192kHz',
    icon: <Headphones className="w-6 h-6" />,
    free: false,
    premium: true,
    comingSoon: true
  },
  {
    id: 'unlimited-skips',
    title: 'Unlimited Skips',
    description: 'Skip as many tracks as you want without limits',
    icon: <Zap className="w-6 h-6" />,
    free: false,
    premium: true,
    comingSoon: false
  },
  {
    id: 'smart-radio',
    title: 'Smart Radio',
    description: 'AI-powered radio stations based on your taste',
    icon: <Radio className="w-6 h-6" />,
    free: false,
    premium: true,
    comingSoon: true
  },
  {
    id: 'ad-free',
    title: 'Ad-Free Experience',
    description: 'Enjoy uninterrupted music without any advertisements',
    icon: <Sparkles className="w-6 h-6" />,
    free: false,
    premium: true,
    comingSoon: false
  }
];

export default function PremiumFeatures() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 mb-4">
            <Crown className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-semibold text-violet-800">Premium Features</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            Experience Music Like Never Before
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of Sonity with premium features designed for true music lovers
          </p>
        </div>

        {/* Plan Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 p-1">
            <button
              onClick={() => setSelectedPlan('free')}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                selectedPlan === 'free'
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Free Plan
            </button>
            <button
              onClick={() => setSelectedPlan('premium')}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                selectedPlan === 'premium'
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Premium Plan
            </button>
          </div>
        </div>

        {/* Features Grid - iOS 26 Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature) => {
            const isAvailable = selectedPlan === 'premium' ? feature.premium : feature.free;
            
            return (
              <div
                key={feature.id}
                className={cn(
                  "relative rounded-3xl p-6 lg:p-8 transition-all duration-500 group",
                  "backdrop-blur-xl border hover:scale-[1.02]",
                  isAvailable
                    ? "bg-white/95 dark:bg-gray-800/95 border-white/60 dark:border-gray-700/60 shadow-xl hover:shadow-2xl"
                    : "bg-gray-50/70 dark:bg-gray-900/70 border-gray-200/40 dark:border-gray-800/40 opacity-70"
                )}
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}
              >
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-300/30">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )}

                <div className={cn(
                  "w-16 h-16 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110",
                  isAvailable
                    ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                    : "bg-gray-200/60 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500"
                )}>
                  <div className="scale-125">
                    {feature.icon}
                  </div>
                </div>

                <h3 className={cn(
                  "text-xl lg:text-2xl font-bold mb-3 transition-colors",
                  isAvailable ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                )}>
                  {feature.title}
                </h3>

                <p className={cn(
                  "text-sm lg:text-base leading-relaxed",
                  isAvailable ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
                )}>
                  {feature.description}
                </p>

                {!isAvailable && selectedPlan === 'free' && (
                  <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-violet-100/60 to-fuchsia-100/60 dark:from-violet-900/30 dark:to-fuchsia-900/30">
                    <Crown className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Premium only</span>
                  </div>
                )}

                {isAvailable && (
                  <div className="mt-6 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold">Available</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-violet-100/50 to-fuchsia-100/50 backdrop-blur-xl border border-white/50">
            <Sparkles className="w-12 h-12 text-violet-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedPlan === 'free' ? 'Upgrade to Premium' : 'You\'re on Premium!'}
            </h2>
            <p className="text-gray-600 max-w-md">
              {selectedPlan === 'free' 
                ? 'Get unlimited access to all features and enjoy ad-free music streaming'
                : 'Thank you for supporting Sonity. Enjoy all premium features!'}
            </p>
            {selectedPlan === 'free' && (
              <button 
                onClick={() => window.location.href = '/auth/signup?plan=premium&trial=true'}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Start Free Trial
              </button>
            )}
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
