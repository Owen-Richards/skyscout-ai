/**
 * Settings Menu Component
 * Production-ready settings dropdown for locale and currency selection
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, Check, Globe, DollarSign, ChevronDown } from 'lucide-react';
import { useI18n } from '../../contexts/i18n-context';
import { useTranslation } from '../../hooks/use-translation';
import { SUPPORTED_LOCALES, SUPPORTED_CURRENCIES } from '../../types/i18n';

interface SettingsMenuProps {
  className?: string;
}

export function SettingsMenu({ className = '' }: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'main' | 'language' | 'currency'
  >('main');
  const menuRef = useRef<HTMLDivElement>(null);
  const { preferences, updatePreferences, currentLocale, currentCurrency } =
    useI18n();
  const { t } = useTranslation();

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const handleLocaleChange = (locale: string) => {
    updatePreferences({ locale });
    setActiveSection('main');
  };

  const handleCurrencyChange = (currency: string) => {
    updatePreferences({ currency });
    setActiveSection('main');
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveSection('main');
  };

  const renderMainMenu = () => (
    <div className="py-2">
      <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {t('settings.preferences')}
      </div>

      <button
        onClick={() => setActiveSection('language')}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4" />
          <div className="text-left">
            <div className="font-medium">{t('settings.language')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentLocale.flag} {currentLocale.nativeName}
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 -rotate-90" />
      </button>

      <button
        onClick={() => setActiveSection('currency')}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4" />
          <div className="text-left">
            <div className="font-medium">{t('settings.currency')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentCurrency.symbol} {currentCurrency.name}
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 -rotate-90" />
      </button>
    </div>
  );

  const renderLanguageMenu = () => (
    <div className="py-2">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setActiveSection('main')}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
        </button>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t('settings.language')}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {Object.entries(SUPPORTED_LOCALES).map(([code, locale]) => (
          <button
            key={code}
            onClick={() => handleLocaleChange(code)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{locale.flag}</span>
              <div className="text-left">
                <div className="font-medium">{locale.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {locale.nativeName}
                </div>
              </div>
            </div>
            {preferences.locale === code && (
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCurrencyMenu = () => (
    <div className="py-2">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setActiveSection('main')}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
        </button>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t('settings.currency')}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {Object.entries(SUPPORTED_CURRENCIES).map(([code, currency]) => (
          <button
            key={code}
            onClick={() => handleCurrencyChange(code)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-medium text-gray-600 dark:text-gray-300">
                {currency.symbol}
              </span>
              <div className="text-left">
                <div className="font-medium">{code}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currency.name}
                </div>
              </div>
            </div>
            {preferences.currency === code && (
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
        aria-label={t('settings.title')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">{t('settings.title')}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {activeSection === 'main' && renderMainMenu()}
          {activeSection === 'language' && renderLanguageMenu()}
          {activeSection === 'currency' && renderCurrencyMenu()}
        </div>
      )}
    </div>
  );
}
