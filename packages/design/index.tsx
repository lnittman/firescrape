import type { ThemeProviderProps } from 'next-themes';

import { AuthProvider } from '@repo/auth/provider';

import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <AuthProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </AuthProvider>
  </ThemeProvider>
);

// Export emoji picker components
export {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
  type Emoji,
} from './components/ui/emoji-picker';

// Export popover components
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from './components/ui/popover';

// Export button component
export { Button } from './components/ui/button';
