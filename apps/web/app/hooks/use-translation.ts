/**
 * Translation Hook
 * Custom hook for using translations throughout the application
 */

'use client';

import { useI18n } from '../contexts/i18n-context';
import {
  getTranslation,
  TranslationKey,
  dateFormats,
  numberFormats,
} from '../lib/i18n-utils';

export function useTranslation() {
  const { preferences, formatCurrency, formatDate, formatNumber } = useI18n();

  const t = (key: TranslationKey, fallback?: string): string => {
    const translation = getTranslation(key, preferences.locale);
    return translation || fallback || key;
  };

  // Convenience formatting functions with presets
  const formatters = {
    currency: (amount: number, currency?: string) =>
      formatCurrency(amount, currency),

    date: {
      short: (date: Date) => formatDate(date, dateFormats.short),
      medium: (date: Date) => formatDate(date, dateFormats.medium),
      long: (date: Date) => formatDate(date, dateFormats.long),
      time: (date: Date) => formatDate(date, dateFormats.time),
      datetime: (date: Date) => formatDate(date, dateFormats.datetime),
    },

    number: {
      decimal: (num: number) => formatNumber(num, numberFormats.decimal),
      integer: (num: number) => formatNumber(num, numberFormats.integer),
      percent: (num: number) => formatNumber(num, numberFormats.percent),
    },
  };

  return {
    t,
    format: formatters,
    locale: preferences.locale,
    currency: preferences.currency,
  };
}
