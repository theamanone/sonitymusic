// lib/audio-converter.ts - Audio Conversion Utilities
"use client";

import { hlsAudioManager } from './hls-audio-manager';
import { recentPlaysManager } from './recent-plays';

interface ConversionOptions {
  format: 'hls' | 'mp3' | 'aac';
  quality: 'low' | 'medium' | 'high';
  segmentDuration?: number; // For HLS
}

class AudioConverter {
  /**
   * Convert MP3 file to HLS for streaming
   */
  async convertToHLS(
    audioFile: File,
    trackId: string,
    options: ConversionOptions = { format: 'hls', quality: 'medium' }
  ): Promise<string> {
    try {
      console.log(`Converting ${audioFile.name} to HLS format...`);
      
      // Use HLS Audio Manager to convert
      const playlist = await hlsAudioManager.convertToHLS(audioFile, trackId);
      
      // Save conversion info to recent plays
      await recentPlaysManager.addRecentPlay({
        trackId,
        title: audioFile.name.replace('.mp3', ''),
        artistName: 'Local Artist',
        duration: playlist.totalDuration,
        source: 'local'
      });

      console.log(`Successfully converted to HLS: ${playlist.segments.length} segments`);
      return `/api/hls/playlist.m3u8`;
      
    } catch (error) {
      console.error('Failed to convert to HLS:', error);
      throw error;
    }
  }

  /**
   * Get optimal streaming URL based on connection and device
   */
  getOptimalStreamingUrl(baseUrl: string, trackId: string): string {
    // Check connection speed (simplified)
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && connection.effectiveType === '2g';
    
    // Check if mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isSlowConnection || isMobile) {
      // Use HLS for better adaptive streaming
      return `/api/hls/playlist.m3u8`;
    } else {
      // Use direct streaming for desktop/fast connections
      return `/api/stream/${baseUrl}`;
    }
  }

  /**
   * Preload audio segments for smooth playback
   */
  async preloadForPlayback(trackId: string, startSegment: number = 0): Promise<void> {
    try {
      await hlsAudioManager.preloadSegments(trackId, startSegment, 3);
    } catch (error) {
      console.error('Failed to preload segments:', error);
    }
  }

  /**
   * Clean up resources after playback
   */
  cleanup(trackId: string): void {
    hlsAudioManager.cleanup(trackId);
  }

  /**
   * Get audio format info
   */
  getAudioInfo(file: File): Promise<{
    duration: number;
    bitrate: string;
    sampleRate: number;
    channels: number;
  }> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        // Basic info available from HTML5 Audio
        const info = {
          duration: audio.duration,
          bitrate: 'Unknown', // Would need more advanced analysis
          sampleRate: 44100, // Default assumption
          channels: 2 // Default assumption
        };
        
        URL.revokeObjectURL(url);
        resolve(info);
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio metadata'));
      });

      audio.src = url;
    });
  }

  /**
   * Convert audio file to different format (client-side)
   */
  async convertFormat(
    audioFile: File,
    targetFormat: 'wav' | 'mp3' | 'aac',
    quality: number = 0.8
  ): Promise<Blob> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      if (targetFormat === 'wav') {
        return this.audioBufferToWav(audioBuffer);
      } else {
        // For MP3/AAC, we'd need a more complex encoder
        // For now, return as WAV
        return this.audioBufferToWav(audioBuffer);
      }
    } catch (error) {
      console.error('Format conversion failed:', error);
      throw error;
    }
  }

  /**
   * Convert AudioBuffer to WAV Blob
   */
  private audioBufferToWav(audioBuffer: AudioBuffer): Blob {
    const length = audioBuffer.length;
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  /**
   * Analyze audio for optimal streaming settings
   */
  async analyzeAudio(file: File): Promise<{
    recommendedFormat: 'hls' | 'direct';
    estimatedBandwidth: number;
    optimalSegmentSize: number;
  }> {
    const info = await this.getAudioInfo(file);
    const fileSize = file.size;
    const bitrate = (fileSize * 8) / info.duration; // bits per second

    return {
      recommendedFormat: bitrate > 320000 ? 'hls' : 'direct', // Use HLS for high bitrate
      estimatedBandwidth: bitrate,
      optimalSegmentSize: Math.min(10, Math.max(5, info.duration / 20)) // 5-10 second segments
    };
  }
}

// Export singleton instance
export const audioConverter = new AudioConverter();
export type { ConversionOptions };
