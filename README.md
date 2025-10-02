# 🎵 Sonity - Modern Music Streaming Platform

A cutting-edge music streaming platform built with Next.js 15, featuring HLS streaming, private storage, advanced rate limiting, and modern UI/UX. Built by Veliessa.

## ✨ Features

### 🎵 Advanced Audio Streaming
- **HLS Streaming**: HTTP Live Streaming with 10-second segments for optimal performance
- **Private Storage**: Secure file storage outside public directory with hashed paths
- **Thumbnail Extraction**: Automatic extraction of embedded album art from audio files
- **Multiple Formats**: MP3, FLAC, WAV, M4A, OGG, AAC support
- **Adaptive Quality**: Bandwidth-optimized streaming like Spotify and Apple Music
- **Rate Limiting**: IP-based and user-based request throttling

### 🔐 Security & Privacy
- **Private File Storage**: Audio files stored in private directory with secure access tokens
- **Advanced Rate Limiting**: Multi-tier rate limiting with IP tracking and user agent fingerprinting
- **Secure API Routes**: All APIs under `/api/v1/` with proper authentication
- **Token-based Access**: Time-limited access tokens for streaming and downloads
- **Metadata Extraction**: Safe ID3 tag parsing with thumbnail extraction

### 🎨 Modern UI/UX
- **iOS 26 Glass Morphism**: Latest design trends with backdrop blur effects
- **Real App Feel**: Reduced top spacing and optimized mobile experience
- **Smart Image Handling**: Automatic aspect ratio preservation for all images
- **App Logo Integration**: Consistent branding throughout the application
- **Instagram Story Sharing**: Direct sharing with pre-filled captions

### 📱 Technical Excellence
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Private Storage System**: Secure file management with metadata tracking
- **HLS Audio Manager**: Client-side audio chunking and streaming
- **Recent Plays Tracking**: Local storage with IndexedDB integration
- **Audio Converter**: Modern audio processing utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- FFmpeg (for HLS conversion)
- MongoDB database

### Installation

```bash
# Clone the repository
git clone https://github.com/theamanone/sonity.git
cd sonity

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

### Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sonity

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001

# Private Storage
PRIVATE_STORAGE_DIR=./private
MAX_FILE_SIZE=52428800  # 50MB

# Audio Processing
ENABLE_HLS=true
HLS_SEGMENT_DURATION=10
FFMPEG_PATH=/usr/local/bin/ffmpeg

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── v1/            # Version 1 APIs
│   │   │   ├── audio/     # Audio management
│   │   │   │   ├── upload/         # File upload
│   │   │   │   ├── stream/[id]/    # Audio streaming
│   │   │   │   ├── hls/[id]/       # HLS streaming
│   │   │   │   ├── thumbnail/[id]/ # Thumbnail serving
│   │   │   │   ├── list/           # List files
│   │   │   │   └── delete/[id]/    # Delete files
│   │   │   └── stats/     # System statistics
│   │   └── auth/          # Authentication
│   └── pages/             # App pages
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── music/            # Music components
│   ├── music-player/     # Player components
│   └── ui/               # UI components
├── lib/                  # Core libraries
│   ├── storage/          # Private storage system
│   ├── rate-limiting/    # Rate limiting system
│   ├── hls-audio-manager.ts    # HLS streaming
│   ├── audio-converter.ts      # Audio processing
│   ├── recent-plays.ts         # Play tracking
│   └── offline-storage.ts      # IndexedDB storage
└── private/              # Private file storage
    ├── audio/            # Audio files (hashed names)
    ├── thumbnails/       # Extracted thumbnails
    └── metadata.json     # File metadata
```

## 🎵 Audio Processing Pipeline

### Upload Flow
1. **File Validation**: Type, size, and security checks
2. **Metadata Extraction**: ID3 tags and embedded thumbnails
3. **Private Storage**: Secure storage with hashed filenames
4. **HLS Conversion**: FFmpeg-based segmentation (optional)
5. **Access Token Generation**: Secure streaming URLs

### Streaming Features
- **HLS Segments**: 10-second chunks for smooth playback
- **Range Requests**: Partial content support for seeking
- **Thumbnail Serving**: Extracted album art with fallback
- **Rate Limited Access**: Prevents abuse and ensures performance
- **Token Validation**: Time-limited access with user tracking

## 🔧 API Endpoints (v1)

### Audio Management
- `POST /api/v1/audio/upload` - Upload audio files
- `GET /api/v1/audio/stream/[id]` - Stream audio with range support
- `GET /api/v1/audio/hls/[id]/playlist.m3u8` - HLS master playlist
- `GET /api/v1/audio/hls/[id]/segment_xxx.ts` - HLS segments
- `GET /api/v1/audio/thumbnail/[id]` - Get audio thumbnail
- `GET /api/v1/audio/list` - List uploaded files
- `DELETE /api/v1/audio/delete/[id]` - Delete audio file

### System
- `GET /api/v1/stats` - System statistics and health

### Authentication
- `POST /api/auth/signin` - User authentication
- `GET /api/auth/session` - Current session
- `POST /api/auth/signout` - Sign out

## 🛡️ Security Features

### Rate Limiting Rules
```typescript
const RATE_LIMITS = {
  API_GENERAL: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
  AUDIO_STREAM: { windowMs: 60 * 1000, maxRequests: 30 },
  FILE_UPLOAD: { windowMs: 60 * 60 * 1000, maxRequests: 10 },
  HLS_SEGMENTS: { windowMs: 60 * 1000, maxRequests: 100 }
};
```

### Private Storage
- Files stored outside public directory
- Hashed filenames prevent direct access
- Metadata stored separately in JSON
- Automatic cleanup of expired tokens
- Access logging and statistics

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Configure environment variables
# Set up MongoDB connection
# Configure private storage
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Create private storage directory
RUN mkdir -p private/audio private/thumbnails

EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@sonity.veliessa.com
- 🌐 Website: [veliessa.com](https://veliessa.com)
- 📖 Documentation: [docs.sonity.veliessa.com](https://docs.sonity.veliessa.com)

## 🎯 Roadmap

- [x] HLS audio streaming
- [x] Private storage system
- [x] Advanced rate limiting
- [x] Thumbnail extraction
- [x] Modern UI/UX improvements
- [ ] Real-time analytics dashboard
- [ ] AI-powered recommendations
- [ ] Collaborative playlists
- [ ] Live streaming support
- [ ] Advanced audio effects

## ⚠️ Important Notes

- **Private Storage**: All audio files are stored securely outside the public directory
- **Rate Limiting**: API requests are limited to prevent abuse
- **Token Security**: Access tokens expire after 24 hours
- **FFmpeg Required**: HLS conversion requires FFmpeg installation
- **Production Ready**: Optimized for high-performance streaming

---

Built with ❤️ by the Veliessa team# sonity 
