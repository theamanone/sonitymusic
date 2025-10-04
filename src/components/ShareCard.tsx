// components/ShareCard.tsx - Clean iOS 26 Style Share Card
"use client";

import { useState } from 'react';
import { X, Instagram, Link2, Copy, Play, MessageCircle, Facebook } from 'lucide-react';

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

  const shareToInstagram = async () => {
    setIsGenerating(true);
    try {
      // Generate share URL
      const shareUrl = `${window.location.origin}/track/${track.id}`;
      const shareText = `🎵 ${track.title} by ${track.artist} - Listen on Sonity!`;
      
      // Try to use Web Share API for Instagram
      if (navigator.share) {
        await navigator.share({
          title: track.title,
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback: Copy to clipboard and show instructions
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Link copied! Paste it in your Instagram story.');
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback: Copy to clipboard
      const shareUrl = `${window.location.origin}/track/${track.id}`;
      const shareText = `🎵 ${track.title} by ${track.artist} - Listen on Sonity! ${shareUrl}`;
      await navigator.clipboard.writeText(shareText);
      alert('Link copied! Paste it in your Instagram story.');
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
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose} 
      />
      
      <div 
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 ease-out"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h3 className="text-lg font-semibold text-gray-900">Share Track</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Track Preview - Visual Only */}
        <div className="p-6">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-6">
            {track.coverArt ? (
              <img
                src={track.coverArt}
                alt="Track"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Play className="h-16 w-16 text-white" />
              </div>
            )}
            
            {/* Instagram Story Preview Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* 15s Preview Indicator */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30">
                <span className="text-xs font-semibold text-white">15s</span>
              </div>
            </div>
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            {/* Social Media Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Instagram */}
              <button
                onClick={shareToInstagram}
                disabled={isGenerating}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                <Instagram className="h-6 w-6" />
                <span className="text-xs">Instagram</span>
                {isGenerating && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareToWhatsApp}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white font-medium hover:from-green-600 hover:to-green-700 transition-all"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareToFacebook}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <Facebook className="h-6 w-6" />
                <span className="text-xs">Facebook</span>
              </button>
            </div>

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 font-medium transition-colors"
            >
              {copySuccess ? (
                <>
                  <Copy className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
