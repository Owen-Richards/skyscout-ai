export const APP_CONFIG = {
  name: 'SkyScout AI',
  description: 'AI-powered flight & trip discovery engine',
  version: '1.0.0',
  api: {
    version: 'v1',
    timeout: 30000,
  },
  features: {
    aiPredictions: true,
    mapIntegration: true,
    priceAlerts: true,
    multiLanguage: true,
  },
} as const

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'
] as const

export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'
] as const

export const FLIGHT_CLASSES = [
  'economy',
  'premium_economy', 
  'business',
  'first'
] as const

export const MAX_SEARCH_RESULTS = 100
export const DEFAULT_SEARCH_RADIUS = 50 // km
export const CACHE_TTL = 300 // 5 minutes
