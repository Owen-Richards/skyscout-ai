/**
 * User Level Detection System
 * Dynamically determines user expertise and adapts interface complexity
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserLevel = 'beginner' | 'intermediate' | 'expert';

interface UserBehavior {
  searchCount: number;
  featuresUsed: string[];
  timeSpent: number; // in minutes
  hasSharedLink: boolean;
  hasCreatedGroup: boolean;
  hasUsedAdvancedFilters: boolean;
  hasUsedComparison: boolean;
  hasSetPriceAlert: boolean;
  lastActiveDate: string;
  sessionStartTime: number;
}

interface UserLevelState {
  userLevel: UserLevel;
  behavior: UserBehavior;
  actions: {
    trackSearch: () => void;
    trackFeatureUse: (feature: string) => void;
    trackTimeSpent: () => void;
    trackSharedLink: () => void;
    trackGroupCreation: () => void;
    detectUserLevel: () => UserLevel;
    resetBehavior: () => void;
  };
}

const initialBehavior: UserBehavior = {
  searchCount: 0,
  featuresUsed: [],
  timeSpent: 0,
  hasSharedLink: false,
  hasCreatedGroup: false,
  hasUsedAdvancedFilters: false,
  hasUsedComparison: false,
  hasSetPriceAlert: false,
  lastActiveDate: new Date().toISOString(),
  sessionStartTime: Date.now(),
};

export const useUserLevel = create<UserLevelState>()(
  persist(
    (set, get) => ({
      userLevel: 'beginner',
      behavior: initialBehavior,
      
      actions: {
        trackSearch: () => {
          set((state) => ({
            behavior: {
              ...state.behavior,
              searchCount: state.behavior.searchCount + 1,
              lastActiveDate: new Date().toISOString(),
            },
          }));
          
          // Auto-detect level after tracking
          get().actions.detectUserLevel();
        },

        trackFeatureUse: (feature: string) => {
          set((state) => ({
            behavior: {
              ...state.behavior,
              featuresUsed: [...new Set([...state.behavior.featuresUsed, feature])],
              lastActiveDate: new Date().toISOString(),
            },
          }));
          
          // Track specific feature usage
          if (feature === 'advanced-filters') {
            set((state) => ({
              behavior: { ...state.behavior, hasUsedAdvancedFilters: true },
            }));
          }
          
          if (feature === 'comparison') {
            set((state) => ({
              behavior: { ...state.behavior, hasUsedComparison: true },
            }));
          }
          
          if (feature === 'price-alert') {
            set((state) => ({
              behavior: { ...state.behavior, hasSetPriceAlert: true },
            }));
          }
          
          get().actions.detectUserLevel();
        },

        trackTimeSpent: () => {
          const currentTime = Date.now();
          const sessionTime = currentTime - get().behavior.sessionStartTime;
          const sessionMinutes = Math.floor(sessionTime / (1000 * 60));
          
          set((state) => ({
            behavior: {
              ...state.behavior,
              timeSpent: state.behavior.timeSpent + sessionMinutes,
              sessionStartTime: currentTime, // Reset session timer
            },
          }));
        },

        trackSharedLink: () => {
          set((state) => ({
            behavior: {
              ...state.behavior,
              hasSharedLink: true,
              lastActiveDate: new Date().toISOString(),
            },
          }));
          get().actions.detectUserLevel();
        },

        trackGroupCreation: () => {
          set((state) => ({
            behavior: {
              ...state.behavior,
              hasCreatedGroup: true,
              lastActiveDate: new Date().toISOString(),
            },
          }));
          get().actions.trackFeatureUse('group-planning');
        },

        detectUserLevel: (): UserLevel => {
          const { behavior } = get();
          let newLevel: UserLevel = 'beginner';
          
          // Expert Level Criteria (any of these qualifies)
          if (
            behavior.hasCreatedGroup ||
            behavior.featuresUsed.length >= 5 ||
            behavior.searchCount >= 15 ||
            behavior.timeSpent >= 60 || // 1 hour total
            (behavior.hasUsedAdvancedFilters && behavior.hasUsedComparison && behavior.hasSetPriceAlert)
          ) {
            newLevel = 'expert';
          }
          
          // Intermediate Level Criteria
          else if (
            behavior.searchCount >= 3 ||
            behavior.featuresUsed.length >= 2 ||
            behavior.timeSpent >= 20 || // 20 minutes total
            behavior.hasSharedLink ||
            behavior.hasUsedAdvancedFilters ||
            behavior.hasSetPriceAlert
          ) {
            newLevel = 'intermediate';
          }
          
          // Update level if changed
          if (newLevel !== get().userLevel) {
            set({ userLevel: newLevel });
            
            // Trigger level-up event for analytics
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'user_level_up', {
                old_level: get().userLevel,
                new_level: newLevel,
                search_count: behavior.searchCount,
                features_used: behavior.featuresUsed.length,
              });
            }
          }
          
          return newLevel;
        },

        resetBehavior: () => {
          set({
            userLevel: 'beginner',
            behavior: { ...initialBehavior, sessionStartTime: Date.now() },
          });
        },
      },
    }),
    {
      name: 'skyscout-user-level',
      partialize: (state) => ({
        userLevel: state.userLevel,
        behavior: state.behavior,
      }),
    }
  )
);

// Feature availability based on user level
export const getFeatureAvailability = (userLevel: UserLevel) => ({
  // Basic features (always available)
  basicSearch: true,
  topThreeResults: true,
  
  // Intermediate features
  priceTracking: userLevel !== 'beginner',
  advancedFilters: userLevel !== 'beginner',
  trueTotalCost: userLevel !== 'beginner',
  
  // Expert features
  multiModal: userLevel === 'expert',
  comparison: userLevel === 'expert',
  groupPlanning: userLevel !== 'beginner',
  sustainability: userLevel === 'expert',
  concierge: userLevel === 'expert',
  
  // Progressive disclosure triggers
  showFeatureHints: userLevel === 'beginner',
  showAllOptions: userLevel === 'expert',
  showSmartTips: true,
});

// Hook for components to use user level
export const useUserLevelDetection = () => {
  const { userLevel, behavior, actions } = useUserLevel();
  const features = getFeatureAvailability(userLevel);
  
  return {
    userLevel,
    behavior,
    features,
    ...actions,
  };
};

// HOC for feature-gated components
export function withUserLevel<T extends object>(
  Component: React.ComponentType<T>,
  requiredLevel: UserLevel
) {
  return function UserLevelGatedComponent(props: T) {
    const { userLevel } = useUserLevelDetection();
    
    const levelHierarchy = { beginner: 0, intermediate: 1, expert: 2 };
    const hasAccess = levelHierarchy[userLevel] >= levelHierarchy[requiredLevel];
    
    if (!hasAccess) {
      return null;
    }
    
    return <Component {...props} />;
  };
}

// Progress towards next level
export const useProgressToNextLevel = () => {
  const { userLevel, behavior } = useUserLevel();
  
  const getProgress = (): { current: number; target: number; percentage: number; nextLevel: UserLevel | null } => {
    if (userLevel === 'beginner') {
      // Progress to intermediate (need 3 searches OR 2 features OR 20 minutes)
      const searchProgress = Math.min(behavior.searchCount / 3, 1);
      const featureProgress = Math.min(behavior.featuresUsed.length / 2, 1);
      const timeProgress = Math.min(behavior.timeSpent / 20, 1);
      
      const maxProgress = Math.max(searchProgress, featureProgress, timeProgress);
      
      return {
        current: Math.floor(maxProgress * 100),
        target: 100,
        percentage: maxProgress,
        nextLevel: 'intermediate',
      };
    }
    
    if (userLevel === 'intermediate') {
      // Progress to expert (need 15 searches OR 5 features OR 60 minutes OR group creation)
      const searchProgress = Math.min(behavior.searchCount / 15, 1);
      const featureProgress = Math.min(behavior.featuresUsed.length / 5, 1);
      const timeProgress = Math.min(behavior.timeSpent / 60, 1);
      const groupProgress = behavior.hasCreatedGroup ? 1 : 0;
      
      const maxProgress = Math.max(searchProgress, featureProgress, timeProgress, groupProgress);
      
      return {
        current: Math.floor(maxProgress * 100),
        target: 100,
        percentage: maxProgress,
        nextLevel: 'expert',
      };
    }
    
    // Already expert
    return {
      current: 100,
      target: 100,
      percentage: 1,
      nextLevel: null,
    };
  };
  
  return getProgress();
};

// Analytics tracking
export const trackUserLevelEvent = (event: string, properties?: Record<string, any>) => {
  const { userLevel, behavior } = useUserLevel.getState();
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      user_level: userLevel,
      search_count: behavior.searchCount,
      features_used: behavior.featuresUsed.length,
      time_spent: behavior.timeSpent,
      ...properties,
    });
  }
};

// Types for global gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: Record<string, any>
    ) => void;
  }
}
