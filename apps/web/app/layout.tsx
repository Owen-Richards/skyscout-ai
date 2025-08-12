import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { TRPCProvider } from './components/providers/trpc-provider';
import { I18nProvider } from './contexts/i18n-context';
import { TranslationProvider } from './contexts/translation-context';
import './globals.css';
import { ThemeScript } from './theme-script';

import { ThemeProvider } from '@skyscout/ui/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkyScout AI - Smart Flight Discovery',
  description:
    'AI-powered flight & trip discovery engine—your eyes on every sky.',
  keywords: [
    'flights',
    'travel',
    'booking',
    'AI',
    'flight search',
    'trip planning',
    'skyscout',
  ],
  authors: [{ name: 'SkyScout AI Team' }],
  creator: 'SkyScout AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skyscout.ai',
    title: 'SkyScout AI - Smart Flight Discovery',
    description:
      'AI-powered flight & trip discovery engine—your eyes on every sky.',
    siteName: 'SkyScout AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyScout AI - Smart Flight Discovery',
    description:
      'AI-powered flight & trip discovery engine—your eyes on every sky.',
    creator: '@skyscoutai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Theme initialization script - prevents FOUC */}
        <ThemeScript />

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`
          ${inter.className} 
          min-h-screen 
          bg-background 
          text-foreground 
          antialiased 
          selection:bg-primary/20 
          selection:text-primary-foreground
          scroll-smooth
        `}
      >
        <ThemeProvider
          defaultTheme="system"
          enableSystem
          storageKey="skyscout-theme"
        >
          <I18nProvider>
            <TranslationProvider>
              <TRPCProvider>
                {/* Skip to main content for accessibility */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Skip to main content
                </a>

                {/* Main app container */}
                <div className="relative flex min-h-screen flex-col">
                  {children}
                </div>
              </TRPCProvider>
            </TranslationProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
