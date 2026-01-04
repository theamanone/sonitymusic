// components/ShareCard.tsx - Spotify-like Share Card with Story Generation
"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Link2, Copy, Play, MessageCircle, Facebook, Download, Image as ImageIcon } from 'lucide-react';
import SharePoster from './SharePoster';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  duration: number;
  audioUrl?: string;
}

interface ShareCardProps {
  track: Track;
  onClose: () => void;
}

export default function ShareCard({ track, onClose }: ShareCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [generatedCanvas, setGeneratedCanvas] = useState<HTMLCanvasElement | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const copyToClipboard = async () => {
    try {
      const shareUrl = `${window.location.origin}/track/${track.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePosterGenerated = (canvas: HTMLCanvasElement) => {
    setGeneratedCanvas(canvas);
  };

  const shareToInstagram = async () => {
    if (!generatedCanvas) {
      setShowPoster(true);
      return;
    }

    setIsGenerating(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        generatedCanvas.toBlob((blob) => resolve(blob!), 'image/png', 0.9);
      });

      // Try to share the image directly
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'sonity-story.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'sonity-story.png', { type: 'image/png' });
        await navigator.share({
          title: `${track.title} - ${track.artist}`,
          text: `🎵 Now playing on Sonity!`,
          files: [file]
        });
      } else {
        // Fallback: Download the image
        const url = URL.createObjectURL(blob);
        if (downloadLinkRef.current) {
          downloadLinkRef.current.href = url;
          downloadLinkRef.current.download = `${track.title}-story.png`;
          downloadLinkRef.current.click();
        }
        URL.revokeObjectURL(url);
        
        // Also copy text to clipboard
        const shareUrl = `${window.location.origin}/track/${track.id}`;
        const shareText = `🎵 ${track.title} by ${track.artist} - Listen on Sonity! ${shareUrl}`;
        await navigator.clipboard.writeText(shareText);
      }
    } catch (error) {
      console.error('Instagram share failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToWhatsApp = () => {
    const shareText = `🎵 ${track.title} by ${track.artist} - Listen on Sonity!`;
    const shareUrl = `${window.location.origin}/track/${track.id}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToFacebook = () => {
    const shareUrl = `${window.location.origin}/track/${track.id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(15, 15, 15, 0.95)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center justify-between p-4 border-b border-white/30"
          >
            <h3 className="text-lg font-semibold text-white">Share Track</h3>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-white/70" />
            </motion.button>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="p-6"
          >
            {!showPoster ? (
              <>
                {/* Track Info */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden ring-2 ring-white/20">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt="Track"
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">{track.title}</h4>
                  <p className="text-white/70">{track.artist}</p>
                </div>

                {/* Story Generation Button */}
                <motion.button
                  onClick={() => setShowPoster(true)}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 rounded-2xl text-white font-medium transition-all mb-4"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  <ImageIcon className="h-5 w-5" />
                  <span>Create Story Poster</span>
                </motion.button>
              </>
            ) : (
              <>
                {/* Poster Generation */}
                <div className="mb-4">
                  <SharePoster
                    track={track}
                    onGenerate={handlePosterGenerated}
                    className="mb-4"
                  />
                  <motion.button
                    onClick={() => setShowPoster(false)}
                    className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white/70 font-medium transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Share Options
                  </motion.button>
                </div>
              </>
            )}

            {/* Share Options */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="space-y-3"
            >
              {/* Social Media Row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Instagram */}
                <motion.button
                  onClick={shareToInstagram}
                  disabled={isGenerating}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 backdrop-blur-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.2 }}
                >
                  <Instagram className="h-6 w-6" />
                  <span className="text-xs">Instagram</span>
                  {isGenerating && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
                </motion.button>

                {/* WhatsApp */}
                <motion.button
                  onClick={shareToWhatsApp}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white font-medium hover:from-green-600 hover:to-green-700 transition-all backdrop-blur-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.2 }}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-xs">WhatsApp</span>
                </motion.button>

                {/* Facebook */}
                <motion.button
                  onClick={shareToFacebook}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all backdrop-blur-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.2 }}
                >
                  <Facebook className="h-6 w-6" />
                  <span className="text-xs">Facebook</span>
                </motion.button>
              </div>

              {/* Copy Link */}
              <motion.button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-medium transition-colors backdrop-blur-xl border border-white/10"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {copySuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3"
                    >
                      <Copy className="h-5 w-5 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3"
                    >
                      <Link2 className="h-5 w-5" />
                      <span>Copy Link</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Hidden download link for fallback */}
          <a ref={downloadLinkRef} className="hidden" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
