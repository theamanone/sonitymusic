"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname } from 'next/navigation';
import { useDocumentEvents, defaultDocumentConfig } from '@/config/documentEvents';
import AuthModal from '@/components/auth/AuthModal';
import { ThemeProvider } from "@/components/providers/ThemeProvider";

interface ClientProviderProps {
  children: ReactNode;
  session?: any;
}

export default function ClientProvider({ children, session }: ClientProviderProps) {
  const isProd = process.env.NODE_ENV === 'production';
  const pathname = usePathname();

  // Smart security based on page type
  const isVideoPage = pathname?.startsWith('/watch/');
  const isUploadPage = pathname?.includes('/upload');
  const isSettingsPage = pathname?.includes('/settings');

  const docEventsConfig = useMemo(() => ({
    ...defaultDocumentConfig,
    preventCopy: isProd && !isVideoPage && !isUploadPage && !isSettingsPage,
    preventCut: isProd && !isUploadPage && !isSettingsPage,
    preventPaste: isProd && !isUploadPage && !isSettingsPage,
    preventContextMenu: isProd && !isVideoPage,
    preventDragStart: isProd,
    preventDrop: isProd && !isUploadPage,
    preventSelectStart: false,
    applyGlobalStyles: false,
  }), [isProd, isVideoPage, isUploadPage, isSettingsPage]);

  useDocumentEvents(docEventsConfig);

  // Console security
  useEffect(() => {
    const anyConsole = console as any;
    if (anyConsole.__clipboardWrapped) return;

    const originalError = console.error;
    anyConsole.__clipboardWrapped = true;
    
    console.error = (...args: any[]) => {
      // Normalize all args to strings when possible for matching
      const strings = args
        .map((a: any) => (typeof a === 'string' ? a : (a?.message || '')) as string)
        .filter(Boolean)
        .map(s => s.toLowerCase());

      const first = (args?.[0]?.toString?.() || '').toLowerCase();

      // Suppress clipboard noise
      if (first.includes('clipboard') || first.includes('writetext')) return;

      // Suppress known benign client warnings/errors (do not show to user)
      const suppressPatterns = [
        'hls error',
        'media error while playing',
        'network error while loading video',
        'missing-data-scroll-behavior',
        'smooth scrolling during route transitions',
      ];

      if (
        suppressPatterns.some(p => first.includes(p)) ||
        strings.some(s => suppressPatterns.some(p => s.includes(p)))
      ) {
        // Downgrade to debug so it’s available for developers but not noisy
        console.debug?.('[suppressed]', ...args);
        return;
      }
      originalError(...args);
    };

    if (isProd) {
      console.clear();
      console.log('%c SONITY Music Platform', 'color: #8b5cf6; font-size: 24px; font-weight: bold');
      console.log('%cUnauthorized access prohibited.', 'color: #8b5cf6; font-size: 14px');
    }

    return () => {
      if (anyConsole.__clipboardWrapped) {
        console.error = originalError;
      }
    };
  }, [isProd]);

  function GlobalAuthGate({ path }: { path: string | null }) {
    const { status } = useSession();
    const [open, setOpen] = useState(false);

    useEffect(() => {
      const publicRoutes = new Set([
        '/', '/pricing', '/privacy', '/terms', '/cookies', '/sitemap.xml', '/about'
      ]);

      const isPublic = !!path && Array.from(publicRoutes).some(r => path === r || path.startsWith(r));

      if (status === 'unauthenticated' && !isPublic) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }, [status, path]);

    return <AuthModal isOpen={open} onClose={() => setOpen(false)} />;
  }

  return (
    <ThemeProvider
      defaultTheme="light"
      defaultVariant="default"
      enableSystem={true}
      storageKey="sonity-theme-config"
    >
      <SessionProvider
        session={session}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
      >
        {children}
        <GlobalAuthGate path={pathname} />
      </SessionProvider>
    </ThemeProvider>
  );
}
