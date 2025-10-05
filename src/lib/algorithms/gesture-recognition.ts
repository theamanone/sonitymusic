// lib/algorithms/gesture-recognition.ts - Advanced Gesture Recognition Engine
import { useState, useEffect, useCallback, useRef } from 'react';

interface GesturePoint {
  x: number;
  y: number;
  time: number;
}

interface GesturePattern {
  type: 'swipe' | 'pinch' | 'rotate' | 'tap' | 'double-tap' | 'long-press' | 'pan';
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  angle?: number;
  velocity?: number;
  duration?: number;
  scale?: number;
  rotation?: number;
}

interface GestureConfig {
  swipeThreshold: number;
  pinchThreshold: number;
  tapThreshold: number;
  longPressDelay: number;
  velocityThreshold: number;
}

class GestureRecognitionEngine {
  private touchStart: GesturePoint | null = null;
  private touchEnd: GesturePoint | null = null;
  private touchPoints: GesturePoint[] = [];
  private isTracking = false;
  private longPressTimer: NodeJS.Timeout | null = null;
  private config: GestureConfig;

  constructor(config: Partial<GestureConfig> = {}) {
    this.config = {
      swipeThreshold: 50,
      pinchThreshold: 0.1,
      tapThreshold: 10,
      longPressDelay: 500,
      velocityThreshold: 0.3,
      ...config
    };
  }

  // Initialize gesture tracking
  startTracking(element: HTMLElement) {
    if (this.isTracking) return;

    this.isTracking = true;

    const handleTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
    const handleTouchMove = (e: TouchEvent) => this.handleTouchMove(e);
    const handleTouchEnd = (e: TouchEvent) => this.handleTouchEnd(e);

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Cleanup function
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      this.stopTracking();
    };
  }

  stopTracking() {
    this.isTracking = false;
    this.resetTracking();
  }

  private resetTracking() {
    this.touchStart = null;
    this.touchEnd = null;
    this.touchPoints = [];

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private handleTouchStart(e: TouchEvent) {
    const touches = e.touches;

    if (touches.length === 1) {
      // Single touch
      const touch = touches[0];
      this.touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      this.touchPoints = [this.touchStart];

      // Start long press timer
      this.longPressTimer = setTimeout(() => {
        this.emitGesture({
          type: 'long-press',
          duration: this.config.longPressDelay
        });
      }, this.config.longPressDelay);

    } else if (touches.length === 2) {
      // Multi-touch (pinch/rotate)
      this.resetTracking();
      this.touchPoints = Array.from(touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }));
    }
  }

  private handleTouchMove(e: TouchEvent) {
    const touches = e.touches;

    // Cancel long press on move
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (touches.length === 1 && this.touchStart) {
      // Single touch move (swipe/pan)
      const touch = touches[0];
      const currentPoint = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      this.touchPoints.push(currentPoint);

    } else if (touches.length === 2 && this.touchPoints.length >= 2) {
      // Multi-touch move (pinch/rotate)
      const newPoints = Array.from(touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }));

      this.detectPinchGesture(this.touchPoints, newPoints);
      this.detectRotateGesture(this.touchPoints, newPoints);

      this.touchPoints = newPoints;
    }
  }

  private handleTouchEnd(e: TouchEvent) {
    const touches = e.touches;

    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (touches.length === 0 && this.touchStart) {
      // Touch ended
      const touch = e.changedTouches[0];
      this.touchEnd = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      this.detectGesture();
    }

    this.resetTracking();
  }

  private detectGesture() {
    if (!this.touchStart || !this.touchEnd) return;

    const deltaX = this.touchEnd.x - this.touchStart.x;
    const deltaY = this.touchEnd.y - this.touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = this.touchEnd.time - this.touchStart.time;

    // Calculate velocity
    const velocity = distance / Math.max(duration, 1);

    // Detect tap
    if (distance < this.config.tapThreshold && duration < 300) {
      // Check for double tap
      if (this.isDoubleTap()) {
        this.emitGesture({ type: 'double-tap' });
      } else {
        this.emitGesture({ type: 'tap' });
      }
      return;
    }

    // Detect swipe
    if (distance > this.config.swipeThreshold && velocity > this.config.velocityThreshold) {
      const direction = this.getSwipeDirection(deltaX, deltaY);
      this.emitGesture({
        type: 'swipe',
        direction,
        distance,
        velocity
      });
    }

    // Detect pan
    else if (distance > this.config.swipeThreshold) {
      this.emitGesture({
        type: 'pan',
        distance,
        angle: Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      });
    }
  }

  private getSwipeDirection(deltaX: number, deltaY: number): 'up' | 'down' | 'left' | 'right' {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  private detectPinchGesture(oldPoints: GesturePoint[], newPoints: GesturePoint[]) {
    if (oldPoints.length !== 2 || newPoints.length !== 2) return;

    const oldDistance = this.getDistance(oldPoints[0], oldPoints[1]);
    const newDistance = this.getDistance(newPoints[0], newPoints[1]);
    const scale = newDistance / oldDistance;

    if (Math.abs(scale - 1) > this.config.pinchThreshold) {
      this.emitGesture({
        type: 'pinch',
        scale,
        distance: Math.abs(newDistance - oldDistance)
      });
    }
  }

  private detectRotateGesture(oldPoints: GesturePoint[], newPoints: GesturePoint[]) {
    if (oldPoints.length !== 2 || newPoints.length !== 2) return;

    const oldAngle = this.getAngle(oldPoints[0], oldPoints[1]);
    const newAngle = this.getAngle(newPoints[0], newPoints[1]);
    const rotation = newAngle - oldAngle;

    if (Math.abs(rotation) > 5) { // 5 degree threshold
      this.emitGesture({
        type: 'rotate',
        rotation
      });
    }
  }

  private getDistance(point1: GesturePoint, point2: GesturePoint): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getAngle(point1: GesturePoint, point2: GesturePoint): number {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
  }

  private isDoubleTap(): boolean {
    // Simple double tap detection (would need more sophisticated implementation)
    return false; // Placeholder
  }

  private emitGesture(gesture: GesturePattern) {
    // Emit custom event
    const event = new CustomEvent('gesture', {
      detail: gesture,
      bubbles: true
    });

    document.dispatchEvent(event);
  }

  // Public API for gesture recognition
  onGesture(callback: (gesture: GesturePattern) => void) {
    const handler = (e: Event) => {
      callback((e as CustomEvent).detail);
    };

    document.addEventListener('gesture', handler);

    // Return cleanup function
    return () => {
      document.removeEventListener('gesture', handler);
    };
  }

  // Advanced gesture patterns
  recognizePattern(points: GesturePoint[]): GesturePattern | null {
    if (points.length < 3) return null;

    // Simple pattern recognition (could be extended for complex gestures)
    const start = points[0];
    const end = points[points.length - 1];

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > this.config.swipeThreshold) {
      const direction = this.getSwipeDirection(deltaX, deltaY);
      return {
        type: 'swipe',
        direction
      };
    }

    return null;
  }

  // Cleanup logic
  destroy() {
    this.resetTracking();
  }
}

