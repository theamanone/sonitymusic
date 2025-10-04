// app/profile/page.tsx - Simple Profile & Settings Page
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, User, Settings, Music, Bell, Shield, LogOut, Crown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  const profileSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Edit Profile', description: 'Update your name, avatar, and bio' },
        { label: 'Music Preferences', description: 'Set your favorite genres and artists' },
        { label: 'Listening History', description: 'View your recently played tracks' }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      items: [
        { label: 'Audio Quality', description: 'Choose streaming quality preferences' },
        { label: 'Download Settings', description: 'Manage offline downloads' },
        { label: 'Playback Settings', description: 'Crossfade, gapless, and more' }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', description: 'New releases, recommendations' },
        { label: 'Email Updates', description: 'Weekly summaries and news' },
        { label: 'Social Activity', description: 'Friend activity and shares' }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Privacy Settings', description: 'Control who sees your activity' },
        { label: 'Data & Privacy', description: 'Manage your data and privacy' },
        { label: 'Connected Apps', description: 'Third-party app permissions' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />
      
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Music
          </Link>

          {/* Profile Header */}
          <div 
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 mb-8 shadow-xl"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)'
            }}
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {session?.user?.name || 'Music Lover'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {session?.user?.email || 'user@sonity.com'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30">
                    <span className="text-sm font-semibold text-violet-800 dark:text-violet-300 flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Free Plan
                    </span>
                  </div>
                  <Link 
                    href="/premium"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="grid gap-6">
            {profileSections.map((section) => (
              <div
                key={section.id}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 rounded-3xl p-6 shadow-xl"
                style={{
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {section.items.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sign Out */}
          <div 
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 rounded-3xl p-6 mt-6 shadow-xl"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)'
            }}
          >
            <button className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
