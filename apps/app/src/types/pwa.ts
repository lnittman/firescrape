// PWA-related type definitions

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

// Extend the Window interface to include PWA-specific events
declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
    'appinstalled': Event;
  }
}