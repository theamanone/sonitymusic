// components/SharePoster.tsx - Instagram Story Shareable Poster
"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";

interface SharePosterProps {
  track: {
    title: string;
    artist: string;
    coverArt?: string;
    duration: number;
  };
  onGenerate?: (canvas: HTMLCanvasElement) => void;
  className?: string;
}

export default function SharePoster({ track, onGenerate, className }: SharePosterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  const generatePoster = useCallback(async () => {
    if (!canvasRef.current || !posterRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for Instagram Story (9:16 aspect ratio)
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(0.5, '#EC4899');
    gradient.addColorStop(1, '#F59E0B');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add glass effect overlay
    const glassGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = glassGradient;
    ctx.fillRect(0, 0, width, height);

    // Load and draw cover art
    if (track.coverArt) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = track.coverArt!;
        });

        // Draw cover art with rounded corners
        const artSize = 400;
        const artX = (width - artSize) / 2;
        const artY = height / 2 - artSize / 2 - 100;
        
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(artX, artY, artSize, artSize, 40);
        ctx.clip();
        ctx.drawImage(img, artX, artY, artSize, artSize);
        ctx.restore();

        // Add shadow to cover art
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(artX, artY, artSize, artSize, 40);
        ctx.stroke();
        ctx.shadowColor = 'transparent';
      } catch (error) {
        console.error('Failed to load cover art:', error);
      }
    }

    // Draw Sonity logo/branding
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('♪ Sonity', width / 2, 150);

    // Draw track title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    
    // Handle long titles with text wrapping
    const maxWidth = width - 120;
    const words = track.title.split(' ');
    let line = '';
    let y = height / 2 + 200;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 80;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Draw artist name
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '42px system-ui, -apple-system, sans-serif';
    ctx.fillText(track.artist, width / 2, y + 80);

    // Draw duration
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '36px system-ui, -apple-system, sans-serif';
    ctx.fillText(formatDuration(track.duration), width / 2, y + 140);

    // Add decorative elements
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // Top decoration
    ctx.beginPath();
    ctx.moveTo(width / 2 - 100, 200);
    ctx.lineTo(width / 2 + 100, 200);
    ctx.stroke();

    // Bottom decoration
    ctx.beginPath();
    ctx.moveTo(width / 2 - 100, height - 200);
    ctx.lineTo(width / 2 + 100, height - 200);
    ctx.stroke();

    // Add "Now Playing" text at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '32px system-ui, -apple-system, sans-serif';
    ctx.fillText('Now Playing', width / 2, height - 120);

    // Call the onGenerate callback
    onGenerate?.(canvas);
  }, [track, onGenerate]);

  return (
    <div className={cn("relative", className)}>
      {/* Hidden canvas for generation */}
      <canvas
        ref={canvasRef}
        className="hidden"
        width={1080}
        height={1920}
      />
      
      {/* Preview poster */}
      <div
        ref={posterRef}
        className="w-full aspect-[9/16] max-w-sm mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500"
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-white/20 via-white/10 to-white/5" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
          {/* Sonity branding */}
          <div className="absolute top-8 text-white/90 font-bold text-lg">
            ♪ Sonity
          </div>
          
          {/* Cover art */}
          {track.coverArt && (
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl mb-8">
              <img
                src={track.coverArt}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Track info */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white leading-tight">
              {track.title}
            </h2>
            <p className="text-lg text-white/80">
              {track.artist}
            </p>
            <p className="text-sm text-white/60">
              {formatDuration(track.duration)}
            </p>
          </div>
          
          {/* Decorative lines */}
          <div className="absolute top-24 w-24 h-px bg-white/30" />
          <div className="absolute bottom-24 w-24 h-px bg-white/30" />
          
          {/* Now Playing text */}
          <div className="absolute bottom-8 text-white/70 text-sm font-medium">
            Now Playing
          </div>
        </div>
      </div>
      
      {/* Generate button */}
      <button
        onClick={generatePoster}
        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-2xl hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-200 shadow-lg"
      >
        Generate Story Poster
      </button>
    </div>
  );
}
