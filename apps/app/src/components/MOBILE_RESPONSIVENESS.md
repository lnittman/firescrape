# Mobile Responsiveness Guide

This document outlines mobile-specific patterns, components, and best practices for creating smooth, intuitive mobile experiences that complement the main [Design System](./DESIGN_SYSTEM.md).

## Core Mobile Principles

### 1. **Consistent Bottom Positioning**
All mobile overlays and modals should use `position="bottom"` for intuitive thumb-friendly interactions:

```tsx
<MobileSheet
    isOpen={isOpen}
    onClose={handleClose}
    title="Modal Title"
    position="bottom"  // Always use bottom positioning
    spacing="sm"
/>
```

### 2. **Smooth Transitions Between Modals**
When transitioning between mobile overlays, ensure seamless user experience by:
- Closing the current overlay before opening the next
- Using consistent positioning (bottom)
- Maintaining state properly with callback patterns

### 3. **Touch-Friendly Interactions**
- Minimum touch target size: 44px (h-11)
- Adequate spacing between interactive elements
- Clear visual feedback for touch interactions

## Mobile Sheet Component

### Basic Usage
```tsx
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';

<MobileSheet
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Sheet Title"
    position="bottom"
    spacing="sm"
    contentHeight="auto" // or "fill" for full height
>
    {/* Sheet content */}
</MobileSheet>
```

### Props Reference
- `isOpen`: boolean - Controls sheet visibility
- `onClose`: function - Called when sheet should close
- `title`: string - Sheet header title
- `position`: "top" | "bottom" - Always use "bottom" for consistency
- `spacing`: "sm" | "md" | "lg" - Content padding
- `contentHeight`: "auto" | "fill" - Sheet height behavior
- `showCloseButton`: boolean - Show/hide close button
- `className`: string - Additional CSS classes

## Mobile Menu Pattern

### Menu Button Component
Each mobile menu follows this pattern:

```tsx
// mobile-example-menu.tsx
"use client";

import React, { Suspense } from "react";
import { useAtom } from "jotai";
import { useAuth } from "@repo/auth/client";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import { menuOpenAtom } from "@/atoms/mobile/menus";

// Skeleton for loading state
function MobileExampleMenuSkeleton() {
    return (
        <div className="h-8 w-8 flex-shrink-0">
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    );
}

// Main menu content
function MobileExampleMenuContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(menuOpenAtom);

    const handleOpen = () => {
        setIsOpen(true);
    };

    if (!isLoaded) {
        return <MobileExampleMenuSkeleton />;
    }

    return (
        <button
            onClick={handleOpen}
            className="h-8 w-8 bg-transparent text-muted-foreground flex items-center justify-center rounded-full border border-border transition-all duration-200 hover:bg-accent hover:text-foreground hover:border-foreground/20 focus:outline-none"
            aria-label="Menu description"
        >
            <Icon className="w-4 h-4" weight="duotone" />
        </button>
    );
}

// Main exported component with Suspense
export function MobileExampleMenu() {
    return (
        <Suspense fallback={<MobileExampleMenuSkeleton />}>
            <MobileExampleMenuContent />
        </Suspense>
    );
}
```

### Overlay Component
Corresponding overlay follows this pattern:

```tsx
// mobile-example-overlay.tsx
"use client";

import React, { Suspense } from "react";
import { useAtom } from "jotai";
import { useAuth } from "@repo/auth/client";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import { menuOpenAtom } from "@/atoms/mobile/menus";

function MobileExampleOverlayContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(menuOpenAtom);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Menu Title"
            position="bottom"
            spacing="sm"
        >
            {/* Menu content */}
        </MobileSheet>
    );
}

export function MobileExampleOverlay() {
    return (
        <Suspense fallback={null}>
            <MobileExampleOverlayContent />
        </Suspense>
    );
}
```

## Callback Pattern for Cross-Modal Communication

### Problem
When one mobile modal needs to trigger another (e.g., Create Space → Emoji Picker), we need smooth transitions and proper state management.

### Solution: Callback Atoms
Use Jotai atoms to store callback functions that allow modals to communicate:

