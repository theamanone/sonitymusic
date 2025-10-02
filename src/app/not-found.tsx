"use client";

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { Play, Home, Search, ArrowLeft, Film, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site.config';

function NotFoundContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Premium Logo */}
        <div className="mb-12">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-purple-600 to-red-600 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-r from-red-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <div className="flex items-center space-x-1">
                <Film className="w-8 h-8 text-white" />
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Premium Error Display */}
        <div className="mb-12">
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-red-400 mb-6 animate-gradient-x">
              404
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-purple-600/20 blur-xl rounded-lg"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Content Not Found
          </h2>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-lg mx-auto">
            The premium content you're looking for has moved to a different dimension. 
            Let's get you back to the main experience.
          </p>
        </div>

        {/* Premium Action Buttons */}
        <div className="space-y-4 mb-12">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center w-full max-w-sm mx-auto bg-gradient-to-r from-red-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-red-500 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-red-500/25 hover:scale-105 transform"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <Home className="w-6 h-6 mr-3" />
            <span className="relative">Explore Premium Content</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="group relative inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 transform"
            >
              <Search className="w-5 h-5 mr-2" />
              <span>Search Library</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group relative inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 transform"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Premium Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <Play className="w-8 h-8 text-red-400 mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">4K Streaming</h3>
            <p className="text-gray-400 text-sm">Ultra-high definition content</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <Film className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">Premium Library</h3>
            <p className="text-gray-400 text-sm">Exclusive content collection</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <Sparkles className="w-8 h-8 text-yellow-400 mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-400 text-sm">Personalized recommendations</p>
          </div>
        </div>

        {/* Premium Contact */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Need assistance? Our premium support team is available 24/7
          </p>
          <a 
            href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`} 
            className="text-red-400 hover:text-red-300 font-medium underline decoration-red-400/50 hover:decoration-red-300 transition-colors duration-200"
          >
            {SITE_CONFIG.CONTACT.EMAIL}
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <NotFoundContent />
    </Suspense>
  );
}
