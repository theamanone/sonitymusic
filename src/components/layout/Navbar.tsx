// components/layout/Navbar.tsx - Music Streaming Navbar (No Authentication)
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site.config";
import Image from "next/image";
import { ASSETS } from "@/utils/constants/assets.constants";
import {
  Music,
  Heart,
  Users,
  Home,
  TrendingUp,
  Library,
  Settings,
  Sun,
  Moon,
  Search,
  Menu,
} from 'lucide-react';
import NotificationModal from "@/components/ui/NotificationModal";
import { useTheme } from "@/components/providers/ThemeProvider";
import MobileSidebar from "@/components/layout/MobileSidebar";

export default function Navbar() {
  const { isDark, themeClasses, toggleTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Handle mounting for theme
  useEffect(() => setMounted(true), []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? isDark 
            ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 shadow-lg shadow-black/20' 
            : 'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg shadow-gray-900/10'
          : isDark 
            ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800/30' 
            : 'bg-white/90 backdrop-blur-md border-b border-gray-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    isDark ? 'bg-green-500/20' : 'bg-green-500/10'
                  } group-hover:scale-110`} />
                  <Image
                    src={ASSETS.LOGO.PRIMARY}
                    alt={SITE_CONFIG.NAME}
                    width={40}
                    height={40}
                    className="relative w-10 h-10 rounded-xl object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-xl font-bold transition-colors duration-200 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {SITE_CONFIG.NAME}
                  </h1>
                  <p className={`text-xs transition-colors duration-200 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Music Streaming
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/" className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
              </Link>
              <Link href="/trending" className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </div>
              </Link>
              <Link href="/library" className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Library className="w-4 h-4" />
                  <span>Library</span>
                </div>
              </Link>
              <Link href="/settings" className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search songs, artists, albums..."
                    className={`w-full h-12 px-6 pl-12 pr-4 rounded-xl border transition-colors duration-200 cursor-text focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500/20'
                    } ${isSearchFocused ? 'ring-2 ring-green-500/20' : ''}`}
                  />
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    isSearchFocused
                      ? 'text-green-500'
                      : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              </form>
            </div>

            {/* Right Actions - No Authentication */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`md:hidden p-2 sm:p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
}