// components/video/ads/AdPlayer.tsx - TRILLION-DOLLAR VERSION
"use client";

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface AdPlayerProps {
  onAdComplete: () => void;
  skipAfterSeconds?: number;
  adDuration?: number;
}

export default function AdPlayer({ 
  onAdComplete, 
  skipAfterSeconds = 5, 
  adDuration = 30 
}: AdPlayerProps) {
  const [timeLeft, setTimeLeft] = useState(adDuration);
  const [canSkip, setCanSkip] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(skipAfterSeconds);
  const [isInteractive, setIsInteractive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onAdComplete();
          return 0;
        }
        return prev - 1;
      });

      if (skipAfterSeconds > 0) {
        setSkipCountdown(prev => {
          if (prev <= 1) {
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onAdComplete, skipAfterSeconds]);

  // ✅ ULTRA-PREMIUM Ad Content
  const handleSkip = () => {
    if (canSkip) {
      onAdComplete();
    }
  };

  const handleInteraction = () => {
    setIsInteractive(true);
    // Track user engagement
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* ✅ PREMIUM Ad Video Background */}
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 opacity-90">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* ✅ TRILLION-DOLLAR Ad Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white p-8 max-w-4xl">
            <div className="mb-8">
              <div className="text-8xl mb-6 animate-pulse">🎬</div>
              <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent">
                VELIESSA PREMIUM
              </h1>
              <p className="text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Experience the future of streaming with unlimited 8K content, zero ads, and exclusive premieres.
              </p>
            </div>

            {/* ✅ PREMIUM Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: '🎯', title: '8K Ultra HD', desc: 'Crystal clear' },
                { icon: '🚫', title: 'No Ads Ever', desc: 'Pure content' },
                { icon: '📱', title: '6 Devices', desc: 'Watch anywhere' },
                { icon: '🎭', title: 'Exclusives', desc: 'Premium only' },
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="font-bold text-lg">{feature.title}</div>
                  <div className="text-sm text-gray-300">{feature.desc}</div>
                </div>
              ))}
            </div>

            {/* ✅ PREMIUM CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button 
                onClick={handleInteraction}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-red-400"
              >
                Start Free Trial - $0 for 30 Days
              </button>
              <button 
                onClick={handleInteraction}
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-md border border-white/30"
              >
                Learn More
              </button>
            </div>

            {/* ✅ PREMIUM Pricing */}
            <div className="text-lg text-gray-300">
              Only <span className="text-3xl font-bold text-white">$14.99</span>/month after trial
              <div className="text-sm mt-2">Cancel anytime • No contracts • Instant access</div>
            </div>
          </div>
        </div>

        {/* ✅ PREMIUM Ad Controls */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-medium">Premium Ad • {timeLeft}s</span>
          </div>
        </div>

        {/* ✅ ENHANCED Skip Button */}
        {skipAfterSeconds > 0 && (
          <div className="absolute bottom-4 right-4">
            {canSkip ? (
              <button
                onClick={handleSkip}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 font-semibold border border-white/30 flex items-center gap-2"
              >
                <span>Skip Ad</span>
                <XMarkIcon className="w-4 h-4" />
              </button>
            ) : (
              <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Skip in {skipCountdown}s</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ PREMIUM Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-white/20">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${((adDuration - timeLeft) / adDuration) * 100}%` }}
            />
          </div>
        </div>

        {/* ✅ PREMIUM Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
