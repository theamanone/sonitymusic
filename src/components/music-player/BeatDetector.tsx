// components/music-player/BeatDetector.tsx - Advanced Beat Detection
"use client";

import { useEffect, useState, useRef } from "react";

interface BeatInfo {
  bpm: number;
  beatStrength: number;
  isOnBeat: boolean;
  totalBeats: number;
  currentBeat: number;
  timeSignature: '4/4' | '3/4' | '6/8';
  musicalPhrase: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro';
}

interface BeatDetectorProps {
  audioElement?: HTMLAudioElement | null;
  onBeatDetected?: (beatInfo: BeatInfo) => void;
  children?: (beatInfo: BeatInfo) => React.ReactNode;
}

export default function BeatDetector({ 
  audioElement, 
  onBeatDetected, 
  children 
}: BeatDetectorProps) {
  const [beatInfo, setBeatInfo] = useState<BeatInfo>({
    bpm: 120,
    beatStrength: 0,
    isOnBeat: false,
    totalBeats: 0,
    currentBeat: 1,
    timeSignature: '4/4',
    musicalPhrase: 'intro'
  });

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastBeatTime = useRef<number>(0);
  const beatHistory = useRef<number[]>([]);

  useEffect(() => {
    if (!audioElement || !window.AudioContext) return;

    const setupAudioAnalysis = async () => {
      try {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioElement);
        
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        
        startBeatDetection();
      } catch (err) {
        console.log('Audio analysis setup failed:', err);
      }
    };

    setupAudioAnalysis();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioElement]);

  const startBeatDetection = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const detectBeat = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Focus on low frequencies (bass) for beat detection
      const bassFreqs = dataArray.slice(0, 10);
      const bassEnergy = bassFreqs.reduce((sum, val) => sum + val, 0) / bassFreqs.length;
      
      const currentTime = Date.now();
      const timeSinceLastBeat = currentTime - lastBeatTime.current;
      
      // Simple beat detection based on energy spikes
      if (bassEnergy > 180 && timeSinceLastBeat > 300) {
        lastBeatTime.current = currentTime;
        beatHistory.current.push(timeSinceLastBeat);
        
        // Keep only last 8 beats for BPM calculation
        if (beatHistory.current.length > 8) {
          beatHistory.current.shift();
        }
        
        // Calculate BPM
        const avgInterval = beatHistory.current.reduce((a, b) => a + b, 0) / beatHistory.current.length;
        const bpm = Math.round(60000 / avgInterval);
        
        // Determine musical phrase based on audio position
        const currentTimeInTrack = audioElement?.currentTime || 0;
        const duration = audioElement?.duration || 0;
        const progress = currentTimeInTrack / duration;
        
        let phrase: BeatInfo['musicalPhrase'] = 'verse';
        if (progress < 0.1) phrase = 'intro';
        else if (progress > 0.8) phrase = 'outro';
        else if (progress > 0.3 && progress < 0.6) phrase = 'chorus';
        else if (progress > 0.65 && progress < 0.8) phrase = 'bridge';
        
        const newBeatInfo: BeatInfo = {
          bpm: bpm > 60 && bpm < 200 ? bpm : 120,
          beatStrength: bassEnergy / 255,
          isOnBeat: true,
          totalBeats: beatHistory.current.length,
          currentBeat: (beatHistory.current.length % 4) + 1,
          timeSignature: '4/4',
          musicalPhrase: phrase
        };
        
        setBeatInfo(newBeatInfo);
        onBeatDetected?.(newBeatInfo);
        
        // Reset beat flag after short duration
        setTimeout(() => {
          setBeatInfo(prev => ({ ...prev, isOnBeat: false }));
        }, 100);
      }
      
      requestAnimationFrame(detectBeat);
    };
    
    detectBeat();
  };

  return children ? children(beatInfo) : null;
}
