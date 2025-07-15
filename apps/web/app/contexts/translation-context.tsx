/**
 * Translation Management System
 * Centralized system for easy translation management
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from '../hooks/use-translation';
import type { TranslationKey } from '../lib/i18n-utils';

interface TranslationContextType {
  t: (key: TranslationKey, fallback?: string) => string;
  tNav: (item: string) => string;
  tHero: (key: string) => string;
  tSearch: (key: string) => string;
  tCommon: (key: string) => string;
  tDeals: (key: string) => string;
  tError: (key: string) => string;
  tAuth: (key: string) => string;
  tUser: (key: string) => string;
  tA11y: (key: string) => string;
  locale: string;
  currency: string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { t, locale, currency } = useI18nTranslation();

  // Convenient translation helpers for different sections
  const tNav = (item: string): string => {
    const navMap: Record<string, TranslationKey> = {
      home: 'nav.home',
      flights: 'nav.flights',
      hotels: 'nav.hotels',
      cars: 'nav.cars',
      deals: 'nav.deals',
      about: 'nav.about',
      contact: 'nav.contact',
    };
    const key = navMap[item.toLowerCase()];
    return key ? t(key) : item;
  };

  const tHero = (key: string): string => {
    const heroMap: Record<string, TranslationKey> = {
      title: 'hero.title',
      subtitle: 'hero.subtitle',
      cta: 'hero.cta',
      secondary_cta: 'hero.secondary_cta',
      trust_badge: 'hero.trust_badge',
      users_count: 'hero.users_count',
      savings: 'hero.savings',
      live_deals: 'hero.live_deals',
      ai_prediction: 'hero.ai_prediction',
      ai_accuracy: 'hero.ai_accuracy',
      instant_alerts: 'hero.instant_alerts',
      real_time: 'hero.real_time',
      price_guarantee: 'hero.price_guarantee',
      money_back: 'hero.money_back',
      security: 'hero.security',
      rating: 'hero.rating',
      support: 'hero.support',
      average_savings: 'hero.average_savings',
    };
    const translationKey = heroMap[key];
    return translationKey ? t(translationKey) : key;
  };

  const tSearch = (key: string): string => {
    const searchMap: Record<string, TranslationKey> = {
      from: 'search.from',
      to: 'search.to',
      departure: 'search.departure',
      return: 'search.return',
      passengers: 'search.passengers',
      search_flights: 'search.search_flights',
      round_trip: 'search.round_trip',
      one_way: 'search.one_way',
      multi_city: 'search.multi_city',
      class: 'search.class',
      economy: 'search.economy',
      business: 'search.business',
      first: 'search.first',
      stops: 'search.stops',
      any_stops: 'search.any_stops',
      nonstop: 'search.nonstop',
      one_stop: 'search.one_stop',
      two_plus_stops: 'search.two_plus_stops',
    };
    const translationKey = searchMap[key];
    return translationKey ? t(translationKey) : key;
  };

  const tCommon = (key: string): string => {
    const commonMap: Record<string, TranslationKey> = {
      loading: 'common.loading',
      error: 'common.error',
      try_again: 'common.try_again',
      save: 'common.save',
      cancel: 'common.cancel',
      close: 'common.close',
      back: 'common.back',
      next: 'common.next',
      previous: 'common.previous',
      search: 'common.search',
      filter: 'common.filter',
      sort: 'common.sort',
      clear: 'common.clear',
      apply: 'common.apply',
      reset: 'common.reset',
      ok: 'common.ok',
      yes: 'common.yes',
      no: 'common.no',
      select: 'common.select',
      required: 'common.required',
      optional: 'common.optional',
    };
    const translationKey = commonMap[key];
    return translationKey ? t(translationKey) : key;
  };

  const tDeals = (key: string): string => {
    const dealsMap: Record<string, TranslationKey> = {
      loading: 'deals.loading',
      error: 'deals.error',
      no_deals: 'deals.no_deals',
      try_different: 'deals.try_different',
      view_details: 'deals.view_details',
      book_now: 'deals.book_now',
      save_amount: 'deals.save_amount',
      ai_insight: 'deals.ai_insight',
      confidence: 'deals.confidence',
      stops: 'deals.stops',
      nonstop: 'deals.nonstop',
      one_stop: 'deals.one_stop',
      multi_stop: 'deals.multi_stop',
      duration: 'deals.duration',
      price_trend_up: 'deals.price_trend_up',
      price_trend_down: 'deals.price_trend_down',
      price_trend_stable: 'deals.price_trend_stable',
      book_now_action: 'deals.book_now_action',
      wait_action: 'deals.wait_action',
      monitor_action: 'deals.monitor_action',
    };
    const translationKey = dealsMap[key];
    return translationKey ? t(translationKey) : key;
  };

  const tError = (key: string): string => {
    const errorMap: Record<string, TranslationKey> = {
      network: 'error.network',
      timeout: 'error.timeout',
      server: 'error.server',
      not_found: 'error.not_found',
      unauthorized: 'error.unauthorized',
      validation: 'error.validation',
      generic: 'error.generic',
    };
    const translationKey = errorMap[key];
    return translationKey ? t(translationKey) : key;
  };

  const tAuth = (key: string): string => {
    const authMap: Record<string, TranslationKey> = {
      sign_in: 'auth.sign_in',
      sign_up: 'auth.sign_up',
      sign_out: 'auth.sign_out',
      email: 'auth.email',
      password: 'auth.password',
      confirm_password: 'auth.confirm_password',
      forgot_password: 'auth.forgot_password',
      remember_me: 'auth.remember_me',
      already_have_account: 'auth.already_have_account',
      dont_have_account: 'auth.dont_have_account',
    };
    const translationKey = authMap[key];
    return translationKey ? t(translationKey) : key;
  };

  const tUser = (key: string): string => {
    const userMap: Record<string, TranslationKey> = {
      account: 'user.account',
      'my profile': 'user.my_profile',
      'my trips': 'user.my_trips',
      'saved flights': 'user.saved_flights',
      'payment methods': 'user.payment_methods',
      preferences: 'user.preferences',
      settings: 'user.settings',
      notifications: 'user.notifications',
      support: 'user.support',
      'help center': 'user.help_center',
      'travel insurance': 'user.travel_insurance',
      'sign in': 'user.sign_in',
      'sign out': 'user.sign_out',
      guest: 'user.guest',
    };
    const translationKey = userMap[key.toLowerCase()];
    return translationKey ? t(translationKey) : key;
  };

  const tA11y = (key: string): string => {
    const a11yMap: Record<string, TranslationKey> = {
      skip_to_content: 'a11y.skip_to_content',
      menu: 'a11y.menu',
      search: 'a11y.search',
      user_menu: 'a11y.user_menu',
      settings: 'a11y.settings',
      theme_toggle: 'a11y.theme_toggle',
      language_toggle: 'a11y.language_toggle',
      close_dialog: 'a11y.close_dialog',
      loading: 'a11y.loading',
      error: 'a11y.error',
      success: 'a11y.success',
      warning: 'a11y.warning',
      info: 'a11y.info',
    };
    const translationKey = a11yMap[key];
    return translationKey ? t(translationKey) : key;
  };

  const value: TranslationContextType = {
    t,
    tNav,
    tHero,
    tSearch,
    tCommon,
    tDeals,
    tError,
    tAuth,
    tUser,
    tA11y,
    locale,
    currency,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useAppTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      'useAppTranslation must be used within a TranslationProvider'
    );
  }
  return context;
}
