// components/layout/MobileSidebar.tsx - Right sliding sidebar for mobile (No Authentication)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/utils/constants/assets.constants";
import {
  X,
  Home,
  Music,
  Heart,
  TrendingUp,
  Library,
  Users,
  Settings,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SITE_CONFIG } from "@/config/site.config";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Navigation items
  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/library", label: "Library", icon: Library },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Image
              src={ASSETS.LOGO.PRIMARY}
              alt={SITE_CONFIG.NAME}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {SITE_CONFIG.NAME}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Music Streaming
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 space-y-2">
          <h3 className={cn(
            "text-xs font-bold uppercase tracking-wider mb-4",
            isDark ? "text-gray-400" : "text-gray-500"
          )}>
            Navigation
          </h3>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-colors group",
                isDark ? "hover:bg-white/10" : "hover:bg-gray-50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isDark 
                  ? "text-gray-400 group-hover:text-violet-400" 
                  : "text-gray-600 group-hover:text-violet-600"
              )} />
              <span className={cn(
                "font-medium transition-colors",
                isDark ? "text-gray-200" : "text-gray-900"
              )}>
                {item.label}
              </span>
              <ChevronRight className={cn(
                "w-4 h-4 transition-colors ml-auto",
                isDark 
                  ? "text-gray-400 group-hover:text-violet-400" 
                  : "text-gray-600 group-hover:text-violet-600"
              )} />
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm font-medium",
              isDark ? "text-gray-300" : "text-gray-700"
            )}>
              Theme
            </span>
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark 
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
