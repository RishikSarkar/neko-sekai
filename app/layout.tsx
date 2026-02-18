import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css';
import TopBar from '@/components/TopBar';
import { Nova_Mono, Nova_Square } from 'next/font/google';
import BottomBar from '@/components/BottomBar';

const inter = Inter({ subsets: ['latin'] });

const novaMono = Nova_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-nova-mono',
});

const novaSquare = Nova_Square({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-nova-square',
});

export const metadata = {
  title: 'Neko Sekai',
  description: 'Neko Sekai - A virtual pet game',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <html lang="en" className={`${novaMono.variable} ${novaSquare.variable} font-sans`}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <TopBar />
          {children}
          <BottomBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
