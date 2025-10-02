// app/library/page.tsx - iOS 26 Glass Morphism Library Page
"use client";

import { useState, useEffect } from "react";
import { Play, Heart, Clock, Download, Plus, Music, ListMusic, User, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const libraryTabs = [
  { id: "playlists", label: "Playlists", icon: ListMusic },
  { id: "liked", label: "Liked Songs", icon: Heart },
  { id: "artists", label: "Artists", icon: User },
  { id: "albums", label: "Albums", icon: Music },
  { id: "podcasts", label: "Podcasts", icon: Radio },
  { id: "downloads", label: "Downloads", icon: Download },
];

const mockPlaylists = [
  { id: 1, name: "My Favorites", tracks: 42, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400", isPrivate: false },
  { id: 2, name: "Workout Mix", tracks: 28, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400", isPrivate: false },
  { id: 3, name: "Chill Evening", tracks: 35, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400", isPrivate: true },
  { id: 4, name: "Road Trip", tracks: 50, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400", isPrivate: false },
];

const mockLikedSongs = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100" },
  { id: 2, title: "Levitating", artist: "Dua Lipa", duration: "3:23", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100" },
  { id: 3, title: "Stay", artist: "Justin Bieber", duration: "2:21", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100" },
  { id: 4, title: "Good 4 U", artist: "Olivia Rodrigo", duration: "2:58", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=100&h=100" },
];

export default function LibraryPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("playlists");

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
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Your Library
            </h1>
            <p className="text-lg text-gray-600">
              All your music in one place
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
            {libraryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all",
                    "backdrop-blur-xl border",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-white/30 shadow-lg"
                      : "bg-white/60 hover:bg-white/80 text-gray-700 border-white/20"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content based on active tab */}
          {activeTab === "playlists" && (
            <div>
              {/* Create Playlist Button */}
              <button className="w-full sm:w-auto mb-8 flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
                Create New Playlist
              </button>

              {/* Playlists Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {mockPlaylists.map((playlist) => (
                  <div key={playlist.id} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 backdrop-blur-xl bg-white/40 border border-white/20 shadow-lg group-hover:shadow-xl transition-all">
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="p-4 rounded-full bg-white/90 backdrop-blur-xl shadow-lg">
                          <Play className="w-6 h-6 text-black fill-current" />
                        </div>
                      </button>
                      {playlist.isPrivate && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur text-white text-xs">
                          Private
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{playlist.name}</h3>
                    <p className="text-sm text-gray-600">{playlist.tracks} tracks</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "liked" && (
            <div>
              {/* Liked Songs Header */}
              <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 shadow-lg mb-8">
                <div className="p-8 sm:p-12 flex items-center gap-8">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                    <Heart className="w-16 h-16 text-white fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">PLAYLIST</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Liked Songs</h2>
                    <p className="text-gray-600 mb-4">{mockLikedSongs.length} songs</p>
                    <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all">
                      <Play className="w-5 h-5 fill-current" />
                      Play All
                    </button>
                  </div>
                </div>
              </div>

              {/* Songs List */}
              <div className="space-y-2">
                {mockLikedSongs.map((song, index) => (
                  <div
                    key={song.id}
                    className="group flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/40 hover:bg-white/60 border border-white/20 transition-all cursor-pointer"
                  >
                    <span className="text-sm text-gray-500 w-8">{index + 1}</span>
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{song.title}</h4>
                      <p className="text-sm text-gray-600">{song.artist}</p>
                    </div>
                    <span className="text-sm text-gray-500">{song.duration}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/50 transition-all">
                      <Heart className="w-5 h-5 text-purple-500 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "downloads" && (
            <div className="text-center py-20">
              <Download className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Downloads Yet</h3>
              <p className="text-gray-600 mb-8">Download songs to listen offline</p>
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all">
                Browse Music
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
