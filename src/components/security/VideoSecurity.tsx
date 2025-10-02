// components/security/VideoSecurity.tsx - COMPLETELY FIXED
"use client";

import { useEffect } from 'react';

export const useVideoSecurity = () => {
  useEffect(() => {
    // ✅ FIXED: Disable right-click context menu with null checks
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    // Disable common keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // ✅ FIXED: Disable text selection with proper null checks
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Check if target has closest method and if it's a video element
      if ((typeof target.closest === 'function' && target.closest('.video-container')) || 
          target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    // ✅ FIXED: Disable drag and drop with null checks
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
};

// ✅ FIXED: Security wrapper without onSelectStart prop
export default function VideoSecurity({ children }: { children: React.ReactNode }) {
  useVideoSecurity();

  return (
    <div 
      className="video-container select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
