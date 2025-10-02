// app/artists/page.tsx - iOS 26 Glass Morphism Artists Page
"use client";

import { useState, useEffect } from "react";
import { User, Play, Heart, UserPlus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const mockArtists = [
  { id: 1, name: "The Weeknd", followers: "92.5M", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400", verified: true },
  { id: 2, name: "Taylor Swift", followers: "89.3M", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400", verified: true },
  { id: 3, name: "Drake", followers: "85.7M", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400", verified: true },
  { id: 4, name: "Billie Eilish", followers: "78.2M", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400", verified: true },
  { id: 5, name: "Ed Sheeran", followers: "76.9M", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400", verified: true },
  { id: 6, name: "Ariana Grande", followers: "74.1M", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400", verified: true },
  { id: 7, name: "Post Malone", followers: "68.4M", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400", verified: true },
  { id: 8, name: "Bruno Mars", followers: "65.8M", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400", verified: true },
];

const categories = ["All", "Following", "Recommended", "New Artists", "Local"];

export default function ArtistsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [followedArtists, setFollowedArtists] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFollow = (artistId: number) => {
    setFollowedArtists(prev => 
      prev.includes(artistId) 
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  };

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
              Artists
            </h1>
            <p className="text-lg text-gray-600">
              Follow your favorite artists and discover new ones
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all",
                  "backdrop-blur-xl border",
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-white/30 shadow-lg"
                    : "bg-white/60 hover:bg-white/80 text-gray-700 border-white/20"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockArtists.map((artist) => (
              <div
                key={artist.id}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/60 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  {/* Artist Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Play Button */}
                    <button className="absolute bottom-4 right-4 p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* Artist Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{artist.name}</h3>
                      {artist.verified && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{artist.followers} followers</p>
                    
                    {/* Follow Button */}
                    <button
                      onClick={() => toggleFollow(artist.id)}
                      className={cn(
                        "w-full py-2 rounded-xl font-medium transition-all",
                        followedArtists.includes(artist.id)
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg"
                      )}
                    >
                      {followedArtists.includes(artist.id) ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Artist Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Artist</h2>
            <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row">
                {/* Artist Image */}
                <div className="lg:w-1/3 aspect-square lg:aspect-auto relative">
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&h=600"
                    alt="Featured Artist"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-900/50" />
                </div>
                
                {/* Artist Details */}
                <div className="flex-1 p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur text-purple-700 text-sm font-medium">
                      Artist of the Month
                    </span>
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">The Weeknd</h3>
                  <p className="text-lg text-gray-600 mb-6">92.5M followers • 5 albums • 127 tracks</p>
                  
                  <p className="text-gray-700 mb-8">
                    Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer known for his sonic versatility and dark lyricism.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all">
                      <Play className="w-5 h-5 fill-current" />
                      Play
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/80 backdrop-blur text-gray-700 font-medium hover:bg-white transition-all">
                      <UserPlus className="w-5 h-5" />
                      Follow
                    </button>
                    <button className="p-3 rounded-xl bg-white/80 backdrop-blur text-gray-700 hover:bg-white transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
