import type { Metadata } from 'next';
import { Assistant, Bebas_Neue } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/providers/ClientProviders';

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'ZEKETA | Urban Streetwear Fashion',
  description: 'Premium streetwear fashion for the next generation. Shop hoodies, jackets, tops and more with free worldwide shipping.',
  keywords: ['streetwear', 'fashion', 'hoodies', 'urban wear', 'clothing', 'zeketa'],
  authors: [{ name: 'ZEKETA' }],
  creator: 'ZEKETA',
  publisher: 'ZEKETA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zeketa.com'),
  openGraph: {
    title: 'ZEKETA | Urban Streetwear Fashion',
    description: 'Premium streetwear fashion for the next generation.',
    url: 'https://zeketa.com',
    siteName: 'ZEKETA',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZEKETA | Urban Streetwear Fashion',
    description: 'Premium streetwear fashion for the next generation.',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${assistant.className} ${bebasNeue.variable} antialiased`} style={{ fontFamily: "'Assistant', sans-serif" }}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
