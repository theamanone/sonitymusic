// components/layout/AppChrome.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothRouter from "@/components/navigation/SmoothRouter";
import { useEffect, useState } from "react";
import { TrackWithArtist } from '@/types/track.types';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/premium");
  // Initialize currentTrack as null to match server state
  const [currentTrack, setCurrentTrack] = useState<TrackWithArtist | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mainClassName, setMainClassName] = useState("min-h-screen relative overflow-hidden");

  useEffect(() => {
    setMounted(true);

    // Initialize music player detection only on client
    if (typeof window !== 'undefined') {
      try {
        const savedTrack = localStorage.getItem('sonity-current-track');
        if (savedTrack) {
          setCurrentTrack(JSON.parse(savedTrack));
        }
      } catch (error) {
        console.warn('Error loading music player state:', error);
      }
    }

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Update className after mounting and mobile detection
      setMainClassName(`min-h-screen relative overflow-hidden${currentTrack && !mobile ? ' pb-20' : ''}`);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Set up music player event listeners
    const handleMusicPlayerChange = (event: CustomEvent) => {
      try {
        const newTrack = event.detail?.currentTrack || null;
        setCurrentTrack(newTrack);
        // Update className when track changes
        setMainClassName(`min-h-screen relative overflow-hidden${newTrack && !isMobile ? ' pb-20' : ''}`);
      } catch (error) {
        console.warn('Error handling music player change:', error);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sonity-current-track') {
        try {
          const track = e.newValue ? JSON.parse(e.newValue) : null;
          setCurrentTrack(track);
          // Update className when track changes via storage
          setMainClassName(`min-h-screen relative overflow-hidden${track && !isMobile ? ' pb-20' : ''}`);
        } catch (error) {
          console.warn('Error handling storage change:', error);
        }
      }
    };

    window.addEventListener('music-player-change', handleMusicPlayerChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('music-player-change', handleMusicPlayerChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array - only run once on mount

  // Separate useEffect for updating className when state changes
  useEffect(() => {
    if (mounted) {
      setMainClassName(`min-h-screen relative overflow-hidden${currentTrack && !isMobile ? ' pb-20' : ''}`);
    }
  }, [mounted, currentTrack, isMobile]);

  if (hideChrome) {
    return (
      <SmoothRouter>
        {children}
      </SmoothRouter>
    );
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <SmoothRouter>
        <Navbar />
        <main className="min-h-screen relative overflow-hidden pt-20 sm:pt-24">
          {children}
        </main>
        <Footer />
      </SmoothRouter>
    );
  }

  return (
    <SmoothRouter>
      <Navbar />
      <main className={`${mainClassName} pt-20 sm:pt-24`}>
        {children}
      </main>
      {/* Show footer only when music player is not active or when on mobile - only after mounting */}
      {mounted && (!currentTrack || isMobile) && <Footer />}
    </SmoothRouter>
  );
}
