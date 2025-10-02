import { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface ChunkMetadata {
  chunkIndex: number;
  totalChunks: number;
  chunkSize: number;
  fileHash: string;
  fileName: string;
  fileSize: number;
  uploadId: string;
}

export interface UploadSession {
  uploadId: string;
  fileName: string;
  fileSize: number;
  totalChunks: number;
  uploadedChunks: Set<number>;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
  fileHash: string;
}

export class ChunkedUploadManager {
  private static sessions = new Map<string, UploadSession>();
  private static readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly UPLOAD_DIR = join(process.cwd(), 'data', 'uploads', 'temp');

  static async initializeUpload(
    fileName: string,
    fileSize: number,
    userId: string,
    fileHash?: string
  ): Promise<{ uploadId: string; chunkSize: number; totalChunks: number }> {
    const uploadId = this.generateUploadId();
    const totalChunks = Math.ceil(fileSize / this.CHUNK_SIZE);
    
    // Ensure upload directory exists
    await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
    
    const session: UploadSession = {
      uploadId,
      fileName,
      fileSize,
      totalChunks,
      uploadedChunks: new Set(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT),
      userId,
      fileHash: fileHash || ''
    };
    
    this.sessions.set(uploadId, session);
    
    return {
      uploadId,
      chunkSize: this.CHUNK_SIZE,
      totalChunks
    };
  }

  static async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunkData: Buffer,
    userId: string
  ): Promise<{ success: boolean; progress: number; isComplete: boolean }> {
    const session = this.sessions.get(uploadId);
    
    if (!session) {
      throw new Error('Upload session not found');
    }
    
    if (session.userId !== userId) {
      throw new Error('Unauthorized access to upload session');
    }
    
    if (session.expiresAt < new Date()) {
      this.sessions.delete(uploadId);
      throw new Error('Upload session expired');
    }
    
    // Validate chunk index
    if (chunkIndex < 0 || chunkIndex >= session.totalChunks) {
      throw new Error('Invalid chunk index');
    }
    
    // Save chunk to temporary file
    const chunkPath = join(this.UPLOAD_DIR, `${uploadId}_chunk_${chunkIndex}`);
    await fs.writeFile(chunkPath, chunkData);
    
    // Mark chunk as uploaded
    session.uploadedChunks.add(chunkIndex);
    
    const progress = (session.uploadedChunks.size / session.totalChunks) * 100;
    const isComplete = session.uploadedChunks.size === session.totalChunks;
    
    return {
      success: true,
      progress,
      isComplete
    };
  }

  static async finalizeUpload(uploadId: string, userId: string): Promise<string> {
    const session = this.sessions.get(uploadId);
    
    if (!session) {
      throw new Error('Upload session not found');
    }
    
    if (session.userId !== userId) {
      throw new Error('Unauthorized access to upload session');
    }
    
    if (session.uploadedChunks.size !== session.totalChunks) {
      throw new Error('Upload incomplete - missing chunks');
    }
    
    // Combine chunks into final file
    const finalPath = join(process.cwd(), 'data', 'uploads', `${uploadId}_${session.fileName}`);
    const writeStream = await fs.open(finalPath, 'w');
    
    try {
      for (let i = 0; i < session.totalChunks; i++) {
        const chunkPath = join(this.UPLOAD_DIR, `${uploadId}_chunk_${i}`);
        const chunkData = await fs.readFile(chunkPath);
        await writeStream.write(chunkData);
        
        // Clean up chunk file
        await fs.unlink(chunkPath).catch(() => {}); // Ignore errors
      }
    } finally {
      await writeStream.close();
    }
    
    // Verify file integrity if hash provided
    if (session.fileHash) {
      const fileBuffer = await fs.readFile(finalPath);
      const calculatedHash = createHash('sha256').update(fileBuffer).digest('hex');
      
      if (calculatedHash !== session.fileHash) {
        await fs.unlink(finalPath).catch(() => {});
        throw new Error('File integrity check failed');
      }
    }
    
    // Clean up session
    this.sessions.delete(uploadId);
    
    return finalPath;
  }

  static async getUploadStatus(uploadId: string, userId: string): Promise<{
    progress: number;
    uploadedChunks: number;
    totalChunks: number;
    isComplete: boolean;
  }> {
    const session = this.sessions.get(uploadId);
    
    if (!session) {
      throw new Error('Upload session not found');
    }
    
    if (session.userId !== userId) {
      throw new Error('Unauthorized access to upload session');
    }
    
    const progress = (session.uploadedChunks.size / session.totalChunks) * 100;
    const isComplete = session.uploadedChunks.size === session.totalChunks;
    
    return {
      progress,
      uploadedChunks: session.uploadedChunks.size,
      totalChunks: session.totalChunks,
      isComplete
    };
  }

  static async cancelUpload(uploadId: string, userId: string): Promise<void> {
    const session = this.sessions.get(uploadId);
    
    if (!session) {
      return; // Already cleaned up
    }
    
    if (session.userId !== userId) {
      throw new Error('Unauthorized access to upload session');
    }
    
    // Clean up chunk files
    for (let i = 0; i < session.totalChunks; i++) {
      const chunkPath = join(this.UPLOAD_DIR, `${uploadId}_chunk_${i}`);
      await fs.unlink(chunkPath).catch(() => {}); // Ignore errors
    }
    
    // Remove session
    this.sessions.delete(uploadId);
  }

  private static generateUploadId(): string {
    return createHash('sha256')
      .update(`${Date.now()}-${Math.random()}-${process.hrtime.bigint()}`)
      .digest('hex')
      .substring(0, 32);
  }

  // Cleanup expired sessions
  static cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [uploadId, session] of Array.from(this.sessions.entries())) {
      if (session.expiresAt < now) {
        this.cancelUpload(uploadId, session.userId).catch(console.error);
      }
    }
  }

  // Security: Validate file type and size
  static validateUpload(fileName: string, fileSize: number, mimeType: string): void {
    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv'
    ];
    
    if (!allowedTypes.includes(mimeType)) {
      throw new Error('Unsupported file type');
    }
    
    const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
    if (fileSize > maxSize) {
      throw new Error('File too large');
    }
    
    // Check file extension
    const allowedExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv'];
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(extension)) {
      throw new Error('Invalid file extension');
    }
  }
}

// Start cleanup interval
setInterval(() => {
  ChunkedUploadManager.cleanupExpiredSessions();
}, 60 * 60 * 1000); // Run every hour
