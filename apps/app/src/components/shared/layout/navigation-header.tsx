'use client';

import { Link } from 'next-view-transitions';
import { Fire, ClockCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import { useUser } from '@repo/auth/client';
import { UserMenu } from '../menu/user/user-menu';
import { MobileUserMenu } from '../menu/user/mobile-user-menu';
import { FeedbackMenu } from '../menu/feedback/feedback-menu';
import { MobileFeedbackMenu } from '../menu/feedback/mobile-feedback-menu';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/design/lib/utils';

export function NavigationHeader() {
  const { user } = useUser();
  const pathname = usePathname();

  // Determine active section based on pathname
  const isOnScrape = pathname === '/' || pathname === '/scrape';
  const isOnMyRuns = pathname.includes('/my-runs');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="firescrape-logo-fixed-font text-foreground text-3xl">
            Firescrape
          </span>
        </Link>

        {/* Center Navigation Toggle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background border border-border rounded-md h-8 p-0.5 flex items-center gap-0.5">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 px-3 h-full text-sm font-medium rounded-sm transition-all duration-200",
                isOnScrape
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Fire className="w-4 h-4" weight="duotone" />
              <span className="hidden sm:inline">Scrape</span>
            </Link>
            <Link
              href="/my-runs"
              className={cn(
                "flex items-center gap-2 px-3 h-full text-sm font-medium rounded-sm transition-all duration-200",
                isOnMyRuns
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <ClockCounterClockwise className="w-4 h-4" weight="duotone" />
              <span className="hidden sm:inline">My Runs</span>
            </Link>
          </div>
        </div>

        {/* User Menu - Right */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {/* Feedback Menu */}
          <div className="hidden sm:block">
            <FeedbackMenu />
          </div>
          <div className="sm:hidden">
            <MobileFeedbackMenu variant="circular" />
          </div>
          
          {/* User Menu */}
          <div className="hidden sm:block">
            {user && <UserMenu />}
          </div>
          <div className="sm:hidden">
            {user && <MobileUserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}
