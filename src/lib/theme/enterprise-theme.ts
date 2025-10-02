/**
 * Enterprise-Grade Theme System for Large Applications
 * Optimized for performance, scalability, and maintainability
 */

export type ThemeMode = 'light' | 'dark' | 'system' | 'auto';
export type ThemeVariant = 'default' | 'high-contrast' | 'compact' | 'comfortable';

export interface ThemeConfig {
  mode: ThemeMode;
  variant: ThemeVariant;
  customColors?: Record<string, string>;
  animations: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

export interface ThemeState {
  config: ThemeConfig;
  resolvedMode: 'light' | 'dark';
  mounted: boolean;
  systemPreference: 'light' | 'dark';
}

class EnterpriseThemeManager {
  private static instance: EnterpriseThemeManager;
  private state: ThemeState;
  private listeners: Set<(state: ThemeState) => void> = new Set();
  private mediaQuery: MediaQueryList | null = null;
  private storageKey = 'sonity-theme-config';

  private constructor() {
    this.state = {
      config: this.getDefaultConfig(),
      resolvedMode: 'dark',
      mounted: false,
      systemPreference: 'dark'
    };
  }

  static getInstance(): EnterpriseThemeManager {
    if (!EnterpriseThemeManager.instance) {
      EnterpriseThemeManager.instance = new EnterpriseThemeManager();
    }
    return EnterpriseThemeManager.instance;
  }

  private getDefaultConfig(): ThemeConfig {
    return {
      mode: 'system',
      variant: 'default',
      animations: true,
      reducedMotion: false,
      fontSize: 'medium',
      borderRadius: 'medium'
    };
  }

  initialize(): void {
    if (typeof window === 'undefined') return;

    // Load saved configuration
    this.loadFromStorage();

    // Set up system preference detection
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.state.systemPreference = this.mediaQuery.matches ? 'dark' : 'light';
    this.mediaQuery.addEventListener('change', this.handleSystemChange.bind(this));

    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.state.config.reducedMotion = reducedMotionQuery.matches;
    reducedMotionQuery.addEventListener('change', (e) => {
      this.updateConfig({ reducedMotion: e.matches });
    });

    // Apply initial theme
    this.updateResolvedMode();
    this.applyTheme();
    this.state.mounted = true;
    this.notifyListeners();
  }

  private handleSystemChange(e: MediaQueryListEvent): void {
    this.state.systemPreference = e.matches ? 'dark' : 'light';
    if (this.state.config.mode === 'system') {
      this.updateResolvedMode();
      this.applyTheme();
      this.notifyListeners();
    }
  }

  private updateResolvedMode(): void {
    switch (this.state.config.mode) {
      case 'system':
        this.state.resolvedMode = this.state.systemPreference;
        break;
      case 'auto':
        // Auto mode: light during day, dark during night
        const hour = new Date().getHours();
        this.state.resolvedMode = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        break;
      default:
        this.state.resolvedMode = this.state.config.mode;
    }
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const { resolvedMode, config } = this.state;
    const root = document.documentElement;

    // Set theme mode
    root.setAttribute('data-theme', resolvedMode);
    root.setAttribute('data-theme-variant', config.variant);

    // Set theme classes for compatibility
    root.classList.toggle('dark', resolvedMode === 'dark');
    root.classList.toggle('light', resolvedMode === 'light');

    // Apply variant classes
    root.classList.remove('theme-default', 'theme-high-contrast', 'theme-compact', 'theme-comfortable');
    root.classList.add(`theme-${config.variant}`);

    // Apply font size
    root.setAttribute('data-font-size', config.fontSize);

    // Apply border radius
    root.setAttribute('data-border-radius', config.borderRadius);

    // Apply custom colors
    if (config.customColors) {
      Object.entries(config.customColors).forEach(([key, value]) => {
        root.style.setProperty(`--custom-${key}`, value);
      });
    }

    // Handle animations
    if (!config.animations || config.reducedMotion) {
      root.style.setProperty('--animation-duration', '0ms');
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = resolvedMode === 'dark' ? '#0f172a' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }

  updateConfig(updates: Partial<ThemeConfig>): void {
    this.state.config = { ...this.state.config, ...updates };
    this.updateResolvedMode();
    this.applyTheme();
    this.saveToStorage();
    this.notifyListeners();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const config = JSON.parse(stored);
        this.state.config = { ...this.getDefaultConfig(), ...config };
      }
    } catch (error) {
      console.warn('Failed to load theme config from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state.config));
    } catch (error) {
      console.warn('Failed to save theme config to storage:', error);
    }
  }

  subscribe(listener: (state: ThemeState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  getState(): ThemeState {
    return { ...this.state };
  }

  // Utility methods for components
  getThemeClasses() {
    const { resolvedMode, config } = this.state;
    return {
      isDark: resolvedMode === 'dark',
      isLight: resolvedMode === 'light',
      variant: config.variant,
      fontSize: config.fontSize,
      borderRadius: config.borderRadius,
      animations: config.animations && !config.reducedMotion
    };
  }

  // CSS-in-JS style generator
  getStyles() {
    const { resolvedMode, config } = this.state;
    return {
      backgroundColor: `var(--bg-primary)`,
      color: `var(--text-primary)`,
      fontSize: config.fontSize === 'small' ? '14px' : config.fontSize === 'large' ? '18px' : '16px',
      transition: config.animations && !config.reducedMotion ? 'all var(--transition-normal)' : 'none'
    };
  }

  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemChange.bind(this));
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const themeManager = EnterpriseThemeManager.getInstance();

// React hooks and utilities
export function useEnterpriseTheme() {
  if (typeof window === 'undefined') {
    return {
      state: {
        config: themeManager.getState().config,
        resolvedMode: 'dark' as const,
        mounted: false,
        systemPreference: 'dark' as const
      },
      updateConfig: () => {},
      classes: {
        isDark: true,
        isLight: false,
        variant: 'default' as const,
        fontSize: 'medium' as const,
        borderRadius: 'medium' as const,
        animations: false
      },
      styles: {}
    };
  }

  return {
    state: themeManager.getState(),
    updateConfig: themeManager.updateConfig.bind(themeManager),
    classes: themeManager.getThemeClasses(),
    styles: themeManager.getStyles()
  };
}

// Theme initialization for app startup
export function initializeTheme() {
  if (typeof window !== 'undefined') {
    themeManager.initialize();
  }
}

// Theme preloader script (to prevent FOUC)
export const themePreloaderScript = `
(function() {
  try {
    const stored = localStorage.getItem('sonity-theme-config');
    const config = stored ? JSON.parse(stored) : { mode: 'system' };
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let resolvedMode = 'dark';
    switch (config.mode) {
      case 'system':
        resolvedMode = systemDark ? 'dark' : 'light';
        break;
      case 'auto':
        const hour = new Date().getHours();
        resolvedMode = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        break;
      default:
        resolvedMode = config.mode;
    }
    
    document.documentElement.setAttribute('data-theme', resolvedMode);
    document.documentElement.classList.add(resolvedMode);
    
    if (config.variant) {
      document.documentElement.setAttribute('data-theme-variant', config.variant);
      document.documentElement.classList.add('theme-' + config.variant);
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  }
})();
`;
