"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Bell,
  Palette,
  Save,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  Clock,
  Play,
  Volume2,
} from "lucide-react";

export default function SettingsClient() {
  const { data: session } = useSession();
  const { 
    isDark, 
    currentTheme, 
    setTheme, 
    setVariant, 
    toggleTheme, 
    updateConfig,
    themeClasses 
  } = useTheme();

  const [activeTab, setActiveTab] = useState<"notifications" | "playback">("notifications");

  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      videoProcessingNotifications: true,
      commentNotifications: true,
      likeNotifications: false,
    },
    playback: {
      autoplay: true,
      autoplayNext: true,
      defaultQuality: 'auto',
      playbackSpeed: '1.0',
      captions: false,
      volume: 75,
    },
  });

  const handleSave = () => {
    console.log("Sonity settings saved:", settings, currentTheme);
    // Save to your backend API
  };

  const themeOptions = [
    { value: 'system', label: 'Follow System', icon: Monitor, desc: 'Matches your device theme' },
    { value: 'light', label: 'Light Mode', icon: Sun, desc: 'Always use light theme' },
    { value: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Always use dark theme' },
    { value: 'auto', label: 'Smart Mode', icon: Clock, desc: 'Light during day, dark at night' },
  ];

  const variantOptions = [
    { value: 'default', label: 'Default', desc: 'Standard Sonity experience' },
    { value: 'high-contrast', label: 'High Contrast', desc: 'Enhanced accessibility' },
    { value: 'compact', label: 'Compact', desc: 'Dense layout for power users' },
    { value: 'comfortable', label: 'Comfortable', desc: 'Spacious layout for relaxed viewing' },
  ];

  return (
    <div className={`min-h-screen ${isDark 
      ? 'bg-gradient-to-br from-gray-950 via-black to-gray-950' 
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'}`}>
              <SettingsIcon className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                Platform Settings
              </h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Customize your Sonity experience
              </p>
            </div>
          </div>
          
          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
              isDark 
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex space-x-1 mb-8 p-1 rounded-2xl backdrop-blur-xl border ${
          isDark 
            ? 'bg-white/[0.05] border-white/[0.08]' 
            : 'bg-black/[0.05] border-black/[0.08]'
        }`}>
          {[
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "playback", label: "Playback & Appearance", icon: Palette },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === id
                  ? isDark 
                    ? "bg-white text-black shadow-lg" 
                    : "bg-black text-white shadow-lg"
                  : isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/[0.08]"
                    : "text-gray-600 hover:text-black hover:bg-black/[0.08]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`backdrop-blur-xl border rounded-2xl p-8 ${
          isDark 
            ? 'bg-white/[0.05] border-white/[0.08]' 
            : 'bg-black/[0.05] border-black/[0.08]'
        }`}>
          
          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'videoProcessingNotifications', label: 'Video Processing', desc: 'Notify when your videos are processed' },
                  { key: 'commentNotifications', label: 'Comments', desc: 'Notify when someone comments on your videos' },
                  { key: 'likeNotifications', label: 'Likes & Reactions', desc: 'Notify when someone likes your content' },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
                    }`}
                  >
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                        {label}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[key as keyof typeof settings.notifications]}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              [key]: e.target.checked,
                            },
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playback & Appearance Tab */}
          {activeTab === "playback" && (
            <div className="space-y-8">
              <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                Playback & Appearance
              </h2>

              {/* Theme Settings */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`}>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                  Theme Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as any)}
                      className={`flex items-start space-x-4 p-4 rounded-xl border-2 transition-all text-left ${
                        currentTheme.mode === option.value
                          ? 'border-red-500 bg-red-500/10'
                          : isDark 
                            ? 'border-white/[0.12] hover:border-white/[0.24]' 
                            : 'border-black/[0.12] hover:border-black/[0.24]'
                      }`}
                    >
                      <option.icon className={`w-6 h-6 mt-1 ${
                        currentTheme.mode === option.value 
                          ? 'text-red-500' 
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div>
                        <div className={`font-medium ${
                          currentTheme.mode === option.value 
                            ? 'text-red-500' 
                            : isDark ? 'text-white' : 'text-black'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Theme Variants */}
                <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
                  Appearance Style
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variantOptions.map((variant) => (
                    <button
                      key={variant.value}
                      onClick={() => setVariant(variant.value as any)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        currentTheme.variant === variant.value
                          ? 'border-red-500 bg-red-500/10'
                          : isDark 
                            ? 'border-white/[0.12] hover:border-white/[0.24]' 
                            : 'border-black/[0.12] hover:border-black/[0.24]'
                      }`}
                    >
                      <div className={`font-medium ${
                        currentTheme.variant === variant.value 
                          ? 'text-red-500' 
                          : isDark ? 'text-white' : 'text-black'
                      }`}>
                        {variant.label}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {variant.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Playback Settings */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`}>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                  Video Playback
                </h3>
                <div className="space-y-6">
                  {/* Quality Setting */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                        Default Video Quality
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose your preferred playback quality
                      </p>
                    </div>
                    <select
                      value={settings.playback.defaultQuality}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          playback: { ...prev.playback, defaultQuality: e.target.value },
                        }))
                      }
                      className={`border rounded-lg px-3 py-2 focus:outline-none focus:border-red-500/50 ${
                        isDark
                          ? 'bg-white/[0.08] border-white/[0.12] text-white'
                          : 'bg-black/[0.08] border-black/[0.12] text-black'
                      }`}
                    >
                      <option value="auto">Auto (Recommended)</option>
                      <option value="2160p">4K (2160p)</option>
                      <option value="1440p">2K (1440p)</option>
                      <option value="1080p">Full HD (1080p)</option>
                      <option value="720p">HD (720p)</option>
                      <option value="480p">SD (480p)</option>
                    </select>
                  </div>

                  {/* Autoplay Settings */}
                  {[
                    { key: 'autoplay', label: 'Autoplay Videos', desc: 'Start playing videos automatically' },
                    { key: 'autoplayNext', label: 'Autoplay Next Video', desc: 'Automatically play the next video in queue' },
                    { key: 'captions', label: 'Show Captions', desc: 'Display captions when available' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                          {label}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {desc}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.playback[key as keyof typeof settings.playback] as boolean}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              playback: { ...prev.playback, [key]: e.target.checked },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 ${
                          isDark ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t mt-8" style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
          }}>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-red-500/30 transform hover:scale-[1.02]"
            >
              <Save className="w-5 h-5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
