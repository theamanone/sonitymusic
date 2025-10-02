// Security configuration for video platform
export const SECURITY_CONFIG = {
  // Video protection settings
  video: {
    // Disable right-click context menu
    disableContextMenu: true,
    
    // Disable common download shortcuts
    disableKeyboardShortcuts: true,
    
    // Disable text selection on video elements
    disableTextSelection: true,
    
    // Disable drag and drop
    disableDragDrop: true,
    
    // Blur content when window loses focus
    blurOnFocusLoss: true,
    // Duration for blackout overlay on sensitive events (ms)
    blackoutDurationMs: 1500,
    
    // Disable picture-in-picture
    disablePictureInPicture: true,
    
    // Disable fullscreen from video controls
    disableNativeFullscreen: true,
    
    // Clear clipboard on print screen
    clearClipboardOnPrintScreen: true
  },
  
  // Content protection
  content: {
    // Disable developer tools shortcuts
    disableDevTools: true,
    
    // Disable view source shortcuts
    disableViewSource: true,
    
    // Add watermark to videos
    addWatermark: false, // Can be enabled later
    // Enable blackout overlay on security events (screenshot/devtools/focus loss)
    blackoutOnEvents: true,
    
    // Session-based access control
    requireAuthentication: true
  },
  
  // Browser security headers (for server-side implementation)
  headers: {
    // Prevent embedding in iframes
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Strict transport security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Content security policy
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:;"
  }
};

// Security event handlers
export const SECURITY_EVENTS = {
  // Detect screenshot attempts
  onScreenshotAttempt: () => {
    console.warn('Screenshot attempt detected');
    // Could send analytics event or show warning
  },
  
  // Detect developer tools opening
  onDevToolsOpen: () => {
    console.warn('Developer tools opened');
    // Could blur content or show warning
  },
  
  // Detect focus loss
  onFocusLoss: () => {
    console.log('Window focus lost - applying security measures');
  },
  
  // Detect unauthorized access attempts
  onUnauthorizedAccess: () => {
    console.error('Unauthorized access attempt');
    // Could redirect to login or show error
  }
};