#### 1. Define Callback Atoms
```tsx
// atoms/mobile/menus.ts
export const mobileEmojiPickerOpenAtom = atom(false);
export const mobileEmojiPickerCallbackAtom = atom<((emoji: string) => void) | null>(null);
```

#### 2. Trigger Modal with Callback
```tsx
// In the modal that needs to open the emoji picker
const [, setEmojiPickerOpen] = useAtom(mobileEmojiPickerOpenAtom);
const [, setEmojiPickerCallback] = useAtom(mobileEmojiPickerCallbackAtom);

const handleOpenEmojiPicker = () => {
    // Set up callback for when emoji is selected
    setEmojiPickerCallback((selectedEmoji: string) => {
        setEmoji(selectedEmoji); // Update local state
    });
    
    // Open the emoji picker
    setEmojiPickerOpen(true);
};
```

#### 3. Execute Callback in Target Modal
```tsx
// In the emoji picker modal
const [, setIsOpen] = useAtom(mobileEmojiPickerOpenAtom);
const [callback] = useAtom(mobileEmojiPickerCallbackAtom);

const handleEmojiSelect = (emoji: string) => {
    // Execute the callback if it exists
    if (callback) {
        callback(emoji);
    }
    
    // Close the picker
    setIsOpen(false);
};
```

### Benefits of Callback Pattern
- **Smooth transitions**: No flickering between modals
- **Loose coupling**: Modals don't need direct dependencies
- **Reusable components**: Same modal can be used from different contexts
- **Clean state management**: No complex prop drilling
- **No blur overlay flash**: Previous modal stays open until new modal is ready

### Global Mobile Menu Session (Prevents Flash) ⭐
**The most robust solution**: Use a global mobile menu state that controls the blur overlay across all mobile modals/overlays:

```tsx
// atoms/modals.ts
export const isMobileMenuOpenAtom = atom(false);
```

```tsx
// components/shared/layout/mobile-blur-overlay.tsx
export function MobileBlurOverlay() {
    const [isMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);
    
    const handleBackdropClick = () => {
        // Close individual modals - they handle global state after animation
        setCreateSpaceModalOpen(false);
        setMobileSpacesOpen(false);
        // Don't close global state - let animations complete first
    };
    
    return (
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    className="fixed inset-0 z-[75] bg-background/80 backdrop-blur-md"
                    onClick={handleBackdropClick}
                />
            )}
        </AnimatePresence>
    );
}
```

```tsx
// components/shared/ui/mobile-sheet.tsx (automatic)
useEffect(() => {
    if (!isOpen) {
        // Modal is closing - close global state immediately for simultaneous animations
        setIsMobileMenuOpen(false);
    }
}, [isOpen, setIsMobileMenuOpen]);
```

**Benefits:**
- **Zero flash**: Blur overlay persists throughout entire mobile menu session
- **Automatic transitions**: No manual callback setup needed
- **Global control**: Single source of truth for mobile menu state
- **User-centric**: Only closes when user actually exits (backdrop click, navigation, etc.)
- **Synchronized animations**: Blur overlay and modals fade out simultaneously

### Legacy Callback Pattern (Advanced Use Cases)
For complex cross-modal communication, use this enhanced pattern:

```tsx
// Step 1: Define callback atom for the target modal
export const targetModalCallbackAtom = atom<(() => void) | null>(null);

// Step 2: Source modal sets callback and opens target
const handleOpenTarget = () => {
    setTargetModalCallback(() => {
        setSourceModalOpen(false); // Close source when target is ready
    });
    setTargetModalOpen(true);
};

// Step 3: Target modal executes callback before painting (prevents flash)
useLayoutEffect(() => {
    if (shouldShowModal && targetCallback) {
        targetCallback(); // Close source modal
        setTargetCallback(null); // Clear immediately
    }
}, [shouldShowModal, targetCallback, setTargetCallback]);

// Step 4: Clean up callback when target closes
const handleClose = () => {
    setTargetModalOpen(false);
    setTargetCallback(null); // Prevent memory leaks
};
```

This ensures the source modal stays open until the target modal is fully rendered, eliminating any gap where the blur overlay would disappear.

