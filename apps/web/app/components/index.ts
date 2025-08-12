/**
 * Main Components Index
 * Centralized exports for all app components following clean architecture principles
 */

// Progressive Disclosure Components
export { FeatureDiscovery } from './discovery/feature-discovery';
export { SmartNavigation } from './navigation/smart-navigation';
export { mockFlightResults, ResultsDisplay } from './results/results-display';
export { AdaptiveSearch } from './search/adaptive-search';

// Navigation Components (explicit imports to avoid conflicts)
export { CommandPalette } from './navigation/command-palette';
export { MegaMenu } from './navigation/mega-menu';
export { ProgressiveNavigation } from './navigation/progressive-navigation';
export { SettingsMenu } from './navigation/settings-menu';

// Types
export type UserLevel = 'beginner' | 'intermediate' | 'expert';

// Core Layout Components (selective exports to avoid conflicts)
export { MobileMenuToggle, NavigationLogo, UserMenu } from './layout';

// Hero Components
export * from './hero';

// Search Components
export * from './search';

// Flight Components
export * from './flights';

// Deal Components
export * from './deals';

// Monitoring Components
export * from './monitoring';

// Providers
export * from './providers';

// Trip Planning Components
export * from './trip-planning';

// Standalone Components
export { FeatureShowcase } from './feature-showcase';
export { FlightQuickSearch } from './flight-quick-search';

// Enhanced Features
export * from './enhanced-features';

// Interactive Demo
export * from './interactive-demo';
