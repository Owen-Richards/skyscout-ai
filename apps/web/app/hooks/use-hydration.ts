/**
 * Custom hook to prevent hydration mismatches with client-only values
 *
 * This hook ensures that values that differ between server and client
 * (like timestamps, random numbers, etc.) are only rendered after hydration.
 */

import { useEffect, useState } from 'react';

/**
 * Hook to check if component has hydrated on the client
 * Prevents hydration mismatches for time-sensitive or random data
 */
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set hydrated to true only after the component mounts on client
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook for client-only values that would cause hydration mismatches
 * @param clientValue - The value to use after hydration
 * @param serverValue - The value to use during SSR (optional, defaults to null)
 */
export function useClientOnly<T>(
  clientValue: T,
  serverValue: T | null = null
): T | null {
  const isHydrated = useIsHydrated();
  return isHydrated ? clientValue : serverValue;
}

/**
 * Hook for current timestamp that prevents hydration mismatch
 */
export function useCurrentTime(): Date | null {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (isHydrated) {
      setCurrentTime(new Date());
    }
  }, [isHydrated]);

  return currentTime;
}

/**
 * Hook for auto-updating time (useful for "last updated" displays)
 * @param intervalMs - Update interval in milliseconds (default: 5000)
 */
export function useAutoUpdatingTime(intervalMs = 5000): Date | null {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (!isHydrated) return;

    // Set initial time
    setCurrentTime(new Date());

    // Set up interval for updates
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isHydrated, intervalMs]);

  return currentTime;
}
