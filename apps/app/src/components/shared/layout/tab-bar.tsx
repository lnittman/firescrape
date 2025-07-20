'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Compass, 
  MapTrifold, 
  Plus, 
  BookmarkSimple, 
  User,
  type Icon 
} from '@phosphor-icons/react';
import { cn } from '@repo/design/lib/utils';
import { useAtom } from 'jotai';
import { quickActionsOpenAtom } from '@/atoms/navigation';

interface TabItem {
  href: string;
  icon: Icon;
  label: string;
}

const tabs: TabItem[] = [
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/explore', icon: MapTrifold, label: 'Explore' },
  { href: '/saved', icon: BookmarkSimple, label: 'Saved' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function TabBar() {
  const pathname = usePathname();
  const [, setQuickActionsOpen] = useAtom(quickActionsOpenAtom);

  const isActive = (href: string) => {
    if (href === '/discover' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop: Hide tab bar */}
      <div className="hidden lg:hidden" />

      {/* Mobile: Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Background with blur */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t" />

        {/* Tab items */}
        <div className="relative flex items-center justify-around px-4 h-16">
          {tabs.slice(0, 2).map((tab) => (
            <TabItem 
              key={tab.href} 
              tab={tab} 
              isActive={isActive(tab.href)} 
            />
          ))}

          {/* Center Action Button */}
          <CenterActionButton onClick={() => setQuickActionsOpen(true)} />

          {tabs.slice(2).map((tab) => (
            <TabItem 
              key={tab.href} 
              tab={tab} 
              isActive={isActive(tab.href)} 
            />
          ))}
        </div>

        {/* Safe area padding for iOS */}
        <div className="h-safe-bottom bg-background" />
      </div>
    </>
  );
}

function TabItem({ 
  tab, 
  isActive 
}: { 
  tab: TabItem; 
  isActive: boolean;
}) {
  const Icon = tab.icon;

  return (
    <Link
      href={tab.href}
      className="relative flex flex-col items-center justify-center w-16 h-full group"
    >
      <motion.div
        className="relative"
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon 
          className={cn(
            "w-6 h-6 transition-colors",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground group-hover:text-foreground"
          )}
          weight={isActive ? "fill" : "regular"}
        />
        
        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 300 }}
          />
        )}
      </motion.div>

      <span 
        className={cn(
          "text-[10px] mt-1 transition-colors",
          isActive 
            ? "text-primary font-medium" 
            : "text-muted-foreground"
        )}
      >
        {tab.label}
      </span>
    </Link>
  );
}

function CenterActionButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Plus className="w-6 h-6" weight="bold" />
      
      {/* Subtle pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}