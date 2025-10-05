// types/audio.types.ts
export interface UserDetails {
    _id: string;
    name: string;
    avatar?: string;
    email?: string;
    role?: string;
    theme?: string;
    emailVerified?: boolean;
    twoFactorEnabled?: boolean;
    membershipCard?: any;
    createdAt?: Date;
  }
  
  export interface BaseSong {
    _id: string;
    title: string;
    description?: string;
    tags: string[];
    category: string;
    privacy: 'public' | 'unlisted' | 'private';
    allowComments: boolean;
    ageRestriction: boolean;
    fileName?: string;
    mimeType?: string;
    bitrate?: string;
    audioUrl?: string;
    thumbnailUrl?: string;
    duration: number;
    quality: string[];
    fileSize: number;
    status: 'processing' | 'ready' | 'failed' | 'pending';
    uploaderId: string;
    plays: number;
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SongWithUploader extends BaseSong {
    uploaderDetails?: UserDetails; // This means UserDetails | undefined
  }
  export interface SongCardProps {
    song: SongWithUploader;
    onClick?: () => void;
    isDark?: boolean;
    size?: 'small' | 'medium' | 'large';
    layout?: 'grid' | 'list';
    showHover?: boolean;
    className?: string;
    isHovered?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
  
  export interface SongGridProps {
    songs: SongWithUploader[];
    onSongClick?: (song: SongWithUploader) => void;
    isDark?: boolean;
    className?: string;
  }