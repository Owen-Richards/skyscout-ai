import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TRPCProvider } from './components/providers/trpc-provider';
import { ThemeProvider } from '@skyscout/ui';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkyScout AI - Smart Flight Discovery',
  description:
    'AI-powered flight & trip discovery engine—your eyes on every sky.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          enableSystem
          storageKey="skyscout-theme"
        >
          <TRPCProvider>{children}</TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