**Critical**: Use `useLayoutEffect` instead of `useEffect` to execute the callback **before** the browser paints, preventing any visual flash. `useLayoutEffect` runs synchronously and blocks painting until complete.

## Integrating New Mobile Modals

To add a new mobile modal to the global system:

1. **Modal Component**: Import and use the global state
```tsx
import { isMobileMenuOpenAtom } from "@/atoms/modals";

function NewMobileModal() {
    // No need to import isMobileMenuOpenAtom - MobileSheet handles it automatically
    
    const handleClose = () => {
        setIsOpen(false);
        // MobileSheet will handle closing global mobile menu when animation completes
    };
}
```

2. **MobileSheet Component**: Automatically handles global state
```tsx
// MobileSheet automatically:
// - Sets isMobileMenuOpen to true when opened
// - Positions above global blur overlay (z-[80])
// - Doesn't create its own blur overlay
// - Handles backdrop clicks to close modal
// - Closes global state when exit animation completes
```

3. **Global Blur Overlay**: Add to the close handler
```tsx
const handleBackdropClick = () => {
    // Add your modal to this list
    setNewModalOpen(false);
    setCreateSpaceModalOpen(false);
    setMobileSpacesOpen(false);
    setMobileEmojiPickerOpen(false);
    setMobileFeedbackOpen(false);
    setMobileNotificationsOpen(false);
    setMobileDocsOpen(false);
    setMobileUserMenuOpen(false);
    setMobileCountryPickerOpen(false);
    setMobileEmailSettingsOpen(false);
    
    // Don't close global state immediately - let animations complete
};
```

4. **Client Layout**: Already includes MobileBlurOverlay globally

## Modal Transition Examples

### Example 1: Spaces Menu → Create Space Modal (Fixed - No Flash)
```tsx
// mobile-spaces-overlay.tsx
const handleCreateSpace = () => {
    // Set up callback to close this overlay when create space modal opens
    setCreateSpaceModalCallback(() => {
        setIsOpen(false);
    });
    
    // Open create space modal (which will execute the callback)
    setCreateSpaceModalOpen(true);
};

// mobile-create-space-modal.tsx
useLayoutEffect(() => {
    if (shouldShowModal && createSpaceCallback) {
        createSpaceCallback(); // This closes the previous modal
        setCreateSpaceCallback(null); // Clear immediately
    }
}, [shouldShowModal, createSpaceCallback, setCreateSpaceCallback]);
```

### Example 2: Create Space Modal → Emoji Picker
```tsx
// mobile-create-space-modal.tsx
const handleOpenEmojiPicker = () => {
    setEmojiPickerCallback(handleEmojiSelect);  // Set callback
    setEmojiPickerOpen(true);                   // Open emoji picker
    // Note: Don't close current modal - let user return to it
};
```

### Example 3: Country Picker Pattern
```tsx
// Setting up country picker with callback
const handleOpenCountryPicker = () => {
    setSelectedCountry(currentCountry);
    setCallback({ 
        onSelect: (country) => {
            setPhoneNumber(`${country.dialCode}${localNumber}`);
        }
    });
    setIsOpen(true);
};
```

## State Management Atoms

### Organizing Mobile Menu Atoms
```tsx
// atoms/mobile/menus.ts
import { atom } from 'jotai';

// Menu open states
export const mobileUserMenuOpenAtom = atom(false);
export const mobileNotificationsOpenAtom = atom(false);
export const mobileSpacesOpenAtom = atom(false);
export const mobileFeedbackOpenAtom = atom(false);

// Callback atoms for cross-modal communication
export const mobileEmojiPickerOpenAtom = atom(false);
export const mobileEmojiPickerCallbackAtom = atom<((emoji: string) => void) | null>(null);

export const mobileCountryPickerOpenAtom = atom(false);
export const mobileCountryPickerCallbackAtom = atom<{
    onSelect?: (country: Country) => void;
} | null>(null);
```

