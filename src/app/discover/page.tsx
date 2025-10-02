// app/discover/page.tsx - iOS 26 Glass Morphism Discover Page
"use client";

import { useState, useEffect } from "react";
import { Play, TrendingUp, Clock, Heart, Music, Radio, Mic2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "trending", label: "Trending Now", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
  { id: "new", label: "New Releases", icon: Clock, color: "from-blue-500 to-cyan-500" },
  { id: "top", label: "Top Charts", icon: Heart, color: "from-red-500 to-orange-500" },
  { id: "live", label: "Live Sessions", icon: Radio, color: "from-green-500 to-teal-500" },
  { id: "podcasts", label: "Podcasts", icon: Mic2, color: "from-yellow-500 to-amber-500" },
  { id: "world", label: "World Music", icon: Globe, color: "from-indigo-500 to-purple-500" },
];

const mockPlaylists = [
  { id: 1, title: "Today's Top Hits", tracks: 50, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400" },
  { id: 2, title: "Chill Vibes", tracks: 35, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400" },
  { id: 3, title: "Workout Mix", tracks: 40, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400" },
  { id: 4, title: "Focus Flow", tracks: 25, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400" },
  { id: 5, title: "Party Anthems", tracks: 60, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400" },
  { id: 6, title: "Acoustic Sessions", tracks: 30, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400" },
];

export default function DiscoverPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("trending");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="animate-pulse flex items-center justify-center h-screen">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* iOS 26 Glass Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50/95 via-white/90 to-gray-100/95" />
      <div className="fixed inset-0 backdrop-blur-2xl bg-white/60" />
      
      {/* Glass Pattern Overlay */}
      <div className="fixed inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.12)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Discover
            </h1>
            <p className="text-lg text-gray-600">
              Explore new music, trending tracks, and curated playlists
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "relative p-6 rounded-2xl backdrop-blur-xl border transition-all",
                    "hover:scale-105 hover:shadow-xl",
                    selectedCategory === category.id
                      ? "bg-gradient-to-br from-white/80 to-white/60 border-purple-300 shadow-lg"
                      : "bg-white/40 border-white/20 hover:bg-white/60"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center mb-3 mx-auto",
                    category.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center">
                    {category.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Featured Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Playlists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {mockPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 backdrop-blur-xl bg-white/40 border border-white/20 shadow-lg group-hover:shadow-xl transition-all">
                    <img
                      src={playlist.image}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="p-4 rounded-full bg-white/90 backdrop-blur-xl shadow-lg">
                        <Play className="w-6 h-6 text-black fill-current" />
                      </div>
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{playlist.title}</h3>
                  <p className="text-sm text-gray-600">{playlist.tracks} tracks</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Mix Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Made For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((mix) => (
                <div
                  key={mix}
                  className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Music className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Daily Mix {mix}</h3>
                        <p className="text-sm text-gray-600">Based on your listening</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all">
                      <Play className="w-5 h-5 fill-current" />
                      Play Mix
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
