'use client';

import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChatCircle, 
  MapPin, 
  Mountains, 
  Lightning 
} from '@phosphor-icons/react';
import { quickActionsOpenAtom } from '@/atoms/navigation';
import { useRouter } from 'next/navigation';

export function QuickActionsModal() {
  const [isOpen, setIsOpen] = useAtom(quickActionsOpenAtom);
  const router = useRouter();

  const actions = [
    {
      icon: ChatCircle,
      label: 'Ask Yuba',
      description: 'Get personalized recommendations',
      onClick: () => {
        setIsOpen(false);
        router.push('/chat');
      },
    },
    {
      icon: MapPin,
      label: 'Track Activity',
      description: 'Start recording your adventure',
      onClick: () => {
        setIsOpen(false);
        router.push('/track');
      },
    },
    {
      icon: Mountains,
      label: 'Log Past Hike',
      description: 'Add a completed activity',
      onClick: () => {
        setIsOpen(false);
        router.push('/activities/new');
      },
    },
    {
      icon: Lightning,
      label: 'Quick Conditions',
      description: 'Check current trail conditions',
      onClick: () => {
        setIsOpen(false);
        router.push('/conditions');
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-[300]"
          />

          {/* Actions Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[400] bg-background rounded-t-3xl shadow-xl"
          >
            <div className="p-6 pb-safe-bottom">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.label}
                      onClick={action.onClick}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium text-sm">{action.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {action.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}