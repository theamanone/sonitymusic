"use client";

import React from 'react';
import { SITE_CONFIG } from '@/config/site.config';
import { ASSETS } from '@/utils/constants/assets.constants';
import { Music } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Ultra-compact mobile app footer */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/98 via-gray-900/95 to-gray-900/90 backdrop-blur-3xl border-t border-gray-700/60" />

      <div className="relative z-10 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Minimalist mobile app footer */}
          <div className="flex items-center justify-center gap-2">
            <div className="relative">
              <Image
                src={ASSETS.LOGO.PRIMARY}
                alt="Sonity Logo"
                width={24}
                height={24}
                className="w-6 h-6 rounded-md"
                style={{ width: 'auto', height: 'auto' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="absolute inset-0 w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center hidden">
                <Music className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-sm font-medium text-white">{SITE_CONFIG.NAME}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
