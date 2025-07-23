'use client';

import { useEffect, useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';

import { scrapeStateAtom } from '@/atoms/scrape';
import { ScrapeInterface } from '@/components/scrape/scrape-interface';
import { CodeView } from '@/components/scrape/code-view';
import { AnimatedFire } from '@repo/design/components/motion/animated-fire';

export function HomePageClient() {
  const [scrapeState, setScrapeState] = useAtom(scrapeStateAtom);
  const [showCodeView, setShowCodeView] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentFormats, setCurrentFormats] = useState<string[]>(['markdown']);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleInputChange = (value: string) => {
    setCurrentUrl(value);
    if (value.trim()) {
      setScrapeState('typing');
    } else {
      setScrapeState('idle');
    }
  };

  // Auto-focus input on mount and reset state
  useEffect(() => {
    // Reset to idle state on mount
    setScrapeState('idle');
    inputRef.current?.focus();
    
    // Cleanup on unmount
    return () => {
      setScrapeState('idle');
    };
  }, [setScrapeState]);


  return (
    <div className="w-full flex-1 flex flex-col relative">
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col items-center justify-start pt-48 px-4 relative min-h-[calc(100vh-93px)] z-20">
          <motion.div
            className="w-full max-w-2xl mx-auto"
            animate={{
              y: scrapeState === 'idle' ? 0 : -40,
            }}
            transition={{
              y: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              }
            }}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ 
                opacity: scrapeState === 'idle' ? 1 : 0,
                y: scrapeState === 'idle' ? 0 : -4,
              }}
              transition={{ 
                opacity: { duration: 0.2, ease: "easeOut" },
                y: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              }}
              className="text-center mb-8"
            >
              <h1 
                className="font-bold select-none flex items-center justify-center gap-3 whitespace-nowrap"
                style={{ 
                  fontFamily: "'Louize Display', system-ui, sans-serif",
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
                }}
              >
                <AnimatedFire size="small" />
                What do you want to scrape?
              </h1>
            </motion.div>

            {/* Scrape Interface or Code View */}
            <div className="relative z-40">
              <AnimatePresence mode="wait">
                {!showCodeView ? (
                  <motion.div
                    key="scrape"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ScrapeInterface 
                      inputRef={inputRef}
                      onInputChange={handleInputChange}
                      onStateChange={setScrapeState}
                      onCodeClick={() => setShowCodeView(true)}
                      onFormatsChange={setCurrentFormats}
                      initialUrl={currentUrl}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CodeView
                      url={currentUrl}
                      formats={currentFormats}
                      onBack={() => setShowCodeView(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
    </div>
  );
}