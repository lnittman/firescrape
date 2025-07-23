'use client';

import { usePathname } from 'next/navigation';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr';
import { Link } from 'next-view-transitions';
import { cn } from '@repo/design/lib/utils';

export function NavigationTabs() {
  const pathname = usePathname();
  
  // Only show on detail pages
  const showBackButton = pathname.includes('/runs/') || 
                        pathname.includes('/account/');

  if (!showBackButton) return null;

  const getBackLink = () => {
    if (pathname.includes('/runs/')) return '/my-runs';
    if (pathname.includes('/account/')) return '/';
    return '/';
  };

  const getTitle = () => {
    if (pathname.includes('/runs/')) return 'Run Details';
    if (pathname.includes('/account/')) return 'Account';
    return '';
  };

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-transparent border-b border-border/10 lg:hidden">
      <div className="flex items-center justify-between px-4 h-12">
        <Link
          href={getBackLink()}
          className="flex items-center gap-1 -ml-1 px-1 py-1 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <CaretLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </Link>

        <h1 className="font-medium text-sm truncate max-w-[60%]">
          {getTitle()}
        </h1>

        <div className="w-12" /> {/* Spacer for centering */}
      </div>
    </div>
  );
}
