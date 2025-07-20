'use client';

import { usePathname } from 'next/navigation';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { cn } from '@repo/design/lib/utils';

export function NavigationTabs() {
  const pathname = usePathname();
  
  // Only show on detail pages
  const showBackButton = pathname.includes('/trails/') || 
                        pathname.includes('/activities/') ||
                        pathname.includes('/profile/');

  if (!showBackButton) return null;

  const getBackLink = () => {
    if (pathname.includes('/trails/')) return '/discover';
    if (pathname.includes('/activities/')) return '/profile';
    if (pathname.includes('/profile/')) return '/profile';
    return '/';
  };

  const getTitle = () => {
    if (pathname.includes('/trails/')) return 'Trail Details';
    if (pathname.includes('/activities/')) return 'Activity';
    if (pathname.includes('/profile/settings')) return 'Settings';
    if (pathname.includes('/profile/stats')) return 'Stats';
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
