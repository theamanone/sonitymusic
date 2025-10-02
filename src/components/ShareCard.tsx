'use client';
import { useState } from 'react';
import { X, Instagram, Download, Share2, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterImage: string;
  title: string;
}

export default function LiquidGlassModal({ isOpen, onClose, posterImage, title }: GlassModalProps) {
  const [isSharing, setIsSharing] = useState(false);

  const shareToInstagram = async () => {
    setIsSharing(true);
    try {
      // Convert image to blob for Web Share API
      const response = await fetch(posterImage);
      const blob = await response.blob();
      const file = new File([blob], 'story.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        // Use Web Share API for direct Instagram sharing
        await navigator.share({
          files: [file],
          title: title,
          text: `Check out ${title} on our premium music platform!`
        });
      } else {
        // Fallback: Direct Instagram URL scheme
        const instagramUrl = `instagram://story-camera`;
        window.open(instagramUrl, '_blank');
      }
    } catch (error) {
      console.log('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md transform transition-all duration-300 ease-out">
        {/* Liquid Glass Card */}
        <div className="glass-card overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 glass-button p-2"
          >
            <X className="h-5 w-5 text-white/90" />
          </button>

          {/* Premium Header */}
          <div className="glass-header p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="text-white/90 font-medium">Premium Story</span>
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-white/70 text-sm">Share your music experience</p>
          </div>

          {/* Poster Image */}
          <div className="relative aspect-square mx-6 rounded-2xl overflow-hidden glass-image-frame">
            <Image
              src={posterImage}
              alt={title}
              fill
              className="object-cover"
              style={{ width: "auto", height: "auto" }} // Fix aspect ratio warning
            />
            <div className="absolute inset-0 glass-overlay" />
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-3">
            <button
              onClick={shareToInstagram}
              disabled={isSharing}
              className="premium-button w-full"
            >
              <Instagram className="h-5 w-5" />
              {isSharing ? 'Sharing...' : 'Share to Instagram Stories'}
            </button>
            
            <button className="glass-button w-full">
              <Share2 className="h-5 w-5" />
              Share with Friends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
