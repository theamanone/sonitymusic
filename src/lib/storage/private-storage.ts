// lib/storage/private-storage.ts - Private Audio Storage Manager
"use server";

import { mkdir, writeFile, readFile, unlink, access, readdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';
import { constants } from 'fs';

interface StoredAudio {
  id: string;
  originalName: string;
  hashedPath: string;
  mimeType: string;
  size: number;
  duration?: number;
  thumbnail?: string; // Base64 encoded thumbnail
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
  };
  createdAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

class PrivateStorageManager {
  private storageDir = join(process.cwd(), 'private', 'audio');
  private thumbnailDir = join(process.cwd(), 'private', 'thumbnails');
  private metadataFile = join(process.cwd(), 'private', 'metadata.json');

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize private storage directories
   */
  private async initializeStorage(): Promise<void> {
    try {
      await mkdir(this.storageDir, { recursive: true });
      await mkdir(this.thumbnailDir, { recursive: true });
      
      // Create metadata file if it doesn't exist
      try {
        await access(this.metadataFile, constants.F_OK);
      } catch {
        await writeFile(this.metadataFile, JSON.stringify({}), 'utf8');
      }
    } catch (error) {
      console.error('Failed to initialize private storage:', error);
    }
  }

  /**
   * Generate secure hash for file storage
   */
  private generateSecureHash(filename: string, userId?: string): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36);
    const data = `${filename}_${userId || 'anonymous'}_${timestamp}_${random}`;
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Store audio file privately with metadata extraction
   */
  async storeAudioFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    userId?: string
  ): Promise<StoredAudio> {
    try {
      const fileId = this.generateSecureHash(originalName, userId);
      const fileExtension = originalName.split('.').pop() || 'mp3';
      const hashedFilename = `${fileId}.${fileExtension}`;
      const filePath = join(this.storageDir, hashedFilename);

      // Store the file
      await writeFile(filePath, fileBuffer);

      // Extract metadata and thumbnail
      const metadata = await this.extractAudioMetadata(fileBuffer);
      const thumbnail = await this.extractThumbnail(fileBuffer, fileId);

      const storedAudio: StoredAudio = {
        id: fileId,
        originalName,
        hashedPath: hashedFilename,
        mimeType,
        size: fileBuffer.length,
        duration: metadata.duration,
        thumbnail,
        metadata: {
          title: metadata.title || originalName.replace(/\.[^/.]+$/, ''),
          artist: metadata.artist || 'Unknown Artist',
          album: metadata.album,
          year: metadata.year,
          genre: metadata.genre
        },
        createdAt: new Date(),
        accessCount: 0,
        lastAccessed: new Date()
      };

      // Save metadata
      await this.saveMetadata(fileId, storedAudio);

      return storedAudio;
    } catch (error) {
      console.error('Failed to store audio file:', error);
      throw new Error('Storage operation failed');
    }
  }

  /**
   * Extract audio metadata using basic parsing
   */
  private async extractAudioMetadata(buffer: Buffer): Promise<{
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
    duration?: number;
  }> {
    try {
      // Basic ID3 tag parsing for MP3 files
      if (buffer.slice(0, 3).toString() === 'ID3') {
        return this.parseID3Tags(buffer);
      }
      
      // For other formats, return basic info
      return {};
    } catch (error) {
      console.error('Metadata extraction failed:', error);
      return {};
    }
  }

  /**
   * Parse ID3 tags from MP3 buffer
   */
  private parseID3Tags(buffer: Buffer): {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
  } {
    try {
      const metadata: any = {};
      
      // ID3v2 header parsing (simplified)
      if (buffer.slice(0, 3).toString() === 'ID3') {
        const version = buffer[3];
        const headerSize = 10;
        let offset = headerSize;
        
        // Parse frames (simplified - would need full ID3v2 parser for production)
        while (offset < Math.min(buffer.length, 1000)) { // Limit parsing to first 1KB
          const frameId = buffer.slice(offset, offset + 4).toString();
          
          if (frameId === 'TIT2') { // Title
            const size = buffer.readUInt32BE(offset + 4);
            metadata.title = buffer.slice(offset + 11, offset + 10 + size).toString('utf8').replace(/\0/g, '');
          } else if (frameId === 'TPE1') { // Artist
            const size = buffer.readUInt32BE(offset + 4);
            metadata.artist = buffer.slice(offset + 11, offset + 10 + size).toString('utf8').replace(/\0/g, '');
          } else if (frameId === 'TALB') { // Album
            const size = buffer.readUInt32BE(offset + 4);
            metadata.album = buffer.slice(offset + 11, offset + 10 + size).toString('utf8').replace(/\0/g, '');
          }
          
          offset += 10 + (buffer.readUInt32BE(offset + 4) || 0);
          if (offset >= buffer.length) break;
        }
      }
      
      return metadata;
    } catch (error) {
      console.error('ID3 parsing failed:', error);
      return {};
    }
  }

  /**
   * Extract thumbnail from audio file
   */
  private async extractThumbnail(buffer: Buffer, fileId: string): Promise<string | undefined> {
    try {
      // Look for APIC frame in ID3v2 (album art)
      if (buffer.slice(0, 3).toString() === 'ID3') {
        const apicIndex = buffer.indexOf('APIC');
        if (apicIndex !== -1) {
          // Find image data (simplified extraction)
          const imageStart = buffer.indexOf(Buffer.from([0xFF, 0xD8]), apicIndex); // JPEG header
          if (imageStart !== -1) {
            const imageEnd = buffer.indexOf(Buffer.from([0xFF, 0xD9]), imageStart); // JPEG footer
            if (imageEnd !== -1) {
              const imageBuffer = buffer.slice(imageStart, imageEnd + 2);
              
              // Save thumbnail
              const thumbnailPath = join(this.thumbnailDir, `${fileId}.jpg`);
              await writeFile(thumbnailPath, imageBuffer);
              
              // Return as base64 for API responses
              return imageBuffer.toString('base64');
            }
          }
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('Thumbnail extraction failed:', error);
      return undefined;
    }
  }

  /**
   * Get audio file by ID
   */
  async getAudioFile(fileId: string, userId?: string): Promise<{
    buffer: Buffer;
    metadata: StoredAudio;
  } | null> {
    try {
      const metadata = await this.getMetadata(fileId);
      if (!metadata) return null;

      const filePath = join(this.storageDir, metadata.hashedPath);
      const buffer = await readFile(filePath);

      // Update access tracking
      metadata.accessCount++;
      metadata.lastAccessed = new Date();
      await this.saveMetadata(fileId, metadata);

      return { buffer, metadata };
    } catch (error) {
      console.error('Failed to get audio file:', error);
      return null;
    }
  }

  /**
   * Get thumbnail by file ID
   */
  async getThumbnail(fileId: string): Promise<Buffer | null> {
    try {
      const thumbnailPath = join(this.thumbnailDir, `${fileId}.jpg`);
      return await readFile(thumbnailPath);
    } catch (error) {
      return null;
    }
  }

  /**
   * Save metadata to JSON file
   */
  private async saveMetadata(fileId: string, metadata: StoredAudio): Promise<void> {
    try {
      const allMetadata = await this.getAllMetadata();
      allMetadata[fileId] = metadata;
      await writeFile(this.metadataFile, JSON.stringify(allMetadata, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  }

  /**
   * Get metadata for specific file
   */
  private async getMetadata(fileId: string): Promise<StoredAudio | null> {
    try {
      const allMetadata = await this.getAllMetadata();
      return allMetadata[fileId] || null;
    } catch (error) {
      console.error('Failed to get metadata:', error);
      return null;
    }
  }

  /**
   * Get all metadata
   */
  private async getAllMetadata(): Promise<Record<string, StoredAudio>> {
    try {
      const data = await readFile(this.metadataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  /**
   * List all stored files
   */
  async listStoredFiles(userId?: string): Promise<StoredAudio[]> {
    try {
      const allMetadata = await this.getAllMetadata();
      return Object.values(allMetadata).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to list stored files:', error);
      return [];
    }
  }

  /**
   * Delete stored file
   */
  async deleteStoredFile(fileId: string): Promise<boolean> {
    try {
      const metadata = await this.getMetadata(fileId);
      if (!metadata) return false;

      // Delete audio file
      const audioPath = join(this.storageDir, metadata.hashedPath);
      await unlink(audioPath);

      // Delete thumbnail if exists
      const thumbnailPath = join(this.thumbnailDir, `${fileId}.jpg`);
      try {
        await unlink(thumbnailPath);
      } catch {} // Ignore if thumbnail doesn't exist

      // Remove from metadata
      const allMetadata = await this.getAllMetadata();
      delete allMetadata[fileId];
      await writeFile(this.metadataFile, JSON.stringify(allMetadata, null, 2), 'utf8');

      return true;
    } catch (error) {
      console.error('Failed to delete stored file:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    totalAccesses: number;
    mostAccessed: StoredAudio[];
  }> {
    try {
      const allMetadata = await this.getAllMetadata();
      const files = Object.values(allMetadata);

      return {
        totalFiles: files.length,
        totalSize: files.reduce((sum, file) => sum + file.size, 0),
        totalAccesses: files.reduce((sum, file) => sum + file.accessCount, 0),
        mostAccessed: files
          .sort((a, b) => b.accessCount - a.accessCount)
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        totalAccesses: 0,
        mostAccessed: []
      };
    }
  }
}

// Export singleton instance
export const privateStorage = new PrivateStorageManager();
export type { StoredAudio };
