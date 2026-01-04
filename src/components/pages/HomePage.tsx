// components/pages/HomePage.tsx - Enhanced iOS 26 Glass Morphism Design with Extreme Algorithms
"use client";

import MusicRow from '@/components/music/MusicRow';
import { useState, useEffect, useCallback } from "react";
import { Play, Clock, Heart, Shuffle, Repeat, List, X } from "lucide-react";
import { cn, formatNumber, formatDuration } from "@/lib/utils";
import { TrackWithArtist } from '@/types/track.types';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useRouter } from "next/navigation";
import StreamingMusicPlayer from "@/components/StreamingMusicPlayer";
import { useTheme } from '@/components/providers/ThemeProvider';
 

interface HomePageProps {
  trendingTracks: TrackWithArtist[];
  recentTracks: TrackWithArtist[];
}

export default function HomePage({
  trendingTracks,
  recentTracks,
}: HomePageProps) {
  const router = useRouter();
  const viewportHeight = useViewportHeight();
  const { isDark } = useTheme();

  // Core state management
  const [mounted, setMounted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackWithArtist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState("all");
  const [displayTracks, setDisplayTracks] = useState<TrackWithArtist[]>(trendingTracks);

  // Initialize component
  useEffect(() => {
    setMounted(true);
    setDisplayTracks(filterTracksByGenre(trendingTracks, activeGenre));
  }, [activeGenre, trendingTracks]);

  // Filter tracks by genre
  function filterTracksByGenre(tracks: TrackWithArtist[], genre: string) {
    if (genre === "all") return tracks;
    return tracks.filter((track) => track.genre === genre);
  }

  // Handle instant play
  const handleInstantPlay = useCallback((track: TrackWithArtist) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const handleInstantPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Featured track for hero section
  const featuredTrack = trendingTracks[0] || null;

  // Genre filtering setup
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

  if (!mounted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.08),transparent_50%)]" />
        <div className="fixed inset-0 backdrop-blur-3xl bg-gradient-to-br from-white/75 via-white/55 to-gray-50/65" />

        <div className="flex flex-col min-h-screen">
          <div className="flex-1 flex items-center justify-center px-3 sm:px-6">
            <div className="w-full max-w-5xl mx-auto">
              <div className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/85 via-white/65 to-white/45 border border-white/25 shadow-[0_32px_64px_rgba(0,0,0,0.06)] p-6 sm:p-12">
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-100/50 to-fuchsia-100/50 backdrop-blur-xl border border-white/30 w-24 h-6"></div>
                    <div className="h-2 w-2 rounded-full bg-emerald-400/60"></div>
                  </div>
                  <div className="h-10 sm:h-14 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-2xl mb-3"></div>
                  <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200/35 to-gray-300/35 rounded-xl mb-8 w-1/3"></div>
                  <div className="flex gap-3">
                    <div className="w-28 h-11 bg-gradient-to-r from-violet-200/50 to-fuchsia-200/50 rounded-2xl"></div>
                    <div className="w-11 h-11 bg-gradient-to-r from-gray-200/35 to-gray-300/35 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-6 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-24 sm:w-32">
                  <div className="aspect-square bg-gradient-to-br from-gray-200/40 to-gray-300/40 rounded-2xl mb-2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_70%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.18),transparent_70%)] animate-pulse" />
      <div className="fixed inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10" />
      <div className={`fixed inset-0 backdrop-blur-3xl bg-gradient-to-br ${isDark ? 'from-gray-900/90 via-gray-800/80 to-gray-700/90' : 'from-white/90 via-white/70 to-gray-50/80'}`} />

      <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(139,92,246,0.3)_1px,transparent_0)] bg-[length:48px_48px] animate-pulse opacity-[0.02]" />
      </div>

      {featuredTrack && (
        <div className="relative pt-2 sm:pt-4 lg:pt-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className={`relative overflow-hidden rounded-3xl backdrop-blur-3xl border ring-1 ${isDark ? 'bg-gradient-to-br from-gray-900/95 via-gray-800/80 to-gray-700/60 border-gray-700/30 ring-gray-700/20' : 'bg-gradient-to-br from-white/95 via-white/80 to-white/60 border-white/30 ring-white/20'} shadow-[0_48px_96px_rgba(0,0,0,0.12)]`}>
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
              <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-b ${isDark ? 'from-white/10' : 'from-white/20'} to-transparent rounded-t-3xl`} />
              <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t ${isDark ? 'from-gray-100/10' : 'from-white/15'} to-transparent rounded-b-3xl`} />

              <div className="relative z-10 p-4 sm:p-8 lg:p-12 xl:p-16">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className={`px-4 py-1.5 rounded-full backdrop-blur-2xl border shadow-lg shadow-violet-500/10 ${isDark ? 'bg-gradient-to-r from-violet-900/60 to-fuchsia-900/60 border-gray-600/50' : 'bg-gradient-to-r from-violet-100/70 to-fuchsia-100/70 border-white/50'}`}>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-violet-200' : 'text-violet-800'}`}>Now Playing</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                </div>

                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent mb-2 sm:mb-3 ${isDark ? 'bg-gradient-to-br from-white via-gray-200 to-gray-400' : 'bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600'}`}>
                  {featuredTrack.title}
                </h1>

                <p className={`text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {featuredTrack.artistDetails?.name || 'Unknown Artist'}
                </p>

                <div className="flex flex-wrap gap-3 lg:gap-4">
                  <button
                    onClick={() => handleInstantPlay(featuredTrack)}
                    className="group flex items-center gap-3 px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-violet-500/30 cursor-pointer border border-white/30 ring-1 ring-white/20"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white fill-current group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold text-white text-sm sm:text-base lg:text-lg">Play</span>
                  </button>

                  <button 
                    className="p-3 sm:p-4 lg:p-5 rounded-2xl backdrop-blur-xl border border-white/30 transition-all cursor-pointer ${isDark ? 'bg-gray-800/60 hover:bg-gray-800/80' : 'bg-white/60 hover:bg-white/80'}"
                  >
                    <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                  </button>

                  <button
                    className="p-3 sm:p-4 lg:p-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 hover:bg-white/80 transition-all cursor-pointer"
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                  </button>
                  
                  {/* Desktop-only additional controls */}
                  <div className="hidden lg:flex gap-3">
                    <button
                      className="p-5 rounded-2xl backdrop-blur-xl border border-white/30 transition-all cursor-pointer ${isDark ? 'bg-gray-800/60 hover:bg-gray-800/80' : 'bg-white/60 hover:bg-white/80'}"
                    >
                      <Repeat className="w-6 h-6 text-gray-600" />
                    </button>
                    
                    <button
                      className="p-6 rounded-2xl backdrop-blur-2xl border border-white/40 hover:bg-white/90 transition-all duration-300 cursor-pointer active:scale-95"
                    >
                      <Heart className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/30">
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

      {currentTrack && (
        <StreamingMusicPlayer
          currentTrack={currentTrack}
          playlist={trendingTracks}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
          onTrackChange={(track: any) => {
            const originalTrack = trendingTracks.find(t =>
              (t as any)._id === (track as any)._id || (t as any).customTrackId === (track as any).customTrackId
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
