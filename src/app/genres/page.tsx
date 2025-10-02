// app/genres/page.tsx - iOS 26 Glass Morphism Genres Page
"use client";

import { useState, useEffect } from "react";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils";

const genres = [
  { id: "pop", name: "Pop", color: "from-pink-400 to-rose-400", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400" },
  { id: "rock", name: "Rock", color: "from-gray-600 to-gray-800", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400" },
  { id: "hip-hop", name: "Hip-Hop", color: "from-purple-600 to-purple-800", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400" },
  { id: "electronic", name: "Electronic", color: "from-blue-400 to-cyan-400", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400" },
  { id: "jazz", name: "Jazz", color: "from-amber-600 to-orange-600", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400" },
  { id: "classical", name: "Classical", color: "from-red-700 to-red-900", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400" },
  { id: "country", name: "Country", color: "from-yellow-600 to-amber-700", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400" },
  { id: "latin", name: "Latin", color: "from-green-500 to-teal-500", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400" },
  { id: "indie", name: "Indie", color: "from-indigo-400 to-purple-400", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400" },
  { id: "metal", name: "Metal", color: "from-gray-900 to-black", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400" },
  { id: "reggae", name: "Reggae", color: "from-green-600 to-yellow-600", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400" },
  { id: "blues", name: "Blues", color: "from-blue-700 to-indigo-800", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400" },
];

export default function GenresPage() {
  const [mounted, setMounted] = useState(false);
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

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
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Browse by Genre
            </h1>
            <p className="text-lg text-gray-600">
              Explore music from every corner of sound
            </p>
          </div>

          {/* Genres Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="group relative aspect-square cursor-pointer"
                onMouseEnter={() => setHoveredGenre(genre.id)}
                onMouseLeave={() => setHoveredGenre(null)}
              >
                <div className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/20 shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-105">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity"
                    style={{
                      backgroundImage: `url('${genre.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-80 group-hover:opacity-90 transition-opacity",
                    genre.color
                  )} />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6">
                    <Music className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white text-center">
                      {genre.name}
                    </h3>
                    
                    {/* Hover Effect */}
                    <div className={cn(
                      "absolute inset-x-6 bottom-6 flex items-center justify-center transition-all duration-300",
                      hoveredGenre === genre.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                      <button className="px-6 py-2 rounded-xl bg-white/90 backdrop-blur text-gray-900 font-medium hover:bg-white transition-colors">
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Popular in Each Genre Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending in Genres</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {genres.slice(0, 6).map((genre) => (
                <div
                  key={genre.id}
                  className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/60 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        genre.color
                      )}>
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{genre.name}</h3>
                        <p className="text-sm text-gray-600">Top tracks this week</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((track) => (
                        <div key={track} className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500 w-4">{track}</span>
                          <div className="flex-1">
                            <p className="text-gray-900 truncate">Track Name {track}</p>
                            <p className="text-gray-600 text-xs">Artist Name</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
