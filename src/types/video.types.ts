// types/video.types.ts
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
  
  export interface BaseVideo {
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
    resolution?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    duration: number;
    quality: string[];
    fileSize: number;
    status: 'processing' | 'ready' | 'failed' | 'pending';
    uploaderId: string;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface VideoWithUploader extends BaseVideo {
    uploaderDetails?: UserDetails; // This means UserDetails | undefined
  }
  export interface VideoCardProps {
    video: VideoWithUploader;
    onClick?: () => void;
    isDark?: boolean;
    size?: 'small' | 'medium' | 'large';
    layout?: 'grid' | 'list';
    showHover?: boolean;
    className?: string;
    // Add missing props
    isHovered?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
  
  export interface VideoGridProps {
    videos: VideoWithUploader[];
    onVideoClick?: (video: VideoWithUploader) => void;
    isDark?: boolean;
    className?: string;
  }
  