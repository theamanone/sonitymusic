// lib/algorithms/adaptive-ui.ts - Advanced Adaptive UI Engine
import { useState, useEffect, useCallback } from 'react';

interface DeviceCapabilities {
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  touchSupport: boolean;
  orientation: 'portrait' | 'landscape';
  connectionSpeed: 'slow' | 'fast' | 'ultra-fast';
  batteryLevel: number;
  memoryUsage: number;
}

interface UserBehavior {
  scrollSpeed: number;
  clickFrequency: number;
  sessionDuration: number;
  preferredInteractions: ('touch' | 'click' | 'keyboard' | 'gesture')[];
  colorPreference: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  animationPreference: 'reduced' | 'normal' | 'enhanced';
}

interface AdaptiveUIConfig {
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  componentSize: 'small' | 'medium' | 'large';
  touchTargets: 'minimal' | 'standard' | 'generous';
  imageQuality: 'low' | 'medium' | 'high' | 'ultra';
  animationLevel: 'none' | 'minimal' | 'moderate' | 'full';
  preloadStrategy: 'conservative' | 'balanced' | 'aggressive';
}

class AdaptiveUIEngine {
  private deviceCapabilities: DeviceCapabilities;
  private userBehavior: UserBehavior;
  private config: AdaptiveUIConfig;
  private adaptationHistory: Map<string, any> = new Map();

  constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.userBehavior = this.initializeUserBehavior();
    this.config = this.calculateOptimalConfig();
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    let connectionSpeed: 'slow' | 'fast' | 'ultra-fast' = 'fast';
    if (connection) {
      const downlink = connection.downlink || 1;
      if (downlink < 1) connectionSpeed = 'slow';
      else if (downlink > 5) connectionSpeed = 'ultra-fast';
    }

    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      touchSupport: 'ontouchstart' in window,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      connectionSpeed,
      batteryLevel: (navigator as any).getBattery ?
        (navigator as any).getBattery().then((b: any) => b.level * 100) : 100,
      memoryUsage: (performance as any).memory ?
        (performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize : 0.5
    };
  }

  private initializeUserBehavior(): UserBehavior {
    // Load from localStorage or use defaults
    const stored = localStorage.getItem('adaptive-ui-behavior');
    const parsed = stored ? JSON.parse(stored) : {};

    return {
      scrollSpeed: parsed.scrollSpeed || 1,
      clickFrequency: parsed.clickFrequency || 1,
      sessionDuration: parsed.sessionDuration || 0,
      preferredInteractions: parsed.preferredInteractions || ['click'],
      colorPreference: parsed.colorPreference || 'auto',
      fontSize: parsed.fontSize || 'medium',
      animationPreference: parsed.animationPreference || 'normal',
      ...parsed
    };
  }

  private calculateOptimalConfig(): AdaptiveUIConfig {
    const { deviceCapabilities, userBehavior } = this;

    // Adaptive layout density based on screen size and user behavior
    let layoutDensity: AdaptiveUIConfig['layoutDensity'] = 'comfortable';
    if (deviceCapabilities.screenWidth < 640) {
      layoutDensity = userBehavior.scrollSpeed > 1.5 ? 'compact' : 'comfortable';
    } else if (deviceCapabilities.screenWidth > 1024) {
      layoutDensity = 'spacious';
    }

    // Component size based on touch support and user preference
    let componentSize: AdaptiveUIConfig['componentSize'] = 'medium';
    if (deviceCapabilities.touchSupport) {
      componentSize = userBehavior.preferredInteractions.includes('touch') ? 'large' : 'medium';
    }

    // Touch targets based on device capabilities
    let touchTargets: AdaptiveUIConfig['touchTargets'] = 'standard';
    if (deviceCapabilities.touchSupport) {
      touchTargets = deviceCapabilities.screenWidth < 640 ? 'generous' : 'standard';
    }

    // Image quality based on connection and device capabilities
    let imageQuality: AdaptiveUIConfig['imageQuality'] = 'medium';
    if (deviceCapabilities.connectionSpeed === 'ultra-fast' && deviceCapabilities.pixelRatio > 1) {
      imageQuality = 'ultra';
    } else if (deviceCapabilities.connectionSpeed === 'slow') {
      imageQuality = 'low';
    }

    // Animation level based on user preference and device capabilities
    let animationLevel: AdaptiveUIConfig['animationLevel'] = 'moderate';
    if (userBehavior.animationPreference === 'reduced') {
      animationLevel = 'minimal';
    } else if (userBehavior.animationPreference === 'enhanced' && deviceCapabilities.memoryUsage < 0.8) {
      animationLevel = 'full';
    }

    // Preload strategy based on connection speed
    let preloadStrategy: AdaptiveUIConfig['preloadStrategy'] = 'balanced';
    if (deviceCapabilities.connectionSpeed === 'slow') {
      preloadStrategy = 'conservative';
    } else if (deviceCapabilities.connectionSpeed === 'ultra-fast') {
      preloadStrategy = 'aggressive';
    }

    return {
      layoutDensity,
      componentSize,
      touchTargets,
      imageQuality,
      animationLevel,
      preloadStrategy
    };
  }

  // Real-time adaptation methods
  adaptToUserBehavior(action: string, data?: any) {
    switch (action) {
      case 'scroll':
        this.userBehavior.scrollSpeed = Math.max(0.5, Math.min(2, data.velocity || 1));
        break;
      case 'click':
        this.userBehavior.clickFrequency += 0.1;
        if (data.touch) {
          this.userBehavior.preferredInteractions.push('touch');
        }
        break;
      case 'gesture':
        if (!this.userBehavior.preferredInteractions.includes('gesture')) {
          this.userBehavior.preferredInteractions.push('gesture');
        }
        break;
      case 'theme-change':
        this.userBehavior.colorPreference = data.theme;
        break;
    }

    // Recalculate config if significant changes
    if (this.shouldRecalculateConfig()) {
      this.config = this.calculateOptimalConfig();
      this.saveUserBehavior();
    }
  }

  private shouldRecalculateConfig(): boolean {
    // Recalculate if user behavior has changed significantly
    return Math.random() < 0.1; // 10% chance to recalculate (simulate adaptive behavior)
  }

  private saveUserBehavior() {
    localStorage.setItem('adaptive-ui-behavior', JSON.stringify(this.userBehavior));
  }

  // Get adaptive styles
  getAdaptiveStyles(component: string): Record<string, any> {
    const baseStyles = this.getBaseStyles(component);
    const adaptiveStyles = this.applyAdaptations(component, baseStyles);

    return adaptiveStyles;
  }

  private getBaseStyles(component: string): Record<string, any> {
    const baseStyles: Record<string, Record<string, any>> = {
      button: {
        padding: this.config.componentSize === 'large' ? '12px 24px' :
                this.config.componentSize === 'small' ? '8px 16px' : '10px 20px',
        borderRadius: this.config.layoutDensity === 'compact' ? '8px' : '12px',
        fontSize: this.userBehavior.fontSize === 'large' ? '16px' :
                 this.userBehavior.fontSize === 'small' ? '12px' : '14px',
        minHeight: this.config.touchTargets === 'generous' ? '48px' :
                  this.config.touchTargets === 'minimal' ? '32px' : '40px'
      },
      card: {
        padding: this.config.layoutDensity === 'spacious' ? '24px' :
                this.config.layoutDensity === 'compact' ? '12px' : '16px',
        borderRadius: this.config.layoutDensity === 'compact' ? '12px' : '16px',
        gap: this.config.layoutDensity === 'spacious' ? '16px' :
             this.config.layoutDensity === 'compact' ? '8px' : '12px'
      },
      list: {
        gap: this.config.layoutDensity === 'spacious' ? '16px' :
             this.config.layoutDensity === 'compact' ? '4px' : '8px'
      }
    };

    return baseStyles[component] || {};
  }

  private applyAdaptations(component: string, baseStyles: Record<string, any>): Record<string, any> {
    const adaptations = { ...baseStyles };

    // Apply animation preferences
    if (this.config.animationLevel === 'minimal') {
      adaptations.transition = 'none';
    } else if (this.config.animationLevel === 'full') {
      adaptations.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Apply performance optimizations
    if (this.deviceCapabilities.memoryUsage > 0.8) {
      adaptations.willChange = 'auto';
      adaptations.backfaceVisibility = 'hidden';
    }

    return adaptations;
  }

  // Get device-specific optimizations
  getPerformanceOptimizations(): Record<string, any> {
    return {
      imageLazyLoading: this.deviceCapabilities.connectionSpeed === 'slow',
      reducedMotion: this.userBehavior.animationPreference === 'reduced',
      preloadImages: this.config.preloadStrategy === 'aggressive',
      virtualization: this.deviceCapabilities.memoryUsage > 0.7,
      reducedQuality: this.deviceCapabilities.batteryLevel < 20
    };
  }

  // Get responsive breakpoints
  getResponsiveBreakpoints(): Record<string, number> {
    // Adaptive breakpoints based on device capabilities
    const baseBreakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    };

    // Adjust for touch devices
    if (this.deviceCapabilities.touchSupport) {
      return {
        ...baseBreakpoints,
        touch: 480,
        tablet: 768,
        desktop: 1024
      };
    }

    return baseBreakpoints;
  }

  // Cleanup
  destroy() {
    // Cleanup logic if needed
  }
}

