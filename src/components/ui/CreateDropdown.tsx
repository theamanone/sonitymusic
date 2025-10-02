"use client";

import { useState, useRef, useEffect } from 'react';
import { Plus, Video, Upload, Mic, Camera, FileText, Zap, ChevronDown } from 'lucide-react';

interface CreateDropdownProps {
  className?: string;
}

export default function CreateDropdown({ className = "" }: CreateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createOptions = [
    {
      icon: Video,
      title: 'Upload Video',
      description: 'Share your video content',
      href: '/upload',
      color: 'text-red-400'
    },
    {
      icon: Camera,
      title: 'Go Live',
      description: 'Stream live to your audience',
      href: '/live/create',
      color: 'text-green-400'
    },
    {
      icon: Mic,
      title: 'Audio Only',
      description: 'Upload podcast or audio',
      href: '/upload?type=audio',
      color: 'text-blue-400'
    },
    {
      icon: FileText,
      title: 'Create Course',
      description: 'Build educational content',
      href: '/courses/create',
      color: 'text-purple-400'
    },
    {
      icon: Zap,
      title: 'Quick Upload',
      description: 'Fast upload with defaults',
      href: '/upload?quick=true',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-indigo-500/30 transform hover:scale-[1.02] border border-indigo-500/20 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Create</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-black/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl shadow-2xl py-2 z-50">
          <div className="px-4 py-3 border-b border-white/[0.08]">
            <h3 className="text-lg font-bold text-white">Create Content</h3>
            <p className="text-sm text-gray-400">Choose what you want to create</p>
          </div>
          
          <div className="py-2">
            {createOptions.map((option, index) => (
              <a
                key={index}
                href={option.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-6 py-4 text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 group cursor-pointer"
              >
                <div className={`p-2 rounded-xl bg-white/[0.08] mr-4 group-hover:bg-white/[0.12] transition-colors duration-200`}>
                  <option.icon className={`w-5 h-5 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-white">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">
                    {option.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="px-6 py-3 border-t border-white/[0.08]">
            <p className="text-xs text-gray-500 text-center">
              Need help? Check our <a href="/help/creator-guide" className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Creator Guide</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
