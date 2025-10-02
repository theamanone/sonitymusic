"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { SECURITY_CONFIG, SECURITY_EVENTS } from "@/config/security.config";

interface SecurityContextType {
  isSecurityEnabled: boolean;
  config: typeof SECURITY_CONFIG;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecurityEnabled: true,
  config: SECURITY_CONFIG,
});

export const useSecurityContext = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export default function SecurityProvider({
  children,
  enabled = true,
}: SecurityProviderProps) {
  const [blackout, setBlackout] = useState(false);
  const blackoutFor = (ms: number) => {
    if (
      !SECURITY_CONFIG.video.blurOnFocusLoss &&
      !SECURITY_CONFIG.content.blackoutOnEvents
    )
      return;
    setBlackout(true);
    window.setTimeout(() => setBlackout(false), ms);
  };
  useEffect(() => {
    if (!enabled) return;

    // Global security measures
    const handleGlobalContextMenu = (e: MouseEvent) => {
      if (SECURITY_CONFIG.video.disableContextMenu) {
        e.preventDefault();
        return false;
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!SECURITY_CONFIG.content.disableDevTools) return;

      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        SECURITY_EVENTS.onDevToolsOpen();
        return false;
      }

      // Disable Ctrl+S (Save)
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }

      // Proactively handle PrintScreen on keydown for faster blackout
      if (e.key === "PrintScreen") {
        try {
          SECURITY_EVENTS.onScreenshotAttempt();
          if (
            SECURITY_CONFIG.video.clearClipboardOnPrintScreen &&
            navigator?.clipboard?.writeText
          ) {
            navigator.clipboard.writeText("").catch(() => {
              /* swallow */
            });
          }
          blackoutFor(SECURITY_CONFIG.video.blackoutDurationMs ?? 1500);
        } catch {}
      }
    };

    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      try {
        if (e.key === "PrintScreen") {
          SECURITY_EVENTS.onScreenshotAttempt();
          // Try to clear clipboard (may be rejected without user gesture)
          if (
            SECURITY_CONFIG.video.clearClipboardOnPrintScreen &&
            navigator?.clipboard?.writeText
          ) {
            navigator.clipboard.writeText("").catch(() => {
              /* swallow NotAllowedError */
            });
          }
          // Blackout the UI briefly like streaming apps
          blackoutFor(SECURITY_CONFIG.video.blackoutDurationMs ?? 1500);
        }
      } catch {
        // Never throw from global handler
      }
    };

    const handleVisibilityChange = () => {
      try {
        if (document.hidden && SECURITY_CONFIG.video.blurOnFocusLoss) {
          SECURITY_EVENTS.onFocusLoss();
          // Blur and pause all videos
          const videos = document.querySelectorAll("video");
          videos.forEach((video) => {
            (video as HTMLVideoElement).style.filter = "blur(10px)";
            // Do not pause on background; allow audio/video to continue
          });
          // Do NOT blackout on visibility change/minimize. Only blur/pause.
        } else {
          // Remove blur from videos
          const videos = document.querySelectorAll("video");
          videos.forEach((video) => {
            (video as HTMLVideoElement).style.filter = "none";
          });
        }
      } catch {
        // ignore
      }
    };

    // Add global event listeners
    document.addEventListener("contextmenu", handleGlobalContextMenu);
    document.addEventListener("keydown", handleGlobalKeyDown);
    document.addEventListener("keyup", handleGlobalKeyUp);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Disable text selection on body for video content
    if (SECURITY_CONFIG.video.disableTextSelection) {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    }

    // DevTools detection (basic)
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      try {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devtools.open) {
            devtools.open = true;
            SECURITY_EVENTS.onDevToolsOpen();
            if (SECURITY_CONFIG.content.blackoutOnEvents)
              blackoutFor(SECURITY_CONFIG.video.blackoutDurationMs ?? 1500);
          }
        } else {
          devtools.open = false;
        }
      } catch {
        // ignore
      }
    }, 500);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleGlobalContextMenu);
      document.removeEventListener("keydown", handleGlobalKeyDown);
      document.removeEventListener("keyup", handleGlobalKeyUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Reset body styles
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, [enabled]);

  return (
    <SecurityContext.Provider
      value={{ isSecurityEnabled: enabled, config: SECURITY_CONFIG }}
    >
      {children}
      {blackout && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm transition-opacity duration-200"
          aria-hidden
        />
      )}
    </SecurityContext.Provider>
  );
}
