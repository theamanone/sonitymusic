// components/music-player/MusicVisualizer.tsx - Hidden/Preparing Mode
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MusicVisualizerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioElement?: HTMLAudioElement | null;
  onVisualizerReady?: (data: AnalyserNode) => void;
  hidden?: boolean;
}

export default function MusicVisualizer({
  isPlaying,
  currentTime,
  duration,
  audioElement,
  onVisualizerReady,
  hidden = true // Hidden by default, preparing for future use
}: MusicVisualizerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Disabled for now - causing MediaElementSource conflicts
    // Will be re-enabled when we implement proper visualizer UI
    return;
  }, [audioElement, onVisualizerReady]);

  // Hidden component - preparing audio analysis for future features
  if (hidden) {
    return (
      <div className="sr-only">
        {/* Visualizer is ready and analyzing audio in background */}
        {isReady && analyser && (
          <span>Audio analysis ready - {isPlaying ? 'Active' : 'Standby'}</span>
        )}
      </div>
    );
  }

  // When we want to show visualizer in future
  return (
    <div className={cn("w-full h-20 bg-black/5 rounded-lg flex items-center justify-center")}>
      <div className="text-sm text-gray-500">
        Visualizer Ready
      </div>
    </div>
  );
}
