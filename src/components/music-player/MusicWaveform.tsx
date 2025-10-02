// components/music-player/MusicWaveform.tsx - Reusable Waveform Component
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MusicWaveformProps {
  audioUrl?: string;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  height?: number;
  color?: string;
  className?: string;
  showProgress?: boolean;
  interactive?: boolean;
}

export default function MusicWaveform({
  audioUrl,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  onSeek,
  height = 60,
  color = '#8b5cf6',
  className,
  showProgress = true,
  interactive = true
}: MusicWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;
    generateWaveformData(audioUrl);
  }, [audioUrl]);

  const generateWaveformData = async (url: string) => {
    try {
      setIsLoaded(false);
      
      // Generate mock waveform data (in real app, you'd analyze the audio)
      const mockData = Array.from({ length: 200 }, () => Math.random());
      setWaveformData(mockData);
      setIsLoaded(true);
    } catch (err) {
      console.log('Waveform generation failed:', err);
      // Fallback to random data
      const fallbackData = Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1);
      setWaveformData(fallbackData);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !waveformData.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const progress = duration > 0 ? currentTime / duration : 0;
    
    ctx.clearRect(0, 0, width, height);
    
    const barWidth = width / waveformData.length;
    
    waveformData.forEach((amplitude, index) => {
      const barHeight = amplitude * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      // Determine if this bar is in the played portion
      const barProgress = index / waveformData.length;
      const isPlayed = showProgress && barProgress < progress;
      
      ctx.fillStyle = isPlayed ? color : color + '40';
      ctx.fillRect(x, y, Math.max(barWidth - 1, 1), barHeight);
    });
  }, [waveformData, currentTime, duration, color, showProgress]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !onSeek || !duration) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    const seekTime = progress * duration;
    
    onSeek(Math.max(0, Math.min(duration, seekTime)));
  };

  if (!isLoaded) {
    return (
      <div className={cn("w-full bg-gray-200 rounded animate-pulse", className)} style={{ height }} />
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className={cn(
          "w-full rounded-lg",
          interactive && "cursor-pointer hover:opacity-80 transition-opacity"
        )}
        onClick={handleClick}
        style={{ height }}
      />
    </div>
  );
}
