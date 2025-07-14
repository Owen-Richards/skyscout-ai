/**
 * Hero section animation hook
 * Following Single Responsibility Principle - manages only feature cycling animation
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Hook for managing cycling animations in the hero section
 * Encapsulates animation state and timing logic
 */
export function useFeatureCycling<T>(
  items: readonly T[],
  intervalMs: number = 3000
): {
  currentIndex: number;
  currentItem: T;
} {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [items.length, intervalMs]);

  return {
    currentIndex,
    currentItem: items[currentIndex],
  };
}
