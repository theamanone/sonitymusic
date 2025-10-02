"use client";

import React from 'react';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div className="relative overflow-hidden px-6 py-4 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border-b border-red-200/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-red-500/5" />
      <div className="relative max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-red-800 font-medium text-sm">{message}</div>
        </div>
        <button
          className="group relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 hover:text-red-900 bg-white/80 hover:bg:white/90 rounded-xl border border-red-200/50 hover:border-red-300/80 transition-all duration-300 ease-out hover:scale-105"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Dismiss</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
