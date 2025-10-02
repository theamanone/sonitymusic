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
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { data: session } = useSession();
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[300] transform transition-transform duration-300 ease-out",
        "bg-white/95 backdrop-blur-3xl border-l border-gray-200/50 shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <Image
                src={ASSETS.LOGO.PRIMARY}
                alt="Sonity"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">Sonity</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
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
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
                <span className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-gray-200/50 space-y-2">
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
    </>
  );
}
