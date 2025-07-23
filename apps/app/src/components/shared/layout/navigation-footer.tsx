'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@repo/design/lib/utils';
import { ArrowUp } from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';

interface NavigationFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function NavigationFooter({ children, className }: NavigationFooterProps) {
  const pathname = usePathname();
  const [showGoToTop, setShowGoToTop] = useState(false);
  
  // Only show on r/[id] pages
  const isRunDetailPage = pathname.startsWith('/r/');
  // Show Firecrawl attribution on home page
  const isHomePage = pathname === '/';

  // Handle scroll to show/hide "Go to top" button
  useEffect(() => {
    if (!isRunDetailPage) {
      setShowGoToTop(false);
      return;
    }

    const handleScroll = () => {
      // Show button when scrolled down more than 400px
      setShowGoToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isRunDetailPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Original children */}
      {children && (
        <div className={cn("fixed bottom-2 left-0 right-0 z-[60] flex items-center justify-center", className)}>
          {children}
        </div>
      )}
      
      {/* Firecrawl attribution - only on home page */}
      <AnimatePresence>
        {isHomePage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto"
          >
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Made with <span className="text-sm">❤️‍🔥</span> by{' '}
              <a 
                href="https://www.firecrawl.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Firecrawl
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Go to top button - only on run detail pages */}
      <AnimatePresence>
        {showGoToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto"
          >
            <button
              onClick={scrollToTop}
              className={cn(
                "h-8 w-8 bg-transparent text-muted-foreground flex items-center justify-center rounded-full border border-border transition-all duration-200",
                "hover:bg-accent hover:text-foreground hover:border-foreground/20",
                "focus:outline-none"
              )}
              aria-label="Go to top"
            >
              <ArrowUp className="w-4 h-4" weight="duotone" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}