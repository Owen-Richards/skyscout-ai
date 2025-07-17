/**
 * Settings Menu Component
 * Production-ready settings dropdown for locale and currency selection
 */
/**
 * Authentication Components
 * Sign in and login flow with form validation and error handling
 * Following SOLID principles and Clean Code practices
 *
 * - Single Responsibility: Handles authentication UI and flow
 * - Open/Closed: Easy to extend with additional auth providers
 * - Dependencies: Uses react-hook-form, zod validation, and auth context
 */

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUpSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /(?=.*[a-z])/,
        'Password must contain at least one lowercase letter'
      )
      .regex(
        /(?=.*[A-Z])/,
        'Password must contain at least one uppercase letter'
      )
      .regex(/(?=.*\d)/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSignIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual authentication
      console.log('Sign in:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual registration
      console.log('Sign up:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    signInForm.reset();
    signUpForm.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-sky-600 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-blue-100 mt-2">
              {mode === 'signin'
                ? 'Sign in to continue your journey'
                : 'Join SkyScout to discover amazing flights'}
            </p>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8">
            {mode === 'signin' ? (
              <form
                onSubmit={signInForm.handleSubmit(onSignIn)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...signInForm.register('email')}
                      type="email"
                      className={cn(
                        'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                        signInForm.formState.errors.email &&
                          'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Enter your email"
                    />
                  </div>
                  {signInForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...signInForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={cn(
                        'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                        signInForm.formState.errors.password &&
                          'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors',
                    'bg-blue-600 hover:bg-blue-700 text-white',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={signUpForm.handleSubmit(onSignUp)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...signUpForm.register('firstName')}
                        type="text"
                        className={cn(
                          'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                          'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                          'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                          signUpForm.formState.errors.firstName &&
                            'border-red-500 focus:ring-red-500'
                        )}
                        placeholder="First name"
                      />
                    </div>
                    {signUpForm.formState.errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {signUpForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last name
                    </label>
                    <input
                      {...signUpForm.register('lastName')}
                      type="text"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                        signUpForm.formState.errors.lastName &&
                          'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Last name"
                    />
                    {signUpForm.formState.errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {signUpForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...signUpForm.register('email')}
                      type="email"
                      className={cn(
                        'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                        signUpForm.formState.errors.email &&
                          'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Enter your email"
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...signUpForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={cn(
                        'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                        signUpForm.formState.errors.password &&
                          'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...signUpForm.register('confirmPassword')}
                      type={showPassword ? 'text' : 'password'}
                      className={cn(
                        'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                        signUpForm.formState.errors.confirmPassword &&
                          'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors',
                    'bg-blue-600 hover:bg-blue-700 text-white',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'signin'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
                <button
                  onClick={switchMode}
                  className="ml-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to manage auth modal state
export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setMode('signin');
    setIsOpen(true);
  };

  const openSignUp = () => {
    setMode('signup');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    mode,
    openSignIn,
    openSignUp,
    close,
  };
}
('use client');

import { useState, useRef, useEffect } from 'react';
import { Settings, Check, Globe, DollarSign, ChevronDown } from 'lucide-react';
import { useI18n } from '../../contexts/i18n-context';
import { useTranslation } from '../../hooks/use-translation';
import { SUPPORTED_LOCALES, SUPPORTED_CURRENCIES } from '../../types/i18n';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@skyscout/ui';

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
