import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { ViewTransitions } from 'next-view-transitions';
import { DesignSystemProvider } from '@repo/design';
import { fonts } from '@repo/design/lib/fonts';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import { createMetadata } from '@repo/seo/metadata';
import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';
import { PwaProvider } from '@/components/shared';

import '../styles/globals.css';

const title = 'Your Outdoors Guide';
const description = 'Discover the perfect trails for your next adventure. Get personalized recommendations, real-time conditions, and AI-powered insights for hiking, biking, and outdoor exploration.';

export const metadata: Metadata = createMetadata({
  title,
  description,
  image: '/logo/yuba.png',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1a2f1a' },
    { media: '(prefers-color-scheme: light)', color: '#f5f5f0' },
  ],
  keywords: ['trails', 'hiking', 'outdoors', 'AI recommendations', 'trail conditions', 'adventure planning'],
  openGraph: {
    type: 'website',
    url: 'https://yuba.xyz',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/logo/yuba.png',
    shortcut: '/logo/yuba.png',
    apple: '/logo/yuba.png',
  },
});

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <ViewTransitions>
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <DesignSystemProvider>
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </DesignSystemProvider>
        </AuthProvider>
        <PwaProvider />
      </body>
    </html>
  </ViewTransitions>
);

export default RootLayout;
