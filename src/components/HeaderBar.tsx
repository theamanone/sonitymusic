"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SparklesIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { SubscriptionData } from '@/contexts/SubscriptionContext';
import LUXURY_THEME, { luxuryClasses } from '@/styles/luxury-theme';


interface HeaderBarProps {
    subscription: SubscriptionData | null;
    subLoading: boolean;
    selectedModel: string;
    onSelectModel: (model: string) => void;
}

export default function HeaderBar({ subscription, subLoading, selectedModel, onSelectModel }: HeaderBarProps) {
    const [modelMenuOpen, setModelMenuOpen] = useState(false);
    const modelMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
                setModelMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const getPlanBadge = () => {
        if (subLoading) return null;

        if (!subscription) {
            return <span className="text-xs font-medium text-gray-400 italic">Free</span>;
        }
        const planText = subscription.plan === 'premium' ? 'Premium' :
            subscription.plan === 'pro' ? 'Pro' :
                subscription.plan === 'velissa-black' ? 'Velissa Black' :
                    subscription.plan === 'guest' ? 'Guest' : 'Free';
        const planColor = subscription.plan === 'premium' ? 'text-purple-600' :
            subscription.plan === 'pro' ? 'text-amber-600' :
                subscription.plan === 'velissa-black' ? 'text-gray-400' :
                    subscription.plan === 'guest' ? 'text-gray-400' : 'text-gray-400';

        return <span className={`text-xs font-medium italic ${planColor}`}>{planText}</span>;
    };

    return (
        <div className="px-4 md:px-6 py-2 backdrop-blur-2xl bg-white/70 sticky top-0 z-50">
            <div className="flex items-center justify-between">
                {/* Mobile: App Name with Plan Badge */}
                <div className="md:hidden flex flex-col items-start">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">Sonity</span>
                        {getPlanBadge()}
                    </div>
                </div>

                {/* Desktop: Subscription Badge */}
                <div className="hidden md:flex">
                    {!subLoading && subscription ? (
                        <div className="flex items-center gap-3">
                            {subscription.plan === 'free' ? (
                                <Link
                                    href="/pricing"
                                    className={luxuryClasses(
                                        'group relative inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-1.5 rounded-full transition-all duration-300 ease-out hover:scale-[1.02]',
                                        'bg-white/90 hover:bg-white',
                                        LUXURY_THEME.shadows.subtle,
                                        LUXURY_THEME.borders.button,
                                        'text-[#85754E]'
                                    )}
                                >
                                    <SparklesIcon className="w-4 h-4 text-[#85754E]" />
                                    <span>Upgrade to Pro</span>
                                </Link>
                            ) : subscription.plan === 'premium' ? (
                                <div className={luxuryClasses(
                                    'group relative inline-flex items-center gap-2.5 text-sm font-bold px-5 py-1.5 rounded-full transition-all duration-300',
                                    'bg-white/90 hover:bg-white',
                                    LUXURY_THEME.borders.medium,
                                    LUXURY_THEME.shadows.subtle,
                                    'text-[#262626]'
                                )}>
                                    <SparklesIcon className="w-4 h-4 text-[#85754E]" />
                                    <span>Premium</span>
                                </div>
                            ) : subscription.plan === 'velissa-black' ? (
                                <div
                                    className={luxuryClasses(
                                        'group relative inline-flex items-center gap-2.5 text-sm font-bold px-5 py-1.5 rounded-full transition-all duration-300',
                                        'bg-white/90 hover:bg-white',
                                        LUXURY_THEME.borders.button,
                                        LUXURY_THEME.shadows.subtle,
                                        'text-[#85754E]'
                                    )}
                                >
                                    <SparklesIcon className="w-4 h-4 relative z-10 text-[#85754E]" />
                                    <span className="relative z-10">Velissa Black</span>
                                </div>
                            ) : (
                                <div
                                    className={luxuryClasses(
                                        'group relative inline-flex items-center gap-2.5 text-sm font-bold px-5 py-1.5 rounded-full transition-all duration-300',
                                        'bg-white/90 hover:bg-white',
                                        LUXURY_THEME.borders.button,
                                        LUXURY_THEME.shadows.subtle,
                                        'text-[#85754E]'
                                    )}
                                >
                                    <SparklesIcon className="w-4 h-4 relative z-10 text-[#85754E]" />
                                    <span className="relative z-10">Guest</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        !subLoading ? (
                            <Link
                                href="/pricing"
                                className={luxuryClasses(
                                    'group relative inline-flex items-center gap-2.5 text-sm font-semibold px-5 py-1.5 rounded-full transition-all duration-300 ease-out hover:scale-[1.02]',
                                    'bg-white/90 hover:bg-white',
                                    LUXURY_THEME.shadows.subtle,
                                    LUXURY_THEME.borders.button,
                                    'text-[#85754E]'
                                )}
                            >
                                <SparklesIcon className="w-4 h-4 text-[#85754E]" />
                                <span>Upgrade to Pro</span>
                            </Link>
                        ) : (
                            <div className="w-28 h-10 bg-gray-200/60 rounded-full animate-pulse backdrop-blur-sm" />
                        )
                    )}
                </div>

                {/* Desktop Only: Model Selector */}
                <div className="hidden md:block relative" ref={modelMenuRef}>
                    <button
                        type="button"
                        onClick={() => setModelMenuOpen(prev => !prev)}
                        className="group relative overflow-hidden inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300/80 hover:bg-white/95 hover:shadow-md text-sm font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 ease-out"
                        title="Select AI Model"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                            </div>
                            <span className="font-bold">
                                {selectedModel === 'vlsa' ? 'VLSA AI' : selectedModel}
                            </span>
                        </div>
                        <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${modelMenuOpen ? 'rotate-180' : 'rotate-0'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
                    </button>

                    {/* Dropdown - Ultra Modern */}
                    {modelMenuOpen && (
                        <div className="absolute right-0 mt-3 min-w-[280px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-gray-100 ring-1 ring-gray-100/60 z-[9999] overflow-hidden">
                            {/* Active Model */}
                            <button
                                type="button"
                                onClick={() => { onSelectModel('vlsa'); setModelMenuOpen(false); }}
                                className="w-full group relative overflow-hidden flex items-center gap-3 px-5 py-3 text-xs font-medium text-gray-800 hover:bg-gradient-to-r hover:from-[#FFFDF2] hover:to-[#FFF8E1] transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="relative">
                                        <div className={luxuryClasses('w-9 h-9 rounded-2xl flex items-center justify-center', LUXURY_THEME.gradients.primary)}>
                                            <CpuChipIcon className="w-4 h-4 text-[#262626]" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] border-2 border-white rounded-full" />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className="font-semibold text-gray-900 text-sm truncate">VLSA AI</div>
                                        <div className="text-[10px] text-[#85754E] font-medium truncate">Your Fashion Intelligence</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                                    <span className="text-[10px] font-semibold text-[#85754E]">ACTIVE</span>
                                </div>
                            </button>

                            <div className="px-3 py-1">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent" />
                            </div>

                            {/* Coming Soon Models */}
                            <div className="group relative overflow-hidden flex items-center gap-3 px-5 py-3 text-xs text-gray-400 cursor-not-allowed">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                        </svg>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className="font-semibold text-[#262626] text-sm truncate">Sonity Creative</div>
                                        <div className="text-[10px] text-[#85754E] truncate">AI Style Generation & Mood Boards</div>
                                    </div>
                                </div>
                                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500">SOON</span>
                            </div>

                            <div className="group relative overflow-hidden flex items-center gap-3 px-5 py-3 text-xs text-gray-400 cursor-not-allowed">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className="font-semibold text-[#262626] text-sm truncate">Sonity Vision</div>
                                        <div className="text-[10px] text-[#85754E] truncate">Advanced Outfit Analysis & Recognition</div>
                                    </div>
                                </div>
                                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500">SOON</span>
                            </div>

                            <div className="group relative overflow-hidden flex items-center gap-3 px-5 py-3 text-xs text-gray-400 cursor-not-allowed">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className="font-semibold text-[#262626] text-sm truncate">Sonity Flash</div>
                                        <div className="text-[10px] text-[#85754E] truncate">Ultra-Fast Fashion Responses</div>
                                    </div>
                                </div>
                                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500">SOON</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}