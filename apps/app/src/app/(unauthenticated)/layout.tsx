import type { ReactNode } from 'react';

import { AuthProvider } from '@repo/auth/provider';

interface UnauthenticatedLayoutProps {
  children: ReactNode;
}

export default function UnauthenticatedLayout({ children }: UnauthenticatedLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen overflow-x-hidden overflow-y-auto bg-background antialiased flex flex-col unauthenticated-layout">
        {/* Main content centered */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 pt-6 pb-0">
          <div className="w-full max-w-sm content-wrapper">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
