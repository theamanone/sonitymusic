// lib/hls-audio-manager.ts - HLS Audio Streaming Manager
"use client";

import { offlineStorage } from './offline-storage';

interface HLSSegment {
  id: string;
  trackId: string;
  segmentIndex: number;
  duration: number;
  blob: Blob;
  url: string;
}

interface HLSPlaylist {
  trackId: string;
  segments: HLSSegment[];
  totalDuration: number;
  segmentDuration: number;
  m3u8Content: string;
}

class HLSAudioManager {
  private segmentDuration = 10; // 10 seconds per segment (like Spotify)
  private playlists = new Map<string, HLSPlaylist>();

  /**
   * Convert MP3 to HLS segments (client-side chunking)
   * This simulates what Spotify/Apple Music do server-side
   */
  async convertToHLS(audioFile: File, trackId: string): Promise<HLSPlaylist> {
    try {
      // Create audio context for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const totalDuration = audioBuffer.duration;
      const segmentCount = Math.ceil(totalDuration / this.segmentDuration);
      const segments: HLSSegment[] = [];

      // Create segments
      for (let i = 0; i < segmentCount; i++) {
        const startTime = i * this.segmentDuration;
        const endTime = Math.min((i + 1) * this.segmentDuration, totalDuration);
        const segmentDuration = endTime - startTime;

        // Extract segment from audio buffer
        const segmentBuffer = this.extractAudioSegment(audioBuffer, startTime, endTime, audioContext);
        
        // Convert back to blob (AAC format for better streaming)
        const segmentBlob = await this.audioBufferToBlob(segmentBuffer, audioContext);
        const segmentUrl = URL.createObjectURL(segmentBlob);

        const segment: HLSSegment = {
          id: `${trackId}_segment_${i}`,
          trackId,
          segmentIndex: i,
          duration: segmentDuration,
          blob: segmentBlob,
          url: segmentUrl
        };

        segments.push(segment);
      }

      // Generate M3U8 playlist
      const m3u8Content = this.generateM3U8Playlist(segments, totalDuration);

      const playlist: HLSPlaylist = {
        trackId,
        segments,
        totalDuration,
        segmentDuration: this.segmentDuration,
        m3u8Content
      };

      this.playlists.set(trackId, playlist);
      await this.savePlaylistToStorage(playlist);

      return playlist;
    } catch (error) {
      console.error('Failed to convert to HLS:', error);
      throw error;
    }
  }

  /**
   * Extract audio segment from buffer
   */
  private extractAudioSegment(
    audioBuffer: AudioBuffer,
    startTime: number,
    endTime: number,
    audioContext: AudioContext
  ): AudioBuffer {
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const segmentLength = endSample - startSample;

    const segmentBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      segmentLength,
      sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const segmentChannelData = segmentBuffer.getChannelData(channel);
      
      for (let i = 0; i < segmentLength; i++) {
        segmentChannelData[i] = channelData[startSample + i];
      }
    }

    return segmentBuffer;
  }

  /**
   * Convert AudioBuffer to Blob (AAC format)
   */
  private async audioBufferToBlob(audioBuffer: AudioBuffer, audioContext: AudioContext): Promise<Blob> {
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to WAV format (more compatible than trying to encode AAC client-side)
    return this.audioBufferToWav(renderedBuffer);
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
   * Generate M3U8 playlist content
   */
  private generateM3U8Playlist(segments: HLSSegment[], totalDuration: number): string {
    let m3u8 = '#EXTM3U\n';
    m3u8 += '#EXT-X-VERSION:3\n';
    m3u8 += `#EXT-X-TARGETDURATION:${Math.ceil(this.segmentDuration)}\n`;
    m3u8 += '#EXT-X-MEDIA-SEQUENCE:0\n';
    m3u8 += '#EXT-X-PLAYLIST-TYPE:VOD\n';

    segments.forEach((segment, index) => {
      m3u8 += `#EXTINF:${segment.duration.toFixed(6)},\n`;
      m3u8 += `segment_${index}.wav\n`;
    });

    m3u8 += '#EXT-X-ENDLIST\n';
    return m3u8;
  }

  /**
   * Save playlist to IndexedDB
   */
  private async savePlaylistToStorage(playlist: HLSPlaylist): Promise<void> {
    try {
      await offlineStorage.init();
      // Store each segment separately for efficient loading
      for (const segment of playlist.segments) {
        await offlineStorage.saveTrackOffline({
          trackId: segment.id,
          title: `Segment ${segment.segmentIndex}`,
          artistName: 'HLS Segment',
          duration: segment.duration,
          audioUrl: segment.url,
          metadata: {
            genre: 'hls-segment',
            bitrate: 'hls-segment',
            year: segment.segmentIndex
          }
        });
      }
    } catch (error) {
      console.error('Failed to save HLS playlist:', error);
    }
  }

  /**
   * Get HLS playlist for streaming
   */
  async getHLSPlaylist(trackId: string): Promise<HLSPlaylist | null> {
    return this.playlists.get(trackId) || null;
  }

  /**
   * Get segment URL for streaming
   */
  getSegmentUrl(trackId: string, segmentIndex: number): string | null {
    const playlist = this.playlists.get(trackId);
    if (!playlist || !playlist.segments[segmentIndex]) {
      return null;
    }
    return playlist.segments[segmentIndex].url;
  }

  /**
   * Preload segments for smooth playback
   */
  async preloadSegments(trackId: string, startIndex: number, count: number = 3): Promise<void> {
    const playlist = this.playlists.get(trackId);
    if (!playlist) return;

    const endIndex = Math.min(startIndex + count, playlist.segments.length);
    const preloadPromises = [];

    for (let i = startIndex; i < endIndex; i++) {
      const segment = playlist.segments[i];
      if (segment) {
        // Preload by creating a temporary audio element
        preloadPromises.push(this.preloadSegment(segment.url));
      }
    }

    await Promise.all(preloadPromises);
  }

  private preloadSegment(url: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => resolve(), { once: true });
      audio.addEventListener('error', () => resolve(), { once: true });
      audio.src = url;
      audio.load();
    });
  }

  /**
   * Clean up resources
   */
  cleanup(trackId: string): void {
    const playlist = this.playlists.get(trackId);
    if (playlist) {
      // Revoke object URLs to free memory
      playlist.segments.forEach(segment => {
        URL.revokeObjectURL(segment.url);
      });
      this.playlists.delete(trackId);
    }
  }
}

// Export singleton instance
export const hlsAudioManager = new HLSAudioManager();
export type { HLSSegment, HLSPlaylist };
