// components/music-player/NoLyrics.tsx - No Lyrics Available Component
"use client";

import { motion } from 'framer-motion';
import { Music, FileText } from 'lucide-react';

interface NoLyricsProps {
  trackTitle?: string;
  className?: string;
}

export default function NoLyrics({ trackTitle, className }: NoLyricsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center h-full text-center p-8 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <Music className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <FileText className="w-4 h-4 text-gray-400" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          No Lyrics Available
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
          {trackTitle ? `Lyrics for "${trackTitle}" are not available at the moment.` : 'Lyrics are not available for this track.'}
        </p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
          Enjoy the music! 🎵
        </p>
      </motion.div>
    </motion.div>
  );
}
