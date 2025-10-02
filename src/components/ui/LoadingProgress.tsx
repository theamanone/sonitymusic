"use client";

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function LoadingProgressContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 30;
        });
      }, 100);

      return () => clearInterval(interval);
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Listen for route changes
    handleStart();
    
    // Complete loading after a short delay (simulating page load)
    const timer = setTimeout(handleComplete, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 transition-all duration-300 ease-out shadow-lg"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
        }}
      />
    </div>
  );
}

export default function LoadingProgress() {
  return (
    <Suspense fallback={null}>
      <LoadingProgressContent />
    </Suspense>
  );
}
