import type { ReactNode } from 'react';

import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { YubaLogo } from '@/components/shared/logo';

interface UnauthenticatedLayoutProps {
  children: ReactNode;
}

export default function UnauthenticatedLayout({ children }: UnauthenticatedLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto bg-background antialiased flex flex-col unauthenticated-layout">
      {/* Theme switcher in top right */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeSwitcher />
      </div>

      {/* Main content centered */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 pt-6 pb-0">
        <div className="w-full max-w-sm content-wrapper">
          {children}
        </div>
      </div>

      {/* icon in bottom left */}
      <div className="absolute bottom-6 left-6 z-10">
        <YubaLogo size="small" variant="fox" className="opacity-60 hover:opacity-100 transition-opacity duration-200" />
      </div>
    </div>
  );
}
