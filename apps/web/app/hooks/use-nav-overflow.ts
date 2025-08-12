/**
 * Navigation Overflow Hook
 * Handles responsive navigation with progressive disclosure
 * Measures available width and determines which items to show/hide
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV, type NavGroup } from '../constants/navigation';

interface UseNavOverflowReturn {
  visibleItems: NavGroup[];
  overflowItems: NavGroup[];
  hasOverflow: boolean;
  containerRef: React.RefObject<HTMLElement>;
  measureItems: () => void;
}

// Enhanced item widths for different viewport types
const RESPONSIVE_ITEM_WIDTHS = {
  mobile: {
    search: 50, // Icon only
    stays: 50, // Icon only
    transport: 50, // Icon only
    activities: 50, // Icon only
    deals: 50, // Icon only
    alerts: 50, // Icon only
    trips: 50, // Icon only
    groups: 50, // Icon only
    more: 40, // Compact overflow
  },
  tablet: {
    search: 70, // Icon + short label
    stays: 60, // Compact label
    transport: 75, // Compact label
    activities: 70, // Compact label
    deals: 55, // Compact with badge
    alerts: 70, // Icon + label
    trips: 60, // Compact label
    groups: 85, // Slightly longer
    more: 50, // Overflow button
  },
  laptop: {
    search: 85, // Full experience
    stays: 65, // Standard label
    transport: 90, // Full label
    activities: 85, // Full label
    deals: 65, // With badge
    alerts: 95, // Full label + icon
    trips: 75, // Standard label
    groups: 115, // Full descriptive label
    more: 55, // Standard overflow
  },
  desktop: {
    search: 120, // Full + keyboard shortcut
    stays: 80, // Generous spacing
    transport: 105, // Full comfortable spacing
    activities: 100, // Full spacing
    deals: 80, // With badge + spacing
    alerts: 110, // Full comfortable spacing
    trips: 90, // Comfortable spacing
    groups: 130, // Full descriptive + spacing
    more: 65, // Comfortable overflow
  },
  ultrawide: {
    search: 140, // Maximum comfort
    stays: 100, // Generous spacing
    transport: 125, // Maximum spacing
    activities: 120, // Maximum spacing
    deals: 100, // Maximum with badge
    alerts: 130, // Maximum spacing
    trips: 110, // Maximum spacing
    groups: 150, // Maximum descriptive
    more: 75, // Generous overflow
  },
} as const;

// Dynamic layout configuration based on viewport
const getLayoutConfig = (viewportInfo: ViewportInfo) => {
  const { type, width, isTouch } = viewportInfo;

  // Base configuration per viewport type
  const configs = {
    mobile: {
      minVisible: 2, // Search + 1 core service
      preferredVisible: 3, // Optimal for mobile
      maxVisible: 4, // Before overwhelming
      logoWidth: 120, // Compact branding
      actionsWidth: 120, // Essential actions only
    },
    tablet: {
      minVisible: 3, // Search + 2 core services
      preferredVisible: 4, // Good tablet experience
      maxVisible: 6, // Before needing overflow
      logoWidth: 180, // Standard branding
      actionsWidth: 160, // More actions visible
    },
    laptop: {
      minVisible: 3, // Baseline navigation
      preferredVisible: 5, // Optimal laptop experience
      maxVisible: 7, // Before overwhelming
      logoWidth: 220, // Full branding
      actionsWidth: 200, // Standard action set
    },
    desktop: {
      minVisible: 4, // Rich baseline
      preferredVisible: 6, // Rich desktop experience
      maxVisible: 8, // Can handle more complexity
      logoWidth: 250, // Rich branding
      actionsWidth: 220, // Full action set
    },
    ultrawide: {
      minVisible: 5, // Utilize space efficiently
      preferredVisible: 8, // Rich ultrawide experience
      maxVisible: 10, // Maximum before clutter
      logoWidth: 280, // Maximum branding
      actionsWidth: 250, // All possible actions
    },
  };

  const config = configs[type];

  // Adjust for touch devices - need bigger touch targets
  if (isTouch) {
    config.minVisible = Math.max(1, config.minVisible - 1);
    config.preferredVisible = Math.max(2, config.preferredVisible - 1);
    config.maxVisible = Math.max(3, config.maxVisible - 1);
  }

  return config;
};

export function useNavOverflow(): UseNavOverflowReturn {
  const containerRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<NavGroup[]>(NAV);
  const [overflowItems, setOverflowItems] = useState<NavGroup[]>([]);
  const viewportInfo = useNavViewport();

  const measureItems = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const availableWidth = container.clientWidth;

    // Get responsive configuration
    const config = getLayoutConfig(viewportInfo);
    const itemWidths = RESPONSIVE_ITEM_WIDTHS[viewportInfo.type];

    // Account for logo and action buttons with responsive adjustments
    const navigationWidth =
      availableWidth - config.logoWidth - config.actionsWidth;

    // Implement intelligent progressive disclosure based on viewport and content
    let totalWidth = 0;
    const newVisibleItems: NavGroup[] = [];
    const newOverflowItems: NavGroup[] = [];

    // Sort by priority (lower number = higher priority) - core travel services first
    const sortedItems = [...NAV].sort((a, b) => a.priority - b.priority);

    for (const item of sortedItems) {
      const itemWidth =
        itemWidths[item.key as keyof typeof itemWidths] ||
        (viewportInfo.type === 'mobile' ? 50 : 80);

      // Adaptive visibility based on available space and business priorities
      const needsMoreButton =
        newOverflowItems.length > 0 ||
        (totalWidth + itemWidth > navigationWidth &&
          sortedItems.indexOf(item) < sortedItems.length - 1);

      const requiredWidth =
        totalWidth + itemWidth + (needsMoreButton ? itemWidths.more : 0);

      // Smart overflow strategy: prioritize core travel services without overwhelming users
      const canFitInViewport = requiredWidth <= navigationWidth;
      const withinPreferredLimit =
        newVisibleItems.length < config.preferredVisible;
      const belowMaximumLimit = newVisibleItems.length < config.maxVisible;

      // Enhanced priority logic for different viewport types
      const isPriorityItem =
        item.priority <= (viewportInfo.type === 'mobile' ? 2 : 3);
      const isEssentialForViewport =
        (viewportInfo.type === 'mobile' && item.priority <= 1) ||
        (viewportInfo.type === 'tablet' && item.priority <= 2) ||
        (viewportInfo.type !== 'mobile' && viewportInfo.type !== 'tablet');

      if (
        canFitInViewport &&
        (withinPreferredLimit || (belowMaximumLimit && isPriorityItem)) &&
        isEssentialForViewport
      ) {
        // Show item if it fits and meets business priority criteria
        newVisibleItems.push(item);
        totalWidth += itemWidth;
      } else {
        // Move to progressive disclosure (overflow menu)
        newOverflowItems.push(item);
      }
    }

    // Ensure minimum viable navigation (search + core services) always visible
    if (newVisibleItems.length < config.minVisible) {
      const remainingItems = newOverflowItems.splice(
        0,
        config.minVisible - newVisibleItems.length
      );
      newVisibleItems.push(...remainingItems);
    }

    // Maintain original navigation order for intuitive user experience
    const orderedVisibleItems = NAV.filter(item =>
      newVisibleItems.some(visible => visible.key === item.key)
    );

    setVisibleItems(orderedVisibleItems);
    setOverflowItems(newOverflowItems);
  }, [viewportInfo]);

  // Performance-optimized ResizeObserver with proper cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      // Debounced measurement to prevent excessive recalculations during resize
      const timeoutId = setTimeout(() => {
        measureItems();
      }, 100);

      return () => clearTimeout(timeoutId);
    });

    resizeObserver.observe(container);

    // Initial measurement for immediate feedback
    requestAnimationFrame(measureItems);

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureItems]);

  // Backup window resize handler for broader browser compatibility
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(measureItems);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureItems]);

  return {
    visibleItems,
    overflowItems,
    hasOverflow: overflowItems.length > 0,
    containerRef,
    measureItems,
  };
}

// Enhanced viewport types for better responsive design
export type ViewportType =
  | 'mobile'
  | 'tablet'
  | 'laptop'
  | 'desktop'
  | 'ultrawide';

export interface ViewportInfo {
  type: ViewportType;
  width: number;
  height: number;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  aspectRatio: number;
}

// Refined breakpoints based on real device usage patterns
const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  laptop: { min: 1024, max: 1439 },
  desktop: { min: 1440, max: 1919 },
  ultrawide: { min: 1920, max: Infinity },
} as const;

// Helper hook for tracking viewport size categories with detailed device info
export function useNavViewport(): ViewportInfo {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>(() => ({
    type: 'desktop',
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
    isTouch: false,
    orientation: 'landscape',
    aspectRatio: 16 / 9,
  }));

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const orientation = width > height ? 'landscape' : 'portrait';

      // Detect touch capability
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Determine viewport type
      let type: ViewportType = 'desktop';
      for (const [key, range] of Object.entries(BREAKPOINTS)) {
        if (width >= range.min && width <= range.max) {
          type = key as ViewportType;
          break;
        }
      }

      setViewportInfo({
        type,
        width,
        height,
        isTouch,
        orientation,
        aspectRatio,
      });
    };

    updateViewport();

    // Use both resize and orientationchange for better mobile support
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewportInfo;
}

// Legacy compatibility function
export function useNavViewportLegacy() {
  const viewportInfo = useNavViewport();
  return viewportInfo.type === 'mobile'
    ? 'mobile'
    : viewportInfo.type === 'tablet'
      ? 'tablet'
      : 'desktop';
}
