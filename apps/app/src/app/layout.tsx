import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { ViewTransitions } from 'next-view-transitions';
import { DesignSystemProvider } from '@repo/design';
import { fonts } from '@repo/design/lib/fonts';
import { createMetadata } from '@repo/seo/metadata';
import { AuthProvider } from '@repo/auth/provider';
import { PwaProvider } from '@/components/shared';

import '../styles/globals.css';

const title = 'Playground';
const description = 'Turn any URL into clean data with Firescrape. A delightful playground for Firecrawl\'s powerful web scraping API. Extract markdown, HTML, screenshots and structured data effortlessly.';

export const metadata: Metadata = createMetadata({
  title,
  description,
  keywords: ['web scraping', 'data extraction', 'markdown converter', 'Firecrawl', 'API playground', 'developer tools'],
  openGraph: {
    type: 'website',
    url: 'https://firescrape.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
  },
});

export const viewport = {
  themeColor: '#FFFFFF',
};

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <ViewTransitions>
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body suppressHydrationWarning>
        <DesignSystemProvider>
          {children}
        </DesignSystemProvider>
        <PwaProvider />
      </body>
    </html>
  </ViewTransitions>
);

export default RootLayout;
