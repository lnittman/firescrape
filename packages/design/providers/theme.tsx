'use client';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';

const ThemeColorUpdater = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', color);
    }
  }, [resolvedTheme]);

  return null;
};

export const ThemeProvider = ({
  children,
  ...properties
}: ThemeProviderProps) => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    {...properties}
  >
    <ThemeColorUpdater />
    {children}
  </NextThemeProvider>
);
