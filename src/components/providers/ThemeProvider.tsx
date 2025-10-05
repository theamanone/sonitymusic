"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system' | 'auto';
type ThemeVariant = 'default' | 'high-contrast' | 'compact' | 'comfortable';

interface ThemeConfig {
  mode: ThemeMode;
  variant: ThemeVariant;
  animations: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

interface ThemeContextType {
  theme: ThemeMode;
  variant: ThemeVariant;
  isDark: boolean;
  isLight: boolean;
  mounted: boolean;
  setTheme: (theme: ThemeMode) => void;
  setVariant: (variant: ThemeVariant) => void;
  toggleTheme: () => void;
  updateConfig: (updates: Partial<ThemeConfig>) => void;
  currentTheme: ThemeConfig;
  themeClasses: string;
}

// ✅ PROPER INTERFACE WITH ALL PROPS
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  defaultVariant?: ThemeVariant;
  enableSystem?: boolean;
  storageKey?: string;
  forcedTheme?: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// ✅ HYDRATION-SAFE SCRIPT
const THEME_SCRIPT = (storageKey: string) => `
(function() {
  try {
    // Try to get theme from new storage key first
    let stored = localStorage.getItem(storageKey);
    
    // If not found, try to migrate from old key
    if (!stored) {
      // Migration from old theme keys
      const oldKeys = ['veliessa-theme-config'];
      for (const oldKey of oldKeys) {
        const oldStored = localStorage.getItem(oldKey);
        if (oldStored) {
          localStorage.setItem(storageKey, oldStored);
          stored = oldStored;
          localStorage.removeItem(oldKey);
          break;
        }
      }
    }
    
    const config = stored ? JSON.parse(stored) : { mode: 'system', variant: 'default' };
    
    let resolvedMode = 'dark';
    if (config.mode === 'system') {
      resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (config.mode === 'auto') {
      const hour = new Date().getHours();
      resolvedMode = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    } else {
      resolvedMode = config.mode;
    }
    
    document.documentElement.classList.add(resolvedMode);
    document.documentElement.classList.add('theme-' + (config.variant || 'default'));
    document.documentElement.setAttribute('data-theme', resolvedMode);
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.add('theme-default');
  }
})();
`;

function getStoredConfig(): ThemeConfig {
  if (typeof window === 'undefined') {
    return {
      mode: 'system',
      variant: 'default',
      animations: true,
      reducedMotion: false,
      fontSize: 'medium',
      borderRadius: 'medium'
    };
  }

  try {
    const stored = localStorage.getItem('sonity-theme-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        mode: parsed.mode || 'system',
        variant: parsed.variant || 'default',
        animations: parsed.animations !== false,
        reducedMotion: parsed.reducedMotion === true,
        fontSize: parsed.fontSize || 'medium',
        borderRadius: parsed.borderRadius || 'medium'
      };
    }
  } catch (error) {
    console.warn('Failed to parse theme config:', error);
  }

  return {
    mode: 'system',
    variant: 'default',
    animations: true,
    reducedMotion: false,
    fontSize: 'medium',
    borderRadius: 'medium'
  };
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  
  switch (mode) {
    case 'system':
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    case 'auto':
      const hour = new Date().getHours();
      return (hour >= 6 && hour < 18) ? 'light' : 'dark';
    default:
      return mode;
  }
}

// ✅ PROPERLY TYPED COMPONENT
export function ThemeProvider({ 
  children,
  defaultTheme = 'system',
  defaultVariant = 'default',
  enableSystem = true,
  storageKey = 'sonity-theme-config',
  forcedTheme
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<ThemeConfig>(() => getStoredConfig());
  
  const resolvedTheme = resolveTheme(config.mode);
  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    setMounted(true);
    const storedConfig = getStoredConfig();
    setConfig(storedConfig);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Clear previous classes
    root.classList.remove('light', 'dark', 'theme-default', 'theme-high-contrast', 'theme-compact', 'theme-comfortable');
    
    // Apply new classes
    root.classList.add(resolvedTheme);
    root.classList.add(`theme-${config.variant}`);
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-variant', config.variant);
    
    // ✅ HANDLE HIGH-CONTRAST VARIANT COLORS
    if (config.variant === 'high-contrast') {
      root.style.setProperty('--bg-primary', isDark ? '#000000' : '#ffffff');
      root.style.setProperty('--text-primary', isDark ? '#ffffff' : '#000000');
    } else {
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--text-primary');
    }
    
    localStorage.setItem('sonity-theme-config', JSON.stringify(config));
  }, [mounted, config, resolvedTheme, isDark]);

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      localStorage.setItem('sonity-theme-config', JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const setTheme = (mode: ThemeMode) => updateConfig({ mode });
  const setVariant = (variant: ThemeVariant) => updateConfig({ variant });
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const themeClasses = [
    `theme-${resolvedTheme}`,
    `variant-${config.variant}`,
    config.animations ? 'animations-enabled' : 'animations-disabled',
    `font-size-${config.fontSize}`,
    `border-radius-${config.borderRadius}`,
    mounted ? 'theme-mounted' : 'theme-loading'
  ].join(' ');

  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: forcedTheme || config.mode,
          variant: config.variant,
          isDark: forcedTheme ? forcedTheme === 'dark' : isDark,
          isLight: forcedTheme ? forcedTheme === 'light' : !isDark,
          mounted,
          setTheme,
          setVariant,
          toggleTheme,
          updateConfig,
          currentTheme: config,
          themeClasses: `theme-${forcedTheme || config.mode} variant-${config.variant} ${mounted ? '' : 'theme-loading'}`
        }}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT(storageKey) }} />
        <div className={`theme-${forcedTheme || (mounted ? config.mode : 'light')} variant-${config.variant} ${mounted ? '' : 'theme-loading'}`}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }
  return (
    <ThemeContext.Provider value={{
      theme: config.mode,
      variant: config.variant,
      isDark,
      isLight,
      mounted,
      setTheme,
      setVariant,
      toggleTheme,
      updateConfig,
      currentTheme: config,
      themeClasses
    }}>
      <div className={`sonity-theme-root ${themeClasses}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
