// lib/video-recorder.ts - Video recording utility for Instagram stories
"use client";

export interface VideoRecorderOptions {
  duration?: number; // in seconds
  width?: number;
  height?: number;
  frameRate?: number;
}

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private startTime: number = 0;

  async startRecording(
    trackInfo: { title: string; artist: string; coverArt?: string },
    options: VideoRecorderOptions = {}
  ): Promise<Blob> {
    const {
      duration = 15,
      width = 1080,
      height = 1920,
      frameRate = 30
    } = options;

    try {
      // Get screen and audio stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width, height, frameRate },
        audio: true
      });

      // Create canvas for overlay
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');

      // Combine streams
      const audioTracks = screenStream.getAudioTracks();
      const videoTrack = screenStream.getVideoTracks()[0];

      // Create a new canvas stream for overlay
      const canvasStream = this.canvas.captureStream(frameRate);

      // Combine video tracks
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioTracks
      ]);

      this.stream = combinedStream;

      return new Promise((resolve, reject) => {
        const chunks: Blob[] = [];

        this.mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType: 'video/webm;codecs=vp9'
        });

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          this.cleanup();
          resolve(blob);
        };

        this.mediaRecorder.onerror = (error) => {
          this.cleanup();
          reject(error);
        };

        // Start recording
        this.startTime = Date.now();
        this.mediaRecorder.start(100); // Record in 100ms chunks

        // Draw overlay animation
        this.drawOverlay(trackInfo);

        // Stop recording after duration
        setTimeout(() => {
          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
          }
        }, duration * 1000);
      });

    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  private drawOverlay(trackInfo: { title: string; artist: string; coverArt?: string }) {
    if (!this.canvas || !this.ctx) return;

    const animate = () => {
      if (!this.canvas || !this.ctx) return;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Create gradient background
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)'); // Purple
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.8)'); // Pink
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw track info overlay
      this.drawTrackOverlay(trackInfo);

      // Continue animation if still recording
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.animationId = requestAnimationFrame(animate);
      }
    };

    animate();
  }

  private drawTrackOverlay(trackInfo: { title: string; artist: string; coverArt?: string }) {
    if (!this.canvas || !this.ctx) return;

    const { width, height } = this.canvas;

    // Draw track info at bottom
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = 'bold 48px Arial, sans-serif';
    this.ctx.textAlign = 'center';

    // Title
    this.ctx.fillText(trackInfo.title, width / 2, height - 300);

    // Artist
    this.ctx.font = '36px Arial, sans-serif';
    this.ctx.fillText(`by ${trackInfo.artist}`, width / 2, height - 240);

    // Sonity branding
    this.ctx.font = 'bold 32px Arial, sans-serif';
    this.ctx.fillText('♪ Sonity', width / 2, height - 180);

    // Recording indicator
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.ctx.font = '24px Arial, sans-serif';
    this.ctx.fillText(`Recording: ${elapsed.toFixed(1)}s`, width / 2, 100);

    // Cover art placeholder (you can enhance this)
    if (trackInfo.coverArt) {
      const img = new Image();
      img.onload = () => {
        this.ctx?.drawImage(img, width / 2 - 100, height - 500, 200, 200);
      };
      img.src = trackInfo.coverArt;
    }
  }

  private cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.mediaRecorder = null;
    this.canvas = null;
    this.ctx = null;
  }

  downloadVideo(blob: Blob, filename: string = 'sonity-story.webm') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