// Singleton instance
let gestureEngineInstance: GestureRecognitionEngine | null = null;

export const gestureEngine = {
  initialize: (config?: Partial<GestureConfig>) => {
    if (!gestureEngineInstance) {
      gestureEngineInstance = new GestureRecognitionEngine(config);
    }
    return gestureEngineInstance;
  },

  getInstance: () => {
    if (!gestureEngineInstance) {
      throw new Error('GestureRecognitionEngine not initialized');
    }
    return gestureEngineInstance;
  },

  isInitialized: () => !!gestureEngineInstance,

  destroy: () => {
    if (gestureEngineInstance) {
      gestureEngineInstance.destroy();
      gestureEngineInstance = null;
    }
  }
};

// React hook for gesture recognition
export function useGestures(elementRef?: React.RefObject<HTMLElement>) {
  const [currentGesture, setCurrentGesture] = useState<GesturePattern | null>(null);
  const engineRef = useRef<GestureRecognitionEngine | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    engineRef.current = gestureEngine.initialize();

    if (elementRef?.current) {
      cleanupRef.current = engineRef.current.startTracking(elementRef.current) || null;
    }

    const gestureHandler = (gesture: GesturePattern) => {
      setCurrentGesture(gesture);
    };

    const cleanupGesture = engineRef.current.onGesture(gestureHandler);

    return () => {
      cleanupGesture?.();
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [elementRef]);

  const onGesture = useCallback((callback: (gesture: GesturePattern) => void) => {
    if (!engineRef.current) return;

    return engineRef.current.onGesture(callback);
  }, []);

  const recognizePattern = useCallback((points: GesturePoint[]) => {
    return engineRef.current?.recognizePattern(points) || null;
  }, []);

  return {
    currentGesture,
    onGesture,
    recognizePattern
  };
}
