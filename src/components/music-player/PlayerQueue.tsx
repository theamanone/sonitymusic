// components/music-player/PlayerQueue.tsx - Enhanced with framer-motion animations
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrackWithArtist } from "@/types/track.types";
import { X, Play, Music } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import Image from "next/image";

interface PlayerQueueProps {
  playlist: TrackWithArtist[];
  currentTrack: TrackWithArtist | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackSelect: (track: TrackWithArtist) => void;
}

export default function PlayerQueue({
  playlist,
  currentTrack,
  isOpen,
  onClose,
  onTrackSelect
}: PlayerQueueProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[105] bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Queue Panel with smooth slide animation */}
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="fixed right-0 top-0 h-full w-80 sm:w-96 z-[110]"
          >
            <div className="h-full relative">
              {/* Enhanced iOS glass effect */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20" />
                <div className="absolute inset-0 backdrop-blur-3xl backdrop-saturate-[1.8]" />
                <div className="absolute inset-0 border-l border-white/30" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_50%)]" />
              </div>
              
              <div className="flex flex-col h-full relative z-10">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex items-center justify-between p-4 border-b border-white/30"
                >
                  <h2 className="text-lg font-bold text-gray-900">Playing Queue</h2>
                  <motion.button
                    onClick={handleClose}
                    className="p-2 rounded-xl hover:bg-white/60 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                <div className="flex-1 overflow-y-auto p-3">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="space-y-2"
                  >
                    {playlist.map((track, idx) => {
                      const trackId = (track as any)._id || (track as any).id || `track-${idx}`;
                      const currentId = (currentTrack as any)?._id || (currentTrack as any)?.id;
                      return (
                        <motion.div
                          key={trackId}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * idx, duration: 0.3 }}
                          className={cn(
                            "p-3 rounded-xl transition-all cursor-pointer group backdrop-blur-xl",
                            currentId === trackId
                              ? "bg-gradient-to-r from-violet-100/70 to-fuchsia-100/70 border border-violet-200/50"
                              : "hover:bg-white/70 border border-transparent"
                          )}
                          onClick={() => onTrackSelect(track)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-white/30">
                              {track.coverArt?.default ? (
                                <Image
                                  src={track.coverArt.default}
                                  alt={track.title}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <Music className="w-5 h-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {track.title}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {track.artistDetails?.name}
                              </p>
                            </div>
                            
                            <span className="text-xs text-gray-500 font-medium">
                              {formatDuration(track.duration ?? 0)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
