// components/pages/HomePage.tsx - Enhanced iOS 26 Glass Morphism Design
"use client";

import MusicRow from "@/components/music/MusicRow";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Play, Clock, Heart, Music, TrendingUp, Shuffle, SkipForward, SkipBack, Repeat, List, X } from "lucide-react";
import { cn, formatNumber, formatDuration } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { TrackWithArtist } from "@/types/track.types";
import { UserSubscription } from "@/utils/subscription.service";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { useRouter } from "next/navigation";
import StreamingMusicPlayer from "@/components/StreamingMusicPlayer";
import { recentPlaysManager } from "@/lib/recent-plays";
import { audioConverter } from "@/lib/audio-converter";

interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface HomePageProps {
  trendingTracks: TrackWithArtist[];
  recentTracks: TrackWithArtist[];
  user: User | null;
  subscription?: UserSubscription | null;
}

export default function HomePage({
  trendingTracks,
  recentTracks,
  user,
  subscription,
}: HomePageProps) {
  const router = useRouter();
  const viewportHeight = useViewportHeight();
  const [activeGenre, setActiveGenre] = useState<"all" | "pop" | "rock" | "hip-hop" | "electronic" | "jazz" | "classical">("all");
  const [displayTracks, setDisplayTracks] = useState<TrackWithArtist[]>(trendingTracks);
  const [currentTrack, setCurrentTrack] = useState<TrackWithArtist | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [recentPlays, setRecentPlays] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    setDisplayTracks(filterTracksByGenre(trendingTracks, activeGenre));
  }, [activeGenre, trendingTracks]);

  const genreCount = {
    pop: trendingTracks.filter((t) => t.genre === "pop").length,
    rock: trendingTracks.filter((t) => t.genre === "rock").length,
    "hip-hop": trendingTracks.filter((t) => t.genre === "hip-hop").length,
    electronic: trendingTracks.filter((t) => t.genre === "electronic").length,
    jazz: trendingTracks.filter((t) => t.genre === "jazz").length,
    classical: trendingTracks.filter((t) => t.genre === "classical").length,
  };

  const genres = [
    { id: "all", label: "All", count: trendingTracks.length },
    { id: "pop", label: "Pop", count: genreCount.pop },
    { id: "rock", label: "Rock", count: genreCount.rock },
    { id: "hip-hop", label: "Hip-Hop", count: genreCount["hip-hop"] },
    { id: "electronic", label: "Electronic", count: genreCount.electronic },
    { id: "jazz", label: "Jazz", count: genreCount.jazz },
    { id: "classical", label: "Classical", count: genreCount.classical },
  ];

  function filterTracksByGenre(tracks: TrackWithArtist[], genre: string) {
    if (genre === "all") return tracks;
    return tracks.filter((track) => track.genre === genre);
  }

  const handleInstantPlay = useCallback((track: TrackWithArtist) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const handleInstantPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.1),transparent_50%)]" />
        <div className="fixed inset-0 backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-gray-50/70" />
        
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 flex items-center justify-center px-3 sm:px-6">
            <div className="w-full max-w-5xl mx-auto">
              <div className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 border border-white/30 shadow-[0_32px_64px_rgba(0,0,0,0.08)] p-6 sm:p-12">
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-100/60 to-fuchsia-100/60 backdrop-blur-xl border border-white/40 w-24 h-6"></div>
                    <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="h-10 sm:h-14 bg-gradient-to-r from-gray-200/60 to-gray-300/60 rounded-2xl mb-3"></div>
                  <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200/40 to-gray-300/40 rounded-xl mb-8 w-1/3"></div>
                  <div className="flex gap-3">
                    <div className="w-28 h-11 bg-gradient-to-r from-violet-200/60 to-fuchsia-200/60 rounded-2xl"></div>
                    <div className="w-11 h-11 bg-gradient-to-r from-gray-200/40 to-gray-300/40 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-3 sm:px-6 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-24 sm:w-32">
                  <div className="aspect-square bg-gradient-to-br from-gray-200/50 to-gray-300/50 rounded-2xl mb-2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredTrack = trendingTracks[0] || null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.12),transparent_50%)]" />
      <div className="fixed inset-0 backdrop-blur-3xl bg-gradient-to-br from-white/85 via-white/65 to-gray-50/75" />
      
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.4)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      {featuredTrack && (
        <div className="relative pt-2 sm:pt-4 lg:pt-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 border border-white/30 shadow-[0_32px_64px_rgba(0,0,0,0.08)]">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: featuredTrack.coverArt?.medium
                    ? `url('${featuredTrack.coverArt.medium}')`
                    : `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-transparent to-fuchsia-500/20" />

              <div className="relative z-10 p-6 sm:p-10 lg:p-16">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-100/60 to-fuchsia-100/60 backdrop-blur-xl border border-white/40">
                    <span className="text-xs font-semibold text-violet-800 uppercase tracking-wider">Now Playing</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-3">
                  {featuredTrack.title}
                </h1>

                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  {featuredTrack.artistDetails?.name || 'Unknown Artist'}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleInstantPlay(featuredTrack)}
                    className="group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/25 cursor-pointer border border-white/20"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
                    <span className="font-semibold text-white text-sm sm:text-base">Play</span>
                  </button>

                  <button 
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={cn(
                      "p-3 sm:p-4 rounded-2xl backdrop-blur-xl border border-white/30 transition-all cursor-pointer",
                      isShuffled ? "bg-gradient-to-r from-violet-100/80 to-fuchsia-100/80" : "bg-white/60 hover:bg-white/80"
                    )}
                  >
                    <Shuffle className={cn("w-4 h-4 sm:w-5 sm:h-5", isShuffled ? "text-violet-600" : "text-gray-600")} />
                  </button>

                  <button
                    onClick={() => setIsQueueOpen(!isQueueOpen)}
                    className="p-3 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 hover:bg-white/80 transition-all cursor-pointer"
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {formatNumber(featuredTrack.plays)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(featuredTrack.duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar mb-4 sm:mb-6">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setActiveGenre(genre.id as any)}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer text-xs sm:text-sm",
                  "backdrop-blur-xl border flex-shrink-0",
                  activeGenre === genre.id
                    ? "bg-gradient-to-r from-violet-500/90 to-fuchsia-500/90 text-white border-white/30 shadow-lg shadow-violet-500/25"
                    : "bg-white/70 hover:bg-white/90 text-gray-700 border-white/30"
                )}
              >
                {genre.label}
              </button>
            ))}
          </div>

          <div className="space-y-6 sm:space-y-8">
            <MusicRow
              tracks={displayTracks.slice(0, 8)}
              title="Recently Played"
              cardSize="small"
              showArtist={false}
              showPlayButton={true}
              onTrackSelect={handleInstantPlay}
              currentPlayingTrack={currentTrack}
              isPlaying={isPlaying}
              onPlay={handleInstantPlay}
              onPause={handleInstantPause}
            />

            {displayTracks.filter(track => track.trending).length > 0 && (
              <MusicRow
                tracks={displayTracks.filter(track => track.trending).slice(0, 8)}
                title="Trending Now"
                cardSize="small"
                showArtist={true}
                showPlayButton={true}
                onTrackSelect={handleInstantPlay}
                currentPlayingTrack={currentTrack}
                isPlaying={isPlaying}
                onPlay={handleInstantPlay}
                onPause={handleInstantPause}
              />
            )}

            {displayTracks.length > 4 && (
              <MusicRow
                tracks={displayTracks.slice(4, 12)}
                title="Discover More"
                cardSize="small"
                showArtist={true}
                showPlayButton={true}
                onTrackSelect={handleInstantPlay}
                currentPlayingTrack={currentTrack}
                isPlaying={isPlaying}
                onPlay={handleInstantPlay}
                onPause={handleInstantPause}
              />
            )}
          </div>
        </div>
      </div>

      {isQueueOpen && (
        <div className="fixed right-0 top-0 h-full w-72 sm:w-80 z-50 animate-in slide-in-from-right-full duration-300">
          <div className="h-full backdrop-blur-3xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 border-l border-white/30 shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Queue</h2>
                <button
                  onClick={() => setIsQueueOpen(false)}
                  className="p-2 rounded-xl hover:bg-black/5 transition-colors"
                  aria-label="Close queue"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {trendingTracks.slice(0, 15).map((track, idx) => (
                  <div
                    key={track._id}
                    className={cn(
                      "p-3 rounded-xl transition-all cursor-pointer backdrop-blur-xl border",
                      currentTrack?._id === track._id 
                        ? "bg-gradient-to-r from-violet-100/60 to-fuchsia-100/60 border-violet-200/50"
                        : "hover:bg-white/60 border-transparent"
                    )}
                    onClick={() => handleInstantPlay(track)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-6 font-medium">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{track.title}</p>
                        <p className="text-xs text-gray-600 truncate">{track.artistDetails?.name}</p>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{formatDuration(track.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTrack && (
        <StreamingMusicPlayer
          currentTrack={{
            id: (currentTrack as any)._id || (currentTrack as any).id || currentTrack._id || '',
            title: currentTrack.title,
            artistDetails: currentTrack.artistDetails,
            coverArt: currentTrack.coverArt,
            audioUrl: currentTrack.audioUrl,
            duration: currentTrack.duration,
            albumId: currentTrack.albumId
          }}
          playlist={trendingTracks.map(track => ({
            id: (track as any)._id || (track as any).id || track._id || '',
            title: track.title,
            artistDetails: track.artistDetails,
            coverArt: track.coverArt,
            audioUrl: track.audioUrl,
            duration: track.duration,
            albumId: track.albumId
          }))}
          onTrackChange={(track) => {
            const originalTrack = trendingTracks.find(t => 
              ((t as any)._id || (t as any).id || t._id) === track.id
            );
            if (originalTrack) {
              setCurrentTrack(originalTrack);
            }
          }}
        />
      )}
    </div>
  );
}

const globalStyles = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  @supports (-webkit-backdrop-filter: blur(20px)) or (backdrop-filter: blur(20px)) {
    .backdrop-blur-3xl {
      backdrop-filter: blur(40px) saturate(180%);
      -webkit-backdrop-filter: blur(40px) saturate(180%);
    }
  }
`;

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = globalStyles;
  if (!document.head.querySelector('style[data-component="homepage"]')) {
    style.setAttribute('data-component', 'homepage');
    document.head.appendChild(style);
  }
}