### Modal State Atoms
```tsx
// atoms/modals.ts
export const createSpaceModalOpenAtom = atom(false);
export const searchModalOpenAtom = atom(false);
export const avatarUploadModalOpenAtom = atom(false);

// Modal callback atoms for smooth transitions
export const createSpaceModalCallbackAtom = atom<(() => void) | null>(null);
```

## Client Layout Integration

### Rendering Mobile Components
All mobile overlays and modals should be rendered in the client layout:

```tsx
// client-layout.tsx
export function ClientLayout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            {/* Main content */}
            {children}
            
            {/* Mobile Menu Overlays */}
            <MobileUserMenuOverlay />
            <MobileNotificationsOverlay />
            <MobileSpacesOverlay />
            <MobileFeedbackOverlay />
            
            {/* Reusable Mobile Components */}
            <MobileEmojiPickerMenu />
            <MobileCountryPickerOverlay />
            
            {/* Mobile Modals */}
            <MobileCreateSpaceModal />
            <MobileSearchModal />
            <MobileAvatarUploadModal />
        </div>
    );
}
```

## Responsive Breakpoints

### When to Show Mobile Components
```tsx
const isMobile = useIsMobile(); // Custom hook using window width

// Desktop modal
const shouldShowDesktop = isOpen && !isMobile;

// Mobile modal  
const shouldShowMobile = isOpen && isMobile;
```

### Auto-close on Resize
```tsx
// Hook to close mobile overlays when screen becomes desktop
function useAutoCloseOnDesktop(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (window.innerWidth >= 640) {
                onClose();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, onClose]);
}
```

## iOS Safari Considerations

### Input Focus Zoom Prevention
```tsx
<input
    style={{ fontSize: '16px' }}  // Prevents zoom on iOS
    className="..."
/>
```

### Safe Area Handling
```tsx
// For full-screen modals
<div className="h-screen pb-[env(safe-area-inset-bottom)]">
```

### Scroll Behavior
```tsx
// Prevent body scroll when modal is open
useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }
}, [isOpen]);
```

## Performance Considerations

### Lazy Loading with Suspense
Always wrap mobile components in Suspense for better performance:

```tsx
export function MobileComponent() {
    return (
        <Suspense fallback={<ComponentSkeleton />}>
            <MobileComponentContent />
        </Suspense>
    );
}
```

### Skeleton Loading States
Provide immediate visual feedback while components load:

```tsx
function MobileComponentSkeleton() {
    return (
        <div className="h-8 w-8 flex-shrink-0">
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    );
}
```

## Testing Mobile Components

### Manual Testing Checklist
- [ ] Touch targets are at least 44px
- [ ] Modals slide smoothly from bottom
- [ ] Transitions between modals are seamless
- [ ] No zoom on input focus (iOS)
- [ ] Proper scroll behavior
- [ ] Auto-close on desktop resize
- [ ] Proper keyboard navigation
- [ ] Screen reader accessibility

### Component Testing
```tsx
// Test modal transitions
test('should transition smoothly between modals', async () => {
    render(<MobileCreateSpaceModal />);
    
    // Open modal
    fireEvent.click(screen.getByLabelText('Create space'));
    expect(screen.getByText('Create New Space')).toBeVisible();
    
    // Open emoji picker
    fireEvent.click(screen.getByRole('button', { name: /emoji/ }));
    expect(screen.getByText('Choose icon')).toBeVisible();
    
    // Select emoji and return to modal
    fireEvent.click(screen.getByText('🚀'));
    expect(screen.getByText('Create New Space')).toBeVisible();
    expect(screen.getByDisplayValue('🚀')).toBeInTheDocument();
});
```

## Common Patterns Summary

1. **Always use bottom positioning** for mobile sheets
2. **Implement callback pattern** for cross-modal communication
3. **Close current modal before opening next** for smooth transitions
4. **Wrap components in Suspense** with skeleton fallbacks
5. **Handle iOS Safari quirks** (zoom prevention, safe areas)
6. **Auto-close on desktop resize** for responsive behavior
7. **Maintain consistent touch targets** (44px minimum)
8. **Use semantic HTML and ARIA labels** for accessibility

This mobile responsiveness guide ensures consistent, smooth, and accessible mobile experiences across the application. 