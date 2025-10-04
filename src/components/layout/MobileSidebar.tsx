// components/layout/MobileSidebar.tsx - Right sliding sidebar for mobile
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/utils/constants/assets.constants";
import {
  X,
  User,
  Home,
  Music,
  Heart,
  TrendingUp,
  Library,
  Users,
  Settings,
  Crown,
  Bell,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { data: session } = useSession();
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
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const navigationItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: TrendingUp, label: 'Trending', href: '/trending' },
    { icon: Music, label: 'Genres', href: '/genres' },
    { icon: Users, label: 'Artists', href: '/artists' },
    { icon: Library, label: 'Playlists', href: '/playlists' },
    { icon: Heart, label: 'Liked Songs', href: '/liked' },
  ];

  return (
    <div className="z-[100]">
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* iOS 26 Glass Morphism Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[190] transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      style={{
        background: isDark 
          ? 'rgba(17, 24, 39, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderLeft: isDark
          ? '1px solid rgba(156, 163, 175, 0.15)'
          : '1px solid rgba(229, 231, 235, 0.3)',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{
            borderColor: isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(229, 231, 235, 0.3)'
          }}>
            <div className="flex items-center gap-3">
              <Image
                src={ASSETS.LOGO.PRIMARY}
                alt="Sonity"
                width={32}
                height={32}
                style={{ width: 'auto', height: 'auto' }}
                className="rounded-lg"
              />
              <span className={cn(
                "text-xl font-bold",
                isDark ? "text-white" : "text-gray-900"
              )}>Sonity</span>
            </div>
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-xl transition-colors",
                isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-600"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Section */}
          {session?.user && (
            <div className="p-6 border-b border-gray-200/50">
              <a
                href="https://account.veliessa.com/profile"
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                onClick={onClose}
              >
                <div className="relative">
                  {session.user.avatar ? (
                    <Image
                      src={session.user.avatar}
                      alt={session.user.name || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </a>
            </div>
          )}

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
                  isDark 
                    ? "text-gray-200 group-hover:text-violet-400" 
                    : "text-gray-900 group-hover:text-violet-600"
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-gray-200/50 space-y-2">
            {/* Theme Toggle - Always visible */}
            <button
              onClick={toggleTheme}
              className={cn(
                "flex items-center gap-4 p-4 w-full rounded-2xl transition-all",
                isDark 
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              )}
            >
              {isDark ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">Dark Mode</span>
                </>
              )}
            </button>

            <Link
              href="/premium"
              onClick={onClose}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 transition-all"
            >
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Upgrade to Premium</span>
            </Link>
            
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
