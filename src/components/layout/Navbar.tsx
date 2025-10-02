// components/layout/Navbar.tsx - Music Streaming Navbar
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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
  User,
  Crown,
  ChevronDown,
  Bell,
} from 'lucide-react';
import NotificationModal from "@/components/ui/NotificationModal";
import { useTheme } from "@/components/providers/ThemeProvider";
import MobileSidebar from "@/components/layout/MobileSidebar";

export default function Navbar() {
  const { data: session } = useSession();
  const { isDark, themeClasses, toggleTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      // Mobile menu removed - using sidebar instead
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isPremiumUser = false;

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-transparent" />
    );
  }

  return (
    <>
      {/* Music Streaming Navigation Bar */}
      <nav className={`${themeClasses} fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-gray-900/95 backdrop-blur-3xl border-b border-gray-700/60 shadow-xl"
            : "bg-white/95 backdrop-blur-3xl border-b border-gray-200/60 shadow-xl"
          : isDark
            ? "bg-gray-900/80 backdrop-blur-2xl"
            : "bg-white/80 backdrop-blur-2xl"
      }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-[60px] sm:h-[70px]">

            {/* Logo & Navigation */}
            <div className="flex items-center space-x-6 lg:space-x-8">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="relative">
                  <Image
                    src={ASSETS.LOGO.PRIMARY}
                    alt="Sonity Logo"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all duration-300 group-hover:scale-110"
                    style={{ width: 'auto', height: 'auto' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="absolute inset-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg items-center justify-center hidden">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                </div>
                {/* App Name - Show on mobile and larger screens */}
                <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {SITE_CONFIG.NAME}
                </span>
              </Link>

              {/* Music Navigation Links */}
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  href="/"
                  className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-200 ${
                    isDark
                      ? 'text-white bg-gray-800 hover:bg-gray-700'
                      : 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/discover"
                  className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-200 ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Discover</span>
                </Link>

                <Link
                  href="/library"
                  className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-200 ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Library className="w-4 h-4" />
                  <span>Library</span>
                </Link>

                <Link
                  href="/genres"
                  className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-200 ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>Genres</span>
                </Link>

                <Link
                  href="/artists"
                  className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors duration-200 ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Artists</span>
                </Link>
              </div>
            </div>

            {/* Music Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
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

            {/* Music Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {session ? (
                <>
                  {/* Music User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 group ${
                        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="relative">
                        {session.user?.avatar ? (
                          <Image
                            src={session.user.avatar}
                            alt="Profile"
                            width={36}
                            height={36}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200 group-hover:border-green-500"
                          />
                        ) : (
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                            isDark
                              ? 'bg-gray-700 border-gray-600 group-hover:border-green-500'
                              : 'bg-gray-200 border-gray-300 group-hover:border-green-500'
                          }`}>
                            <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>
                              {session.user?.name?.charAt(0) || "U"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="hidden xl:block text-left">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {session.user?.name}
                        </p>
                        {isPremiumUser && (
                          <p className="text-xs text-yellow-600 flex items-center">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </p>
                        )}
                      </div>

                      <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${
                        isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
                      }`} />
                    </button>

                    {/* Music User Menu */}
                    {isUserMenuOpen && (
                      <div className={`absolute right-0 mt-2 w-56 rounded-3xl border shadow-xl z-50 transition-all duration-300 backdrop-blur-2xl ${
                        isDark
                          ? 'bg-gray-900/90 border-gray-700/50'
                          : 'bg-white/90 border-gray-200/50'
                      }`}>

                        {/* User Header - Enhanced Glass */}
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/60'}`}>
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              {session.user?.avatar ? (
                                <Image
                                  src={session.user.avatar}
                                  alt="Profile"
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                                  style={{ width: 'auto', height: 'auto' }}
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-white/20 ${
                                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                    {session.user?.name?.charAt(0) || "U"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {session.user?.name}
                              </h3>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Premium Member
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Main Menu Items - Enhanced Glass */}
                        <div className="py-3">
                          <Link
                            href="/profile"
                            className={`flex items-center px-6 py-3 cursor-pointer transition-colors duration-200 ${
                              isDark
                                ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                            }`}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            <span className="font-medium">Profile</span>
                          </Link>

                          <Link
                            href="/settings"
                            className={`flex items-center px-6 py-3 cursor-pointer transition-colors duration-200 ${
                              isDark
                                ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                            }`}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            <span className="font-medium">Settings</span>
                          </Link>
                        </div>

                        {/* Direct Profile Link */}
                        <div className={`border-t pt-3 ${isDark ? 'border-gray-700/50' : 'border-gray-200/60'}`}>
                          <a
                            href="https://account.veliessa.com/profile"
                            className="flex items-center w-full px-6 py-3 text-violet-600 hover:text-violet-500 hover:bg-violet-50/50 cursor-pointer transition-colors duration-200 rounded-b-3xl"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            <span className="font-medium">Profile & Settings</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <a
                    href={`${SITE_CONFIG.AUTH_URL}/login`}
                    className={`font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-lg cursor-pointer transition-colors duration-200 text-sm sm:text-base ${
                      isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Sign In
                  </a>
                </div>
              )}

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

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </nav>

      {/* Fixed spacer to prevent content jump */}
      <div className="h-[60px] sm:h-[70px] md:h-[80px]" />
    </>
  );
}
