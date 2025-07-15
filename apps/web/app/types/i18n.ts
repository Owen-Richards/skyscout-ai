/**
 * Internationalization Types
 * Following production standards for culture codes and currencies
 */

export interface SupportedLocale {
  readonly code: string;
  readonly name: string;
  readonly nativeName: string;
  readonly flag: string;
  readonly rtl?: boolean;
}

export interface SupportedCurrency {
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly symbolPosition: 'before' | 'after';
}

export interface SupportedRegion {
  readonly code: string;
  readonly name: string;
  readonly currency: string;
  readonly dateFormat: string;
  readonly numberFormat: string;
}

export interface UserPreferences {
  readonly locale: string;
  readonly currency: string;
  readonly region: string;
  readonly timezone: string;
  readonly theme: 'light' | 'dark' | 'system';
  readonly temperatureUnit: 'celsius' | 'fahrenheit';
  readonly distanceUnit: 'metric' | 'imperial';
}

// Production-ready supported locales (ISO 639-1 + ISO 3166-1)
export const SUPPORTED_LOCALES: Record<string, SupportedLocale> = {
  'en-US': {
    code: 'en-US',
    name: 'English (United States)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (United Kingdom)',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
  },
  'en-CA': {
    code: 'en-CA',
    name: 'English (Canada)',
    nativeName: 'English (CA)',
    flag: '🇨🇦',
  },
  'en-AU': {
    code: 'en-AU',
    name: 'English (Australia)',
    nativeName: 'English (AU)',
    flag: '🇦🇺',
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Spanish (Spain)',
    nativeName: 'Español (España)',
    flag: '🇪🇸',
  },
  'es-MX': {
    code: 'es-MX',
    name: 'Spanish (Mexico)',
    nativeName: 'Español (México)',
    flag: '🇲🇽',
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'French (France)',
    nativeName: 'Français (France)',
    flag: '🇫🇷',
  },
  'fr-CA': {
    code: 'fr-CA',
    name: 'French (Canada)',
    nativeName: 'Français (Canada)',
    flag: '🇨🇦',
  },
  'de-DE': {
    code: 'de-DE',
    name: 'German (Germany)',
    nativeName: 'Deutsch (Deutschland)',
    flag: '🇩🇪',
  },
  'it-IT': {
    code: 'it-IT',
    name: 'Italian (Italy)',
    nativeName: 'Italiano (Italia)',
    flag: '🇮🇹',
  },
  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
  },
  'pt-PT': {
    code: 'pt-PT',
    name: 'Portuguese (Portugal)',
    nativeName: 'Português (Portugal)',
    flag: '🇵🇹',
  },
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
  },
  'zh-TW': {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '中文 (繁體)',
    flag: '🇹🇼',
  },
  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
  },
  'ko-KR': {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
  },
  'ar-SA': {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية (السعودية)',
    flag: '🇸🇦',
    rtl: true,
  },
  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi (India)',
    nativeName: 'हिन्दी (भारत)',
    flag: '🇮🇳',
  },
  'ru-RU': {
    code: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
  },
  'nl-NL': {
    code: 'nl-NL',
    name: 'Dutch (Netherlands)',
    nativeName: 'Nederlands (Nederland)',
    flag: '🇳🇱',
  },
  'sv-SE': {
    code: 'sv-SE',
    name: 'Swedish',
    nativeName: 'Svenska',
    flag: '🇸🇪',
  },
  'no-NO': {
    code: 'no-NO',
    name: 'Norwegian',
    nativeName: 'Norsk',
    flag: '🇳🇴',
  },
  'da-DK': {
    code: 'da-DK',
    name: 'Danish',
    nativeName: 'Dansk',
    flag: '🇩🇰',
  },
} as const;

// Production-ready supported currencies (ISO 4217)
export const SUPPORTED_CURRENCIES: Record<string, SupportedCurrency> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolPosition: 'before',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolPosition: 'before',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    symbolPosition: 'before',
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    symbolPosition: 'before',
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    symbolPosition: 'before',
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    symbolPosition: 'before',
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    symbolPosition: 'before',
  },
  KRW: {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    symbolPosition: 'before',
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    symbolPosition: 'before',
  },
  BRL: {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    symbolPosition: 'before',
  },
  MXN: {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    symbolPosition: 'before',
  },
  RUB: {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    symbolPosition: 'after',
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    symbolPosition: 'after',
  },
  SEK: {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    symbolPosition: 'after',
  },
  NOK: {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    symbolPosition: 'after',
  },
  DKK: {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
    symbolPosition: 'after',
  },
} as const;

// Default preferences for new users
export const DEFAULT_PREFERENCES: UserPreferences = {
  locale: 'en-US',
  currency: 'USD',
  region: 'US',
  timezone: 'America/New_York',
  theme: 'system',
  temperatureUnit: 'fahrenheit',
  distanceUnit: 'imperial',
} as const;
