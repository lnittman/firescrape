'use client';

import Link from 'next/link';
import { MagnifyingGlass, Compass, Mountains } from '@phosphor-icons/react/dist/ssr';
import { YubaLogo } from '../logo';
import { useAtom } from 'jotai';
import { searchModalOpenAtom } from '@/atoms/modals';
import { useUser } from '@repo/auth/client';
import { UserMenu } from '../menu/user/user-menu';
import { MobileUserMenu } from '../menu/user/mobile-user-menu';
import { NotificationsWrapper } from '../menu/notifications/notifications-wrapper';
import { useIsMobile } from '@repo/design/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/design/lib/utils';

export function NavigationHeader() {
  const [, setSearchModalOpen] = useAtom(searchModalOpenAtom);
  const { user } = useUser();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // Determine active section based on pathname
  const isAdventures = pathname.includes('/my-trips');
  const isExplore = !isAdventures;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <YubaLogo variant="text" size="small" />
        </Link>

        {/* Center Navigation Toggle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background border border-border rounded-lg p-1 flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                isExplore
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Compass className="w-4 h-4" weight="duotone" />
              <span className="hidden sm:inline">Explore</span>
            </Link>
            <Link
              href="/my-trips"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                isAdventures
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Mountains className="w-4 h-4" weight="duotone" />
              <span className="hidden sm:inline">My Trips</span>
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <NotificationsWrapper />
          {/* User menu handles its own responsive behavior */}
          <div className="hidden md:block">
            {user && <UserMenu />}
          </div>
          <div className="md:hidden">
            {user && <MobileUserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}
