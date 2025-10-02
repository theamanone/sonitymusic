"use client";

import { useState } from 'react';
import { X, Bell, Check, AlertCircle, Info, Crown } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'premium';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { isDark, themeClasses } = useTheme();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Video Processing Complete',
      message: 'Your video "Advanced React Patterns" has been successfully processed and is now live.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      action: {
        label: 'View Video',
        href: '/watch/video-id'
      }
    },
    {
      id: '2',
      type: 'premium',
      title: 'Premium Feature Available',
      message: 'Unlock 4K streaming and advanced analytics with Premium membership.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      action: {
        label: 'Upgrade Now',
        href: '/premium'
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'New Studio Members',
      message: 'You have 5 new studio members this week! Your content is growing.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      action: {
        label: 'View Analytics',
        href: '/dashboard'
      }
    },
    {
      id: '4',
      type: 'warning',
      title: 'Storage Limit Warning',
      message: 'You are using 85% of your storage quota. Consider upgrading or removing old content.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <Check className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-600`} />;
      case 'premium':
        return <Crown className={`${iconClass} text-yellow-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getNotificationColors = (type: string, isRead: boolean) => {
    if (isRead) {
      return isDark 
        ? 'bg-gray-800/30 border-gray-700/50' 
        : 'bg-gray-50/50 border-gray-200/50';
    }

    switch (type) {
      case 'success':
        return isDark 
          ? 'bg-green-900/20 border-green-800/30' 
          : 'bg-green-50 border-green-200';
      case 'warning':
        return isDark 
          ? 'bg-yellow-900/20 border-yellow-800/30' 
          : 'bg-yellow-50 border-yellow-200';
      case 'premium':
        return isDark 
          ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-800/30' 
          : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300';
      default:
        return isDark 
          ? 'bg-blue-900/20 border-blue-800/30' 
          : 'bg-blue-50 border-blue-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${themeClasses}`}>
      <div className="fixed inset-0 flex items-start justify-center pt-16 px-4">
        {/* Professional Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Professional Modal */}
        <div className={`relative w-full max-w-md border rounded-2xl transition-all duration-300 ${
          isDark 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          
          {/* Clean Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                {unreadCount > 0 && (
                  <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isDark ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {unreadCount}
                  </div>
                )}
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-sm font-medium cursor-pointer transition-colors duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Professional Content */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className={`w-12 h-12 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No Notifications
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors duration-200 cursor-default ${
                      isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Professional Icon */}
                      <div className={`flex-shrink-0 p-2 rounded-lg border mt-1 ${getNotificationColors(notification.type, notification.read)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Notification Content */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold mb-1 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`text-sm leading-relaxed mb-3 ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                          </div>
                          
                          {/* Unread Indicator */}
                          {!notification.read && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-3 mt-2 ${
                              isDark ? 'bg-blue-500' : 'bg-blue-600'
                            }`} />
                          )}
                        </div>

                        {/* Professional Actions */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          <div className="flex items-center space-x-3">
                            {notification.action && (
                              <a
                                href={notification.action.href}
                                className={`text-xs font-semibold cursor-pointer transition-colors duration-200 ${
                                  isDark 
                                    ? 'text-blue-400 hover:text-blue-300' 
                                    : 'text-blue-600 hover:text-blue-700'
                                }`}
                                onClick={() => {
                                  markAsRead(notification.id);
                                  onClose();
                                }}
                              >
                                {notification.action.label}
                              </a>
                            )}
                            
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className={`text-xs font-medium cursor-pointer transition-colors duration-200 ${
                                  isDark 
                                    ? 'text-gray-400 hover:text-white' 
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                              >
                                Mark read
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className={`text-xs font-medium cursor-pointer transition-colors duration-200 ${
                                isDark 
                                  ? 'text-gray-500 hover:text-red-400' 
                                  : 'text-gray-500 hover:text-red-600'
                              }`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Professional Footer */}
          <div className={`p-4 border-t text-center ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className={`text-sm font-semibold cursor-pointer transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              View all notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
