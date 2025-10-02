# 🎵 Sonity Component Usage Guide

## Quick Reference for New Components

---

## 1. MusicPlayer Component

### Usage:
```tsx
import MusicPlayer from "@/components/MusicPlayer";

const tracks = [
  {
    id: "1",
    title: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    coverArt: "/cover.jpg",
    audioUrl: "/api/tracks/stream/track_123",
    duration: 180
  }
];

<MusicPlayer
  currentTrack={tracks[0]}
  playlist={tracks}
  onNext={() => playNextTrack()}
  onPrevious={() => playPreviousTrack()}
  onTrackChange={(track) => handleTrackChange(track)}
/>
```

### Features:
- Modern player controls
- Volume slider
- Progress bar with seek
- Like/heart button
- Shuffle & repeat modes
- Cover art display

---

## 2. ShareCard Component

### Usage:
```tsx
import ShareCard from "@/components/ShareCard";

const [showShare, setShowShare] = useState(false);

<ShareCard
  track={{
    title: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    coverArt: "/cover.jpg",
    duration: 180
  }}
  onClose={() => setShowShare(false)}
/>
```

### Features:
- Canvas-based card generation
- Instagram story export
- Twitter sharing
- Facebook sharing
- Native Web Share API
- Copy link functionality

---

## 3. useOfflineMusic Hook

### Usage:
```tsx
import { useOfflineMusic } from "@/hooks/useOfflineMusic";

function MyComponent() {
  const {
    tracks,
    playlists,
    isLoading,
    error,
    storageUsage,
    saveTrackOffline,
    deleteTrack,
    getTrackAudioUrl,
    createPlaylist,
    addTrackToPlaylist
  } = useOfflineMusic();

  // Save track offline (from platform library only)
  const handleSaveOffline = async () => {
    await saveTrackOffline({
      trackId: "track_123",
      title: "Song Name",
      artistName: "Artist Name",
      duration: 180,
      audioUrl: "/api/tracks/stream/track_123",
      coverArtUrl: "/covers/cover.jpg",
      metadata: {
        genre: "Pop",
        year: 2024,
        bitrate: "320kbps"
      }
    });
  };

  // Create playlist
  const handleCreatePlaylist = async () => {
    const id = await createPlaylist("My Playlist", "Description");
  };

  // Add track to playlist
  const handleAddToPlaylist = async () => {
    await addTrackToPlaylist(playlistId, trackId);
  };

  return (
    <div>
      <p>Storage: {storageUsage.percentage.toFixed(1)}%</p>
      <p>Offline tracks: {tracks.length}</p>
    </div>
  );
}
```

---

## 4. CSS Utilities

### Glass Effect:
```tsx
<div className="glass-effect">
  Content with blur background
</div>
```

### Sonity Card:
```tsx
<div className="sonity-card">
  Modern card with hover effects
</div>
```

### Custom Scrollbar (Automatic):
All scrollable containers have custom scrollbars by default.

---

## 5. Offline Storage API (Direct Access)

### Usage:
```tsx
import { offlineStorage } from "@/lib/offline-storage";

// Initialize
await offlineStorage.init();

// Save track (from platform only)
const trackId = await offlineStorage.saveTrackOffline({
  trackId: "track_123",
  title: "Song",
  artistName: "Artist",
  duration: 180,
  audioUrl: "/api/tracks/stream/track_123"
});

// Get all tracks
const tracks = await offlineStorage.getAllTracks();

// Get track audio URL
const audioUrl = await offlineStorage.getTrackAudioUrl(trackId);

// Delete track
await offlineStorage.deleteTrack(trackId);

// Create playlist
const playlistId = await offlineStorage.createPlaylist("Playlist Name");

// Get storage usage
const usage = await offlineStorage.getStorageUsage();
```

---

## 6. Track Model

### Interface:
```typescript
interface ITrack {
  _id: Types.ObjectId;
  customTrackId: string;
  title: string;
  artistName: string;
  artistId: string;
  albumName?: string;
  albumId?: string;
  coverArt: {
    default?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
  genre: MusicGenre;
  duration: number;
  audioUrl?: string;
  availableQualities: AudioQuality[];
  plays: number;
  likes: number;
  privacy: "public" | "unlisted" | "private";
  processingStatus: "pending" | "uploading" | "processing" | "ready" | "failed";
}
```

### Usage with MongoDB:
```typescript
import { Track } from "@/models/track.model";

// Find tracks
const tracks = await Track.find({ privacy: "public" });

// Find by artist
const artistTracks = await Track.findByArtist(artistId);

// Find trending
const trending = await Track.findTrending(20);

// Increment play count
await track.incrementPlay(true);
```

---

## 7. PWA Manifest Features

### Share Target:
The app automatically handles shared content from other apps.

### Shortcuts:
- My Library: `/library`
- Discover: `/discover`

### Installation:
Users can install via browser prompt or "Add to Home Screen".

---

## Best Practices

1. **Always use saveTrackOffline** - Never implement file uploads
2. **Check storage usage** - Warn users when storage is low
3. **Handle errors gracefully** - Show user-friendly messages
4. **Optimize images** - Use appropriate cover art sizes
5. **Test offline mode** - Ensure offline playback works
6. **Respect privacy** - Don't access user data without permission

---

## Example: Complete Music Page

```tsx
"use client";

import { useState } from "react";
import { useOfflineMusic } from "@/hooks/useOfflineMusic";
import MusicPlayer from "@/components/MusicPlayer";
import ShareCard from "@/components/ShareCard";

export default function MusicPage() {
  const { saveTrackOffline, tracks } = useOfflineMusic();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const handleSaveOffline = async (track) => {
    try {
      await saveTrackOffline({
        trackId: track.id,
        title: track.title,
        artistName: track.artist,
        duration: track.duration,
        audioUrl: track.audioUrl,
        coverArtUrl: track.coverArt
      });
      alert("Saved offline!");
    } catch (err) {
      alert("Failed to save");
    }
  };

  return (
    <div>
      {/* Track list */}
      {tracks.map(track => (
        <div key={track.id} className="sonity-card">
          <h3>{track.title}</h3>
          <p>{track.artist}</p>
          <button onClick={() => setCurrentTrack(track)}>
            Play
          </button>
          <button onClick={() => handleSaveOffline(track)}>
            Save Offline
          </button>
          <button onClick={() => setShowShare(true)}>
            Share
          </button>
        </div>
      ))}

      {/* Music player */}
      <MusicPlayer
        currentTrack={currentTrack}
        playlist={tracks}
      />

      {/* Share card */}
      {showShare && (
        <ShareCard
          track={currentTrack}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
```

---

## Support

Need help? Check:
- `TRANSFORMATION_COMPLETE.md` for overview
- `README.md` for setup instructions
- Component source code for detailed implementation

---

Built with ❤️ by Veliessa Team
