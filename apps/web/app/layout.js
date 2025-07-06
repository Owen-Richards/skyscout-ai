import { Inter } from 'next/font/google';
import './globals.css';
import { TRPCProvider } from './components/providers/trpc-provider';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'SkyScout AI - Smart Flight Discovery',
    description: 'AI-powered flight & trip discovery engine—your eyes on every sky.',
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>);
}
