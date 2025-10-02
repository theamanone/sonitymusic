// components/music-player/LyricsView.tsx
"use client";

import { cn } from "@/lib/utils";

const mockLyrics = [
  { time: 0, text: "♪ Instrumental intro ♪" },
  { time: 10, text: "Ranjheya ve, tu kinne sohne" },
  { time: 15, text: "Dil de vich vasde" },
  { time: 20, text: "Tere bina jeena mushkil" },
  { time: 25, text: "Har pal tenu yaad karde" },
  { time: 30, text: "♪ Music ♪" },
  { time: 35, text: "Mohabbat di kahani" },
  { time: 40, text: "Likhde assi naal tere" },
  { time: 45, text: "Dil vich tu hi tu" },
  { time: 50, text: "Saade khwaaban de vich" },
];

interface LyricsViewProps {
  currentIndex: number;
  maxHeight?: number;
  className?: string;
}

export default function LyricsView({ 
  currentIndex, 
  maxHeight = 420,
  className 
}: LyricsViewProps) {
  return (
    <div className={cn("flex-1 flex flex-col items-center justify-center mb-8 sm:mb-12 px-4 sm:px-8", className)}>
      <div
        className="w-full max-w-2xl overflow-y-auto hide-scrollbar"
        style={{ maxHeight }}
      >
        <div className="space-y-3 sm:space-y-4">
          {mockLyrics.map((lyric, index) => (
            <div
              key={index}
              className={cn(
                "text-center transition-all duration-300 px-3 sm:px-4 py-2 rounded-2xl cursor-pointer",
                index === currentIndex
                  ? "text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 scale-110"
                  : index < currentIndex
                  ? "text-lg sm:text-xl text-gray-400"
                  : "text-lg sm:text-xl text-gray-600"
              )}
            >
              {lyric.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