// Singleton instance
let adaptiveUIEngineInstance: AdaptiveUIEngine | null = null;

export const adaptiveUIEngine = {
  initialize: () => {
    if (!adaptiveUIEngineInstance) {
      adaptiveUIEngineInstance = new AdaptiveUIEngine();
    }
    return adaptiveUIEngineInstance;
  },

  getInstance: () => {
    if (!adaptiveUIEngineInstance) {
      throw new Error('AdaptiveUIEngine not initialized');
    }
    return adaptiveUIEngineInstance;
  },

  isInitialized: () => !!adaptiveUIEngineInstance,

  destroy: () => {
    if (adaptiveUIEngineInstance) {
      adaptiveUIEngineInstance.destroy();
      adaptiveUIEngineInstance = null;
    }
  }
};

// React hook for using adaptive UI
export function useAdaptiveUI() {
  const [engine] = useState(() => adaptiveUIEngine.initialize());

  const getStyles = useCallback((component: string) => {
    return engine?.getAdaptiveStyles(component) || {};
  }, [engine]);

  const getOptimizations = useCallback(() => {
    return engine?.getPerformanceOptimizations() || {};
  }, [engine]);

  const getBreakpoints = useCallback(() => {
    return engine?.getResponsiveBreakpoints() || {};
  }, [engine]);

  const adaptToAction = useCallback((action: string, data?: any) => {
    engine?.adaptToUserBehavior(action, data);
  }, [engine]);

  return {
    getStyles,
    getOptimizations,
    getBreakpoints,
    adaptToAction
  };
}
 