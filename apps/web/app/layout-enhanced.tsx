import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { TRPCProvider } from './components/providers/trpc-provider';
import { ThemeProvider } from '@skyscout/ui';
import './globals.css';

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
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
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="//api.skyscout.ai" />
        <link rel="preconnect" href="https://api.skyscout.ai" />
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
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="skyscout-theme"
        >
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

            {/* Global loading indicator portal */}
            <div id="loading-portal" />

            {/* Global modal portal */}
            <div id="modal-portal" />

            {/* Global toast portal */}
            <div id="toast-portal" />
          </TRPCProvider>
        </ThemeProvider>

        {/* Service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
