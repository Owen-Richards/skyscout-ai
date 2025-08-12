# SkyScout AI - Internationalization (i18n) System

## Overview

SkyScout AI now includes a production-ready internationalization system that supports multiple languages, currencies, and cultural adaptations. This system is designed to avoid legal issues and provide a seamless experience for users worldwide.

## Features

### Supported Languages (22 locales)

- 🇺🇸 English (US) - en-US
- 🇪🇸 Spanish (Spain) - es-ES
- 🇫🇷 French (France) - fr-FR
- 🇩🇪 German (Germany) - de-DE
- 🇮🇹 Italian (Italy) - it-IT
- 🇵🇹 Portuguese (Portugal) - pt-PT
- 🇧🇷 Portuguese (Brazil) - pt-BR
- 🇳🇱 Dutch (Netherlands) - nl-NL
- 🇷🇺 Russian (Russia) - ru-RU
- 🇨🇳 Chinese (Simplified) - zh-CN
- 🇹🇼 Chinese (Traditional) - zh-TW
- 🇯🇵 Japanese (Japan) - ja-JP
- 🇰🇷 Korean (South Korea) - ko-KR
- 🇸🇦 Arabic (Saudi Arabia) - ar-SA (RTL support)
- 🇮🇳 Hindi (India) - hi-IN
- 🇮🇳 Bengali (India) - bn-IN
- 🇮🇩 Indonesian (Indonesia) - id-ID
- 🇹🇭 Thai (Thailand) - th-TH
- 🇻🇳 Vietnamese (Vietnam) - vi-VN
- 🇺🇦 Ukrainian (Ukraine) - uk-UA
- 🇵🇱 Polish (Poland) - pl-PL
- 🇹🇷 Turkish (Turkey) - tr-TR

### Supported Currencies (15 currencies)

- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- JPY - Japanese Yen
- CNY - Chinese Yuan
- KRW - South Korean Won
- INR - Indian Rupee
- BRL - Brazilian Real
- CAD - Canadian Dollar
- AUD - Australian Dollar
- CHF - Swiss Franc
- SEK - Swedish Krona
- NOK - Norwegian Krone
- DKK - Danish Krone
- PLN - Polish Zloty

### Features

- ✅ ISO 639-1 language codes + ISO 3166-1 country codes
- ✅ ISO 4217 currency codes
- ✅ RTL (Right-to-Left) support for Arabic
- ✅ Native language names and flag emojis
- ✅ Browser locale detection
- ✅ Persistent user preferences (localStorage)
- ✅ Production-ready translation system
- ✅ Currency formatting with proper localization
- ✅ Date and number formatting
- ✅ Settings menu in navigation

## Usage

### Basic Translation Hook

```tsx
import { useTranslation } from '../hooks/use-translation';

function MyComponent() {
  const { t, format } = useTranslation();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{format.currency(599)}</p>
      <p>{format.date.medium(new Date())}</p>
    </div>
  );
}
```

### Currency Formatting

```tsx
import { useCurrency } from '../contexts/i18n-context';

function PriceDisplay({ amount }: { amount: number }) {
  const { formatCurrency } = useCurrency();

  return <span>{formatCurrency(amount)}</span>;
}
```

### Locale Information

```tsx
import { useLocale } from '../contexts/i18n-context';

function LocaleInfo() {
  const { currentLocale, isRTL } = useLocale();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <span>
        {currentLocale.flag} {currentLocale.nativeName}
      </span>
    </div>
  );
}
```

### Settings Menu

The settings menu is automatically included in the navigation and provides:

- Language & Region selection
- Currency selection
- Persistent preferences
- Proper cultural adaptations

## File Structure

```
apps/web/app/
├── types/i18n.ts           # Type definitions for i18n system
├── contexts/i18n-context.tsx    # React context for i18n state
├── hooks/use-translation.ts     # Translation hook
├── lib/i18n-utils.ts           # Utility functions and translations
└── components/navigation/
    └── settings-menu.tsx       # Settings dropdown component
```

## Adding New Translations

1. **Add to `lib/i18n-utils.ts`:**

```typescript
'en-US': {
  'new.key': 'English text',
},
'es-ES': {
  'new.key': 'Texto en español',
},
```

2. **Update TypeScript types:**

```typescript
export type TranslationKey = keyof (typeof translations)['en-US'];
```

3. **Use in components:**

```tsx
const text = t('new.key');
```

## Production Considerations

### Legal Compliance

- All locale codes follow international standards
- Currency handling follows financial regulations
- RTL support prevents display issues in Arabic markets
- Proper cultural adaptations (date formats, number formats)

### Performance

- Translations are bundled at build time
- User preferences are cached in localStorage
- Context providers are optimized for minimal re-renders
- Locale detection happens only on first load

### SEO & Accessibility

- HTML lang attribute is automatically set
- HTML dir attribute is set for RTL languages
- Proper aria-labels for settings menu
- Screen reader friendly language selection

## Development

### Testing Different Locales

1. Open the application
2. Click the Settings menu in the navigation
3. Select a different Language & Region or Currency
4. Preferences are automatically saved and applied

### Adding New Locales

1. Add to `SUPPORTED_LOCALES` in `types/i18n.ts`
2. Add translations in `lib/i18n-utils.ts`
3. Test RTL support if applicable
4. Update this documentation

### Currency Formatting

- Automatically uses Intl.NumberFormat
- Respects locale-specific formatting rules
- Handles symbol positioning (before/after)
- Fallback for unsupported combinations

## Browser Support

- Modern browsers with Intl.NumberFormat support
- Fallback mechanisms for older browsers
- Graceful degradation for unsupported features

---

**Production Ready:** This i18n system is designed for production deployment with proper error handling, performance optimizations, and legal compliance for international markets.
