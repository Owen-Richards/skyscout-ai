/**
 * Internationalization Context
 * Production-ready i18n system with proper culture handling
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  UserPreferences,
  DEFAULT_PREFERENCES,
  SUPPORTED_LOCALES,
  SUPPORTED_CURRENCIES,
} from '../types/i18n';

interface I18nContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  isRTL: boolean;
  currentLocale: (typeof SUPPORTED_LOCALES)[keyof typeof SUPPORTED_LOCALES];
  currentCurrency: (typeof SUPPORTED_CURRENCIES)[keyof typeof SUPPORTED_CURRENCIES];
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'skyscout-preferences';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } else {
        // Detect user's locale and set as default
        const browserLocale = navigator.language;
        const supportedLocale = Object.keys(SUPPORTED_LOCALES).find(
          locale =>
            locale === browserLocale ||
            locale.startsWith(browserLocale.split('-')[0])
        );

        if (supportedLocale) {
          const updates = { locale: supportedLocale };
          setPreferences(prev => ({ ...prev, ...updates }));
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...DEFAULT_PREFERENCES, ...updates })
          );
        }
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }, []);

  // Update preferences function
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      } catch (error) {
        console.warn('Failed to save user preferences:', error);
      }
      return newPreferences;
    });
  };

  // Format currency with proper localization
  const formatCurrency = (amount: number, currencyCode?: string): string => {
    const currency = currencyCode || preferences.currency;
    try {
      return new Intl.NumberFormat(preferences.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      // Fallback for unsupported currency/locale combinations
      const currencyInfo = SUPPORTED_CURRENCIES[currency];
      if (currencyInfo) {
        const formatted = new Intl.NumberFormat(preferences.locale).format(
          amount
        );
        return currencyInfo.symbolPosition === 'before'
          ? `${currencyInfo.symbol}${formatted}`
          : `${formatted} ${currencyInfo.symbol}`;
      }
      return `$${amount}`;
    }
  };

  // Format date with user's locale
  const formatDate = (
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    try {
      return new Intl.DateTimeFormat(preferences.locale, options).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  };

  // Format number with user's locale
  const formatNumber = (
    number: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    try {
      return new Intl.NumberFormat(preferences.locale, options).format(number);
    } catch (error) {
      return number.toString();
    }
  };

  // Check if current locale is RTL
  const isRTL = SUPPORTED_LOCALES[preferences.locale]?.rtl || false;

  // Get current locale and currency info
  const currentLocale =
    SUPPORTED_LOCALES[preferences.locale] || SUPPORTED_LOCALES['en-US'];
  const currentCurrency =
    SUPPORTED_CURRENCIES[preferences.currency] || SUPPORTED_CURRENCIES['USD'];

  // Apply RTL to document
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = preferences.locale.split('-')[0];
  }, [isRTL, preferences.locale]);

  const value: I18nContextType = {
    preferences,
    updatePreferences,
    formatCurrency,
    formatDate,
    formatNumber,
    isRTL,
    currentLocale,
    currentCurrency,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Convenience hooks
export function useCurrency() {
  const { formatCurrency, currentCurrency } = useI18n();
  return { formatCurrency, currentCurrency };
}

export function useLocale() {
  const { currentLocale, isRTL, formatDate, formatNumber } = useI18n();
  return { currentLocale, isRTL, formatDate, formatNumber };
}
