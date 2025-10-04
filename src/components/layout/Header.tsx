"use client";

import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ASSETS } from "@/utils/constants/assets.constants";
import { SITE_CONFIG } from "@/config/site.config";
import { useTheme } from "@/components/providers/ThemeProvider";

export const Header: React.FC = () => {
  const { isDark, themeClasses } = useTheme();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    redirect("/");
  };

  return (
    <header
      className={`${themeClasses} fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isDark
          ? "bg-gray-900/95 backdrop-blur-sm"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Professional Logo Section */}
          <button
            onClick={handleLogoClick}
            className={`
              flex items-center space-x-4 
              group relative
              bg-transparent border-none
              cursor-pointer p-0
              transition-all duration-200
              hover:opacity-90
              focus:outline-none
              focus:ring-0 focus:none
              rounded-lg
            `}
          >
            <div className="relative">
              <Image
                src={ASSETS.LOGO.PRIMARY}
                alt={`${SITE_CONFIG.SHORT_NAME} Logo`}
                width={32}
                height={32}
                style={{ width: 'auto', height: 'auto' }}
                className="w-8 h-8 transition-transform duration-200 group-hover:scale-105"
                priority
              />
              {/* Professional subtle glow */}
              <div
                className={`
                absolute -inset-1 rounded-full blur-sm opacity-0 
                group-hover:opacity-30 transition-opacity duration-300
                ${isDark ? "bg-yellow-400/20" : "bg-yellow-600/20"}
              `}
              />
            </div>

            <div className="flex flex-col">
              <h1
                className={`
                text-xl font-medium tracking-wider
                transition-colors duration-200
                ${isDark ? "text-yellow-400" : "text-yellow-600"}
              `}
              >
                {SITE_CONFIG.SHORT_NAME}
              </h1>
              <span
                className={`
                text-xs tracking-wide font-light hidden sm:block
                transition-colors duration-200
                ${isDark ? "text-yellow-400/70" : "text-yellow-600/70"}
              `}
              >
                {SITE_CONFIG.PSYCHOLOGICAL_TRIGGERS.TERTIARY} DEFINED
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
